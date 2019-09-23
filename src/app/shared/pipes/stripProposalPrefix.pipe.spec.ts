import { StripProposalPrefixPipe } from "./stripProposalPrefix.pipe";

describe("Pipe: StripProposalPrefix", () => {
  let pipe: StripProposalPrefixPipe;

  beforeEach(() => {
    pipe = new StripProposalPrefixPipe();
  });

  it("converts properly", () => {
    expect(pipe.transform("proposal-")).toBe("");
  });
  it("converts properly", () => {
    expect(pipe.transform("PROPOSAL-")).toBe("");
  });

  it("converts properly", () => {
    expect(pipe.transform("PROPOSAL")).toBe("PROPOSAL");
  });

  it("converts properly", () => {
    expect(pipe.transform("123abc")).toBe("123abc");
  });
  it("converts properly", () => {
    expect(pipe.transform(null)).toBe("");
  });
});
