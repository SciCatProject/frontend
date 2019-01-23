import { NumericPipe } from "./numeric.pipe";

describe("Pipe: Numeric", () => {
  let pipe: NumericPipe;

  beforeEach(() => {
    pipe = new NumericPipe();
  });

  it("converts properly", () => {
    expect(pipe.transform("abc123def")).toBe("123");
  });

  it("converts properly", () => {
    expect(pipe.transform("!#¤%&/)1\"/()=MFL2IDA,lds.-,m'3åäö¨ |><½~^´`\\")).toBe("123");
  });
});
