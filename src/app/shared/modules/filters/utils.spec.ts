import { FacetCount } from "state-management/models";
import { getFacetCount } from "./utils";

describe("#getFacetCount()", () => {
  it("should return the FacetCount", () => {
    const facetCount: FacetCount = {
      _id: "",
      count: 0,
    };

    const count = getFacetCount(facetCount);

    expect(count).toEqual(facetCount.count);
  });
});
