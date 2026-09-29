// Requests suite: ownership, authorization and the collection contract.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { createUser, createRequestAs } from './helpers/test-data.js';
import { loginAs } from './helpers/test-auth.js';
import { cleanupCreatedData, closePool } from './helpers/cleanup.js';

after(async () => {
  await cleanupCreatedData();
  await closePool();
});

test('a requester can create a request and becomes its owner', async () => {
  const owner = await createUser({ name: 'owner' });
  const token = await loginAs(owner);

  const created = await createRequestAs(token, { priority: 'high' });

  assert.equal(created.createdBy, owner.id);
  assert.equal(created.status, 'open');
  assert.equal(created.priority, 'high');
});

test('the owner can read their own request', async () => {
  const owner = await createUser({ name: 'reader' });
  const token = await loginAs(owner);
  const created = await createRequestAs(token);

  const response = await request(app)
    .get(`/requests/${created.id}`)
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, created.id);
});

test('rejects an invalid priority before touching SQL on patch', async () => {
  const owner = await createUser({ name: 'invalid-priority-owner' });
  const agent = await createUser({ name: 'invalid-priority-agent', role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const created = await createRequestAs(ownerToken);

  const response = await request(app)
    .patch(`/requests/${created.id}`)
    .set('Authorization', `Bearer ${agentToken}`)
    .send({ priority: 'critical' });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_PRIORITY');
});

test('rejects an invalid priority before touching SQL on create', async () => {
  const owner = await createUser({ name: 'invalid-priority-creator' });
  const token = await loginAs(owner);

  const response = await request(app)
    .post('/requests')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'bad priority', priority: 'urgent' });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_PRIORITY');
});

test('allows a valid priority change after the invalid check', async () => {
  const owner = await createUser({ name: 'valid-priority-owner' });
  const agent = await createUser({ name: 'valid-priority-agent', role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const created = await createRequestAs(ownerToken, { priority: 'low' });

  const response = await request(app)
    .patch(`/requests/${created.id}`)
    .set('Authorization', `Bearer ${agentToken}`)
    .send({ priority: 'high' });

  assert.equal(response.status, 200);
  assert.equal(response.body.priority, 'high');
});

test('rejects malformed request ids before looking up a request', async () => {
  const user = await createUser({ name: 'invalid-id' });
  const token = await loginAs(user);
  const invalidIds = ['not-a-number', '1.5', '0', '-3', '12abc'];

  for (const id of invalidIds) {
    const response = await request(app)
      .get(`/requests/${id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'INVALID_REQUEST_ID');
  }
});

test('keeps a well-formed missing request id as 404', async () => {
  const user = await createUser({ name: 'missing-id' });
  const token = await loginAs(user);

  const response = await request(app)
    .get('/requests/999999999')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'REQUEST_NOT_FOUND');
});

test('a requester cannot access another user request', async () => {
  // Prepare
  const owner = await createUser({ name: 'victim' });
  const stranger = await createUser({ name: 'stranger' });
  const ownerToken = await loginAs(owner);
  const strangerToken = await loginAs(stranger);
  const savedRequest = await createRequestAs(ownerToken);

  // Act
  const response = await request(app)
    .get(`/requests/${savedRequest.id}`)
    .set('Authorization', `Bearer ${strangerToken}`);

  // Check
  assert.equal(response.status, 404);
});

test('the collection requires a Bearer token', async () => {
  const response = await request(app).get('/requests');
  assert.equal(response.status, 401);
});

test('a requester cannot change the priority, even of their own request', async () => {
  const owner = await createUser({ name: 'nopriority' });
  const token = await loginAs(owner);
  const created = await createRequestAs(token);

  const response = await request(app)
    .patch(`/requests/${created.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ priority: 'low' });

  assert.equal(response.status, 403);
});

test('an agent can move a request through a valid transition', async () => {
  const owner = await createUser({ name: 'transowner' });
  const agent = await createUser({ name: 'agent', role: 'agent' });
  const ownerToken = await loginAs(owner);
  const agentToken = await loginAs(agent);
  const created = await createRequestAs(ownerToken);

  const response = await request(app)
    .patch(`/requests/${created.id}`)
    .set('Authorization', `Bearer ${agentToken}`)
    .send({ status: 'in_progress' });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'in_progress');
});

// ── BUG-106 regression test ────────────────────────────────────────────
// A valid filter with zero matches is an EMPTY COLLECTION, not a missing
// resource. This test pins that decision so it cannot silently regress.
test('returns an empty array when a valid filter has no matches', async () => {
  // Prepare: a fresh requester who has created nothing at all.
  const loner = await createUser({ name: 'loner' });
  const token = await loginAs(loner);

  // Act
  const response = await request(app)
    .get('/requests?status=closed')
    .set('Authorization', `Bearer ${token}`);

  // Check: both the status AND the body — 200 with something that is not
  // an empty array would still be a broken contract.
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, []);
});
