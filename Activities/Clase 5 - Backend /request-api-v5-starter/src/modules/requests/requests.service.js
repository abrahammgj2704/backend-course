import { withTransaction } from '../../database/transaction.js';
import {
  findAll,
  findById,
  insertRequest,
  updateRequest,
  insertStatusHistory,
  findHistory
} from './requests.store.js';
import { mapRequestRow, mapHistoryRow } from './request.mapper.js';
import { STATUSES, isValidStatus, isTerminal, canTransition } from './request-status.js';
import { AppError } from '../../app-error.js';
import {
  canCreateRequest,
  canEditContent,
  canChangePriority,
  canChangeStatus,
  canViewRequest,
  canViewHistory
} from './request.policy.js';

const PRIORITIES = ['low', 'medium', 'high'];
const UPDATABLE_FIELDS = ['title', 'description', 'priority', 'status'];
const SERVER_CONTROLLED_FIELDS = ['id', 'createdBy', 'createdAt', 'updatedAt', 'changedBy'];

function assertValidPriority(priority) {
  if (!PRIORITIES.includes(priority)) {
    throw new AppError('contract', 'INVALID_PRIORITY',
      `Unknown priority "${priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }
}

export async function listRequests(actor, filters = {}) {
  if (filters.status !== undefined && !isValidStatus(filters.status)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown status "${filters.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (filters.priority !== undefined && !PRIORITIES.includes(filters.priority)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown priority "${filters.priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }

  const storeFilters = { ...filters };
  if (actor.role === 'requester') {
    storeFilters.createdBy = actor.userId;
  }

  const rows = await findAll(storeFilters);
  return rows.map(mapRequestRow);
}

export async function getRequest(actor, id) {
  const row = await findById(id);
  if (!row) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }

  const request = mapRequestRow(row);

  // Visibilidad previa: un requester no debe saber si existe una solicitud ajena
  if (!canViewRequest(actor, request)) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }

  return request;
}

export async function createRequest(actor, input) {
  if (!canCreateRequest(actor)) {
    throw new AppError('forbidden', 'FORBIDDEN', 'Agents cannot create requests.');
  }

  // Rechazar campos controlados por el servidor
  if (input && typeof input === 'object') {
    for (const field of [...SERVER_CONTROLLED_FIELDS, 'status']) {
      if (field in input) {
        throw new AppError('contract', 'SERVER_CONTROLLED_FIELD', `Field '${field}' is server-controlled.`);
      }
    }
  }

  const { title, description, priority } = input ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError('contract', 'TITLE_REQUIRED', 'A request needs a non-empty title.');
  }
  if (priority !== undefined) assertValidPriority(priority);

  const row = await withTransaction(async (client) => {
    const created = await insertRequest({
      title: title.trim(),
      description: typeof description === 'string' ? description : null,
      priority: priority ?? 'medium',
      createdBy: actor.userId
    }, client);

    await insertStatusHistory(created.id, null, created.status, actor.userId, client);
    return created;
  });

  return mapRequestRow(row);
}

export async function patchRequest(actor, id, body) {
  // 1. Validar si incluye campos controlados por el servidor
  if (body && typeof body === 'object') {
    for (const field of SERVER_CONTROLLED_FIELDS) {
      if (field in body) {
        throw new AppError('contract', 'SERVER_CONTROLLED_FIELD', `Field '${field}' is server-controlled.`);
      }
    }
  }

  const changes = {};
  for (const field of UPDATABLE_FIELDS) {
    if (body?.[field] !== undefined) changes[field] = body[field];
  }

  if (Object.keys(changes).length === 0) {
    throw new AppError('contract', 'NO_UPDATABLE_FIELDS',
      `The body must include at least one of: ${UPDATABLE_FIELDS.join(', ')}.`);
  }

  // 2. Validaciones básicas de contrato
  if (changes.title !== undefined && (typeof changes.title !== 'string' || changes.title.trim() === '')) {
    throw new AppError('contract', 'TITLE_REQUIRED', 'The title cannot be empty.');
  }
  if (changes.priority !== undefined) assertValidPriority(changes.priority);
  if (changes.status !== undefined && !isValidStatus(changes.status)) {
    throw new AppError('contract', 'INVALID_STATUS',
      `Unknown status "${changes.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (changes.title !== undefined) changes.title = changes.title.trim();

  // 3. Obtener el estado actual dentro de la transacción
  return await withTransaction(async (client) => {
    const current = await findById(id, client);
    if (!current) {
      throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
    }

    const request = mapRequestRow(current);

    // Si un requester intenta acceder a una solicitud ajena -> 404 Not Found
    if (!canViewRequest(actor, request)) {
      throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
    }

    // 4. Evaluar permisos de modificación sobre los campos recibidos (Todo o Nada)
    const touchesContent = changes.title !== undefined || changes.description !== undefined;
    const touchesPriority = changes.priority !== undefined;
    const touchesStatus = changes.status !== undefined;

    if (touchesContent && !canEditContent(actor, request)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'You cannot edit content on this request.');
    }
    if (touchesPriority && !canChangePriority(actor)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'Only agents can change priority.');
    }
    if (touchesStatus && !canChangeStatus(actor)) {
      throw new AppError('forbidden', 'FORBIDDEN', 'Only agents can change status.');
    }

    // 5. Reglas de negocio del dominio (Estado terminal y transiciones -> 409 Conflict)
    if (isTerminal(current.status)) {
      throw new AppError('domain', 'REQUEST_IN_TERMINAL_STATUS',
        `Request ${id} is ${current.status} and can no longer be modified.`);
    }

    const statusChanges = changes.status !== undefined && changes.status !== current.status;
    if (statusChanges && !canTransition(current.status, changes.status)) {
      throw new AppError('domain', 'INVALID_STATUS_TRANSITION',
        `A request cannot move from ${current.status} to ${changes.status}.`);
    }

    // 6. Aplicar la actualización
    const updated = await updateRequest(id, changes, client);
    if (statusChanges) {
      await insertStatusHistory(id, current.status, changes.status, actor.userId, client);
    }
    return mapRequestRow(updated);
  });
}

export async function getHistory(actor, id) {
  const request = await getRequest(actor, id); // Reutiliza getRequest para la verificación de visibilidad (404)
  const rows = await findHistory(request.id);
  return rows.map(mapHistoryRow);
}