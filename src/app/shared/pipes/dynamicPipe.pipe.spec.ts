import { DynamicPipe } from "./dynamicPipe.pipe";
import { FileSizePipe } from "./filesize.pipe";
import { ReflectiveInjector } from "@angular/core";

describe("Pipe: FileSize", () => {
  let dynamicPipe: DynamicPipe;

  it("converts properly", () => {
    const injector = ReflectiveInjector.resolveAndCreate([FileSizePipe]);
    dynamicPipe = new DynamicPipe(injector);
    expect(dynamicPipe.transform(65536, FileSizePipe, [])).toBe("64 KB");
  });
});
