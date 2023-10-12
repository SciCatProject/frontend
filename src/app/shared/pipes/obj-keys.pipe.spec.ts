import { ObjKeysPipe } from "./obj-keys.pipe";

describe("ObjKeysPipe", () => {
  it("create an instance", () => {
    const pipe = new ObjKeysPipe();
    expect(pipe).toBeTruthy();
  });

  it("should sort an object into an array of keys and values", () => {
    const pipe = new ObjKeysPipe();
    const testObject = { name: "Gary", age: 57 };
    expect(pipe.transform(testObject, [])).toEqual([
      { key: "name", value: "Gary" },
      { key: "age", value: 57 },
    ]);
  });
});
