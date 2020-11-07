import request from "supertest";

import { app } from "../../app";

it("returns a 200 and Cookie on successful signin", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        .expect(201)
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        .expect(200)
    expect(response.get("Set-Cookie")).toBeDefined();


})


it("fails a 200 on nonexisting signin", async () => {

    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        .expect(400)
})


it("fails on invalid credantial signin", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "123456"
        })
        .expect(201)
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "123df456"
        })
        .expect(400)
})