import * as user from "../user";

describe("user handler", () => {
  it("should create a new user", async () => {
    const req = { body: { username: "hello", password: "hi" } };
    const res = {
      json({ token }) {
        console.log("Test Token", token);
        expect(token).toBeTruthy();
      },
    };

    // @ts-ignore
    await user.createNewUser(req, res, () => {});
  });
});
