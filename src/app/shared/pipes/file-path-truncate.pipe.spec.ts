import { FilePathTruncate } from "./file-path-truncate.pipe";

describe("Pipe: FileSize", () => {
  let pipe: FilePathTruncate;

  beforeEach(() => {
    pipe = new FilePathTruncate();
  });

  it("converts properly", () => {
    expect(pipe.transform("xxx/yyy")).toBe("yyy");
  });

  it("does not convert slashless string", () => {
    expect(pipe.transform("xxx")).toBe("xxx");
  });
});
