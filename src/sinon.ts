// You know how Nock mocks http requests? Sinon mocks functions.
// If you are testing function A which calls another function B,
// then you might need to mock function B's behavior and prevent
// it from being called. For example, assume that our login function
// calls a function "authenticate" from class "User" and we know that
// the function would fail with the credentials given in the test.
// Then we can use Sinon to stub this function and force it to succeed
// during the test:
import { createServer } from "node:http";
import { describe, it } from "node:test";
import sinon from "sinon";
import nock from 'nock';
import chai from 'chai';
import assert from "node:assert";

class User {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }

    public login(name: string) {
        console.log(`${name} is logged`)
    }
}

const server = createServer()

describe("Login functionality", () => {
  it("should return authentication token", async () => {
    const credentials = {
      email: "user@mail.com",
      password: "password123",
    };

    /**
     * when function authenticate that exists in class User is called with
     * payload { email: 'user@mail.com', password: 'password123' }, then
     * don't call the function and instead return { success: true }
     */
    let stub = sinon.stub(User, "authenticate");
    stub.withArgs(credentials).returns({ success: true });

    nock("analytics.com", {
      reqheaders: {
        "content-type": "application/json",
      },
    })
      .post("/api/loggedIn", {
        email: credentials.email,
      })
      .reply(200);

    const res = await chai
      .use(server)
      .post("/login")
      .set("Content-Type", "application/javascript")
      .send(credentials);

    assert.equal(res.statusCode, 200);
    assert.ok(res.body, "access_token");
  });
});
