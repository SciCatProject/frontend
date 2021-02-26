import { DynamicPipe } from "./dynamicPipe.pipe";
import { FileSizePipe } from "./filesize.pipe";
import { Injector } from "@angular/core";

describe("Pipe: FileSize", () => {
  let dynamicPipe: DynamicPipe;

  it("converts properly", () => {
    const injector = Injector.create({providers: [{provide: FileSizePipe}]});
    dynamicPipe = new DynamicPipe(injector);
    expect(dynamicPipe.transform(65536, FileSizePipe, [])).toBe("64 KB");
  });
});
