// app.test.js
const request = require('supertest');
const app = require('../app');

let server;

beforeAll(() => {
    server = app.listen(3000);
});

afterAll((done) => {
    server.close(done);
});


describe ('Event API', () => {
    it('should return the index', async () => {
        const res = await request(app).get('/')
        
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.text).toContain('<title>Candlestick Patterns</title>');
        
    });

    it('should return the csChart ejs file with the event id in the canvas element', async () => {
        const res = await request(app).get('/cschart/TEST')
        
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.text).toContain('<canvas data-event=\"TEST\" id=\"candlestickChart\" class=\"chart\"></canvas>');
        
    });

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

    it('should return an error from fetching event data', async () => {
        const event = { event: 'test', ticker: null };

        const res = await request(app)
        .get('/api/TEST')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Event ID is not valid")

    });
});