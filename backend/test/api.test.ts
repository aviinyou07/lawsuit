import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../src/app.js';
import { pool } from '../src/database/index.js';

describe('Lawsuit Backend API End-to-End Test Suite', () => {
  let authToken = '';
  let userId = '';
  const testLawyerId = 'b0000000-0000-0000-0000-000000000001';
  let createdAppointmentId = '';

  after(async () => {
    await pool.end();
  });

  // 1. Health check
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'healthy');
  });

  // 2. Categories
  it('GET /api/v1/categories returns 11 legal categories with specializations', async () => {
    const res = await request(app).get('/api/v1/categories');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length >= 11);
    assert.ok(res.body.data[0].slug);
    assert.ok(res.body.data[0].name);
  });

  // 3. Auth OTP flow
  it('POST /api/v1/auth/send-otp dispatches OTP for client', async () => {
    const res = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({ phone_country_code: '+91', phone_number: '9876543210', role: 'CLIENT' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('POST /api/v1/auth/verify-otp issues JWT tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone_country_code: '+91', phone_number: '9876543210', otp: '123456' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.tokens.access_token);
    authToken = res.body.data.tokens.access_token;
    userId = res.body.data.user.id;
  });

  // 4. Authenticated Profile
  it('GET /api/v1/auth/me returns authenticated client profile', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.id, userId);
  });

  // 5. Lawyer Directory Search
  it('GET /api/v1/lawyers returns verified lawyers with ratings and fees', async () => {
    const res = await request(app).get('/api/v1/lawyers');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length >= 1);
    assert.ok(res.body.data[0].full_name.includes('Rajesh Sharma'));
  });

  it('GET /api/v1/lawyers/:id returns detailed advocate profile', async () => {
    const res = await request(app).get(`/api/v1/lawyers/${testLawyerId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.bar_council_number, 'D/1482/2010');
  });

  // 6. Availability Slots
  it('GET /api/v1/lawyers/:id/availability returns available time slots', async () => {
    const res = await request(app).get(`/api/v1/lawyers/${testLawyerId}/availability?date=2026-10-20&mode=VIDEO`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.slots.length > 0);
  });

  // 7. Calculate Quote
  it('POST /api/v1/bookings/calculate-quote returns pricing breakdown', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/calculate-quote')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ lawyer_id: testLawyerId, consultation_mode: 'VIDEO' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.total_amount > 0);
  });

  // 8. Create Appointment
  it('POST /api/v1/bookings/create books an appointment and creates consultation room', async () => {
    const res = await request(app)
      .post('/api/v1/bookings/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        lawyer_id: testLawyerId,
        consultation_mode: 'VIDEO',
        scheduled_start: '2026-10-20T10:00:00.000Z',
        client_case_brief: 'Discussion regarding tenant notice',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.appointment.booking_reference.includes('LAW-'));
    createdAppointmentId = res.body.data.appointment.id;
  });

  // 9. Join Room
  it('POST /api/v1/consultations/:id/join generates Agora token', async () => {
    const res = await request(app)
      .post(`/api/v1/consultations/${createdAppointmentId}/join`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.agora_token);
    assert.ok(res.body.data.agora_channel_name);
  });

  // 10. AI Triage "Describe My Problem"
  it('POST /api/v1/triage/analyze classifies issue and recommends lawyers', async () => {
    const res = await request(app)
      .post('/api/v1/triage/analyze')
      .send({ problem_text: 'My cheque of Rs 200000 bounced due to insufficient funds' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.analysis.category_slug, 'financial-disputes');
    assert.strictEqual(res.body.data.analysis.urgency, 'HIGH');
    assert.ok(res.body.data.legal_disclaimer);
  });

  // 11. Document Services Catalog
  it('GET /api/v1/documents/services returns available drafting templates', async () => {
    const res = await request(app).get('/api/v1/documents/services');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });
});
