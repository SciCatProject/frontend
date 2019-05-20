import { ReplaceUnderscorePipe } from "./replace-underscore.pipe";

describe("ReplaceUnderscorePipe", () => {
  it("create an instance", () => {
    const pipe = new ReplaceUnderscorePipe();
    expect(pipe).toBeTruthy();
  });
});
