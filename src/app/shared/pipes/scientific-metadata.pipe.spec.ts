import { ScientificMetadataPipe } from "./scientific-metadata.pipe";

describe("ScientificMetadataPipe", () => {
  it("create an instance", () => {
    const pipe = new ScientificMetadataPipe();
    expect(pipe).toBeTruthy();
  });
});
