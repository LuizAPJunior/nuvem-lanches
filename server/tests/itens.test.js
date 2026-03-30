// tests/itens.test.js
const request = require('supertest');

jest.mock('../supabase', () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
  },
}));

const app = require('../app');

describe('Itens API', () => {
  it('GET /itens → deve retornar 200', async () => {
    const res = await request(app).get('/itens');
    expect(res.statusCode).toBe(200);
  });
});