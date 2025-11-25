// app.test.js
const request = require('supertest');
const app = require('../app');

describe('Event API', () => {
    it('should return an error on the event trigger', async () => {
        const res = await request(app).get('/api/start');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Array);
    });
});