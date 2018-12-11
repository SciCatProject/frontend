import { JsonHeadPipe } from "./json-head.pipe";

describe("JsonHeadPipe", () => {
  it("create an instance", () => {
    const pipe = new JsonHeadPipe();
    expect(pipe).toBeTruthy();
  });
});
