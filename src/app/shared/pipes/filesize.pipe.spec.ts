import { FileSizePipe } from "./filesize.pipe";

describe("Pipe: FileSize", () => {
  let pipe: FileSizePipe;

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it("converts properly", () => {
    expect(pipe.transform(3746356)).toBe("4 MB");
  });

  it("converts empty string to 0 B", () => {
    expect(pipe.transform(0)).toBe("0 B");
  });
});
