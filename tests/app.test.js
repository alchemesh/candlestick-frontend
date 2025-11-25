// app.test.js
const request = require('supertest');
const app = require('../app');

describe ('Event API', () => {
    it('should return an error on the event trigger', async () => {
        const event = { event: 'test', ticker: null };

        const res = await request(app)
        .post('/api/start')
        .send(event)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Could not process the event")
    });
});