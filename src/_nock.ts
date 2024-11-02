// test a function, however, the function
// itself makes http requests to another service
import { describe, it } from "node:test";
import nock from "nock";
import { createServer } from "node:http";
import { chai } from "chai";
import assert from "node:assert";

const server = createServer();

describe("Login functionality", () => {
  it("should return authentication token", async () => {
    const credentials = {
      email: "user@mail.com",
      password: "password123",
    };

    /**
     * if a post request is sent to analytics.com/api/loggedIn with
     * payload { email: 'user@mail.com' }, then don't send the request
     * and respond with 200
     */
    nock("analytics.com", {
      reqheaders: {
        "content-type": "application/json",
      },
    })
      .post("/api/loggedIn", {
        email: credentials.email,
      })
      .reply(200);
    /**
     * when we call /login on our server with user email 'user@mail.com'
     * it will call analytics.com/api/loggedIn with payload { email: 'user@mail.com' }
     * which is the request nocked above
     */
    const res = await chai
      .use(server)
      .post("/login")
      .set("Content-Type", "application/javascript")
      .send(credentials);

    assert.equal(res.statusCode, 200);
    assert.ok(res.body, "access_token");
  });
});
