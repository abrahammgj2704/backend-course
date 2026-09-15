import { pool } from '../../database/pool.js';

export async function findAll(filters = {}, db = pool) {
  const conditions = [];
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.priority) {
    values.push(filters.priority);
    conditions.push(`priority = $${values.length}`);
  }

  if (filters.createdBy !== undefined) {
    values.push(filters.createdBy);
    conditions.push(`created_by = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, title, description, priority, status, created_by, created_at, updated_at
    FROM requests
    ${whereClause}
    ORDER BY id DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
}

export async function findById(id, db = pool) {
  const { rows } = await db.query(
    `SELECT id, title, description, priority, status, created_by, created_at, updated_at
     FROM requests
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function insertRequest({ title, description, priority, createdBy }, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO requests (title, description, priority, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, priority, status, created_by, created_at, updated_at`,
    [title, description, priority, createdBy]
  );
  return rows[0];
}

export async function updateRequest(id, changes, db = pool) {
  const entries = Object.entries(changes);
  if (entries.length === 0) {
    return null;
  }

  const values = [];
  const assignments = entries.map(([field, value]) => {
    values.push(value);
    return `${field} = $${values.length}`;
  });

  values.push(id);

  const { rows } = await db.query(
    `UPDATE requests
     SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length}
     RETURNING id, title, description, priority, status, created_by, created_at, updated_at`,
    values
  );

  return rows[0] || null;
}

export async function insertStatusHistory(requestId, previousStatus, newStatus, changedBy, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO request_status_history (request_id, previous_status, new_status, changed_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id, request_id, previous_status, new_status, changed_by, changed_at`,
    [requestId, previousStatus, newStatus, changedBy]
  );
  return rows[0];
}

export async function findHistory(requestId, db = pool) {
  const { rows } = await db.query(
    `SELECT id, request_id, previous_status, new_status, changed_by, changed_at
     FROM request_status_history
     WHERE request_id = $1
     ORDER BY changed_at ASC, id ASC`,
    [requestId]
  );
  return rows;
}