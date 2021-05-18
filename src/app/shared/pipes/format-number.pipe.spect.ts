import { FormatNumberPipe } from "./format-number.pipe";

describe("FormatNumberPipe", () => {
  it("create an instance", () => {
    const pipe = new FormatNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it("returns exponential number when number >= 1e5 ", () => {
    const pipe = new FormatNumberPipe();
    const nbr = 100000;
    const formatted = pipe.transform(nbr);
    expect(formatted.toString()).toEqual("1e+5");
  });

  it("returns exponential number when number <= 1e-5", () => {
    const pipe = new FormatNumberPipe();
    const nbr = 0.00001;
    const formatted = pipe.transform(nbr);
    expect(formatted.toString()).toEqual("1e-5");
  });
  it("returns number when 1e-5 <= number <= 1e5", () => {
    const pipe = new FormatNumberPipe();
    const nbr = 0.0001;
    const formatted = pipe.transform(nbr);
    expect(formatted).toEqual(nbr);
  });
  it("returns null when number is null", () => {
    const pipe = new FormatNumberPipe();
    const nbr = null;
    const formatted = pipe.transform(nbr);
    expect(formatted).toBeNull();
  });
  it("returns undefined when number is undefined", () => {
    const pipe = new FormatNumberPipe();
    const nbr = undefined;
    const formatted = pipe.transform(nbr);
    expect(formatted).toBeUndefined();
  });
  it("returns string when number is a string", () => {
    const pipe = new FormatNumberPipe();
    const nbr = "test";
    const formatted = pipe.transform(nbr);
    expect(formatted).toEqual("test");
  });
});
