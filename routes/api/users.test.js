const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config()

const app = require("../../app");


const {DB_TEST_HOST, PORT = 5000} = process.env;

describe("test users", () => {
    let server;
    beforeAll(() => {server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))});
    afterAll(() => server.close());

    beforeEach((done) => {
        mongoose.connect(DB_TEST_HOST).then(() => done())
    })

    afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done())
        })
    })

    test("test login route", async () => {
        const loginData = {
            email: "dima@example.com",
            password: "123456"
        };

        const response = await request(app).post("/api/users/login").send(loginData);

        // check response
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        expect(response.body.user.subscription).toBeTruthy();
        expect(response.body.user.email).toBe(loginData.email);
        
    })
})