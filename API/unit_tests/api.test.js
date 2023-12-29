const supertest = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const dotenv = require("dotenv");
const app = require("../app");
const path = require("path");


dotenv.config({ path: path.join(__dirname, "../.env") });

let token = null;
let areaId = null;

describe("Test express", () => {
    it("GET /about", (done) => {
        supertest(app)
            .get("/about")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                done();
            });
    });

    it("POST /auth/login", (done) => {
        supertest(app)
            .post("/auth/login")
            .send({
                email: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD,
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error("Test failed:", err);
                    process.exit(1);
                }
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys("msg", "jwt");
                expect(res.body.msg).to.equal("ok");
                expect(res.body.jwt).to.be.a("string").and.not.empty;
                token = res.body.jwt;
                done();
            });
    });

    it("GET /api/me", (done) => {
        supertest(app)
            .get("/api/me")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.all.keys("msg", "data");
                expect(res.body.msg).to.equal("ok");
                expect(res.body.data).to.be.an("object");
                expect(res.body.data).to.have.all.keys(
                    "confirmed",
                    "lastName",
                    "createdTime",
                    "connected",
                    "id",
                    "email",
                    "firstName"
                );
                done();
            });
    });

    it("GET /api/services", (done) => {
        supertest(app)
            .get("/api/services")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("array");
                for (let i = 0; i < res.body.length; i++) {
                    expect(res.body[i]).to.include.keys(
                        "app",
                        "icon",
                        "authUrl",
                        "actions",
                        "reactions"
                    );
                    expect(res.body[i].app).to.be.a("string").and.not.empty;
                    expect(res.body[i].icon).to.be.a("string").and.not.empty;
                    expect(res.body[i].authUrl).to.be.a("string").and.not.empty;
                    expect(res.body[i].actions).to.be.an("array");
                    expect(res.body[i].reactions).to.be.an("array");
                }
                done();
            });
    });

    it("POST /api/area", (done) => {
        supertest(app)
            .post("/api/area")
            .set("Authorization", `Bearer ${token}`)
            .send({
                action: "discordReceiveMp",
                app: "Discord",
                reactions: [
                    {
                        app: "Discord",
                        reaction: "discordSendMp",
                    },
                ],
            })
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys("msg");
                expect(res.body.msg).to.equal("ok");
                done();
            });
    });

    it("GET /api/area", (done) => {
        supertest(app)
            .get("/api/area")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys("msg", "data");
                expect(res.body.msg).to.equal("ok");
                expect(res.body.data).to.be.an("array");
                if (res.body.data.length > 1)
                    console.log("[WARNING] More than one area found");
                expect(res.body.data).to.have.lengthOf.at.least(1);
                areaId = res.body.data[0].id;
                done();
            });
    });

    it("PUT /api/area", (done) => {
        supertest(app)
            .put("/api/area")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id: areaId,
                active: false,
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys("msg");
                expect(res.body.msg).to.equal("ok");
                done();
            });
    });

    it("DELETE /api/area", (done) => {
        supertest(app)
            .delete("/api/area")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id: areaId
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys("msg");
                expect(res.body.msg).to.equal("ok");
                done();
            });
    });
});
