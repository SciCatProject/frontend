import { Injector } from "@angular/core";
import { inject } from "@angular/core/testing";
import { NewDynamicPipe } from "./newDynamicPipe.pipe";

describe("NewDynamicPipe", () => {
  it("should create an instance", inject([Injector], (injector: Injector) => {
    const pipe = new NewDynamicPipe(injector);
    expect(pipe).toBeTruthy();
  }));

  it("should return the value if pipeDef is undefined", inject(
    [Injector],
    (injector: Injector) => {
      const pipe = new NewDynamicPipe(injector);

      const value = "test";
      const pipeDef = undefined;
      const res = pipe.transform(value, pipeDef);

      expect(res).toEqual(value);
    },
  ));

  it("should return the value if pipeDef length equals 0", inject(
    [Injector],
    (injector: Injector) => {
      const pipe = new NewDynamicPipe(injector);

      const value = "test";
      const pipeDef = "";
      const res = pipe.transform(value, pipeDef);

      expect(res).toEqual(value);
    },
  ));

  it("should return the value if the pipe does not exist", inject(
    [Injector],
    (injector: Injector) => {
      const pipe = new NewDynamicPipe(injector);

      const value = "test";
      const pipeDef = "testPipe";
      const res = pipe.transform(value, pipeDef);

      expect(res).toEqual(value);
    },
  ));
});
