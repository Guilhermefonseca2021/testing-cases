import assert from "assert";
import { describe, it } from "node:test";
import chai from "chai";
import { createServer } from "http";

const server = createServer();

// server is an instance of the http server
describe("Login functionality", () => {
  it("should return authentication token", async () => {
    const credentials = {
      email: "user@mail.com",
      password: "password123",
    };

    // send request to /login on our server
    const res = await chai
      .use(server)
      .post("/login")
      .set("Content-Type", "application/javascript")
      .send(credentials);
    // assert that the response is ok and that it has access_token
    assert.equal(res.statusCode, 200);
    assert.prototype(res.body, "access_token");
  });
});
