// app.test.js
const request = require('supertest');
const app = require('../app');
//const fs = require('fs');
//const path = require('path');

let server;

beforeAll(() => {
    server = app.listen(3000);
});

afterAll((done) => {
    server.close(done);
});


describe ('Event API', () => {
    it('should return the index', async () => {
        //const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
        //document.documentElement.innerHTML = html; // Set the HTML content
        // Manually trigger DOMContentLoaded if your script relies on it
        //document.dispatchEvent(new Event('DOMContentLoaded'));

        const res = await request(app).get('/')
        
        expect(res.statusCode).toEqual(200);
        //expect(res.body).toContain('<title>Candlestick Patterns</title>');
        expect(res.headers['content-type']).toMatch(/text\/html/);

        //expect(res.body).toBeInstanceOf(Object);
        //expect(res.body.message).toEqual("Could not process the event")


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
});