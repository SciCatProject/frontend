import { FacetCount } from "../../../state-management/state/datasets.store";
import { getFacetCount, getFacetId } from "./utils";

describe("#getFacetId()", () => {
  it("should return the FacetCount id if present", () => {
    const facetCount: FacetCount = {
      _id: "test1",
      count: 0,
    };
    const fallback = "test2";

    const id = getFacetId(facetCount, fallback);

    expect(id).toEqual("test1");
  });

  it("should return the FacetCount id if present", () => {
    const facetCount: FacetCount = {
      count: 0,
    };
    const fallback = "test";

    const id = getFacetId(facetCount, fallback);

    expect(id).toEqual(fallback);
  });
});

describe("#getFacetCount()", () => {
  it("should return the FacetCount", () => {
    const facetCount: FacetCount = {
      count: 0,
    };

    const count = getFacetCount(facetCount);

    expect(count).toEqual(facetCount.count);
  });
});
