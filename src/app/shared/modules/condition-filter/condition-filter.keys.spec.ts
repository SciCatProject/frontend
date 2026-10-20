import { TestBed } from "@angular/core/testing";
import { MetadataKeysV4Service } from "@scicatproject/scicat-sdk-ts-angular";
import { of } from "rxjs";
import { MetadataKey } from "state-management/models";
import {
  MetadataKeySearchService,
  staticKeySource,
} from "./condition-filter.keys";

describe("condition filter keys", () => {
  describe("MetadataKeySearchService", () => {
    let service: MetadataKeySearchService;
    let api: jasmine.SpyObj<MetadataKeysV4Service>;

    const requestedFilter = () =>
      JSON.parse(
        api.metadataKeysV4ControllerFindAllV4.calls.mostRecent().args[0],
      );

    beforeEach(() => {
      api = jasmine.createSpyObj("MetadataKeysV4Service", [
        "metadataKeysV4ControllerFindAllV4",
      ]);
      api.metadataKeysV4ControllerFindAllV4.and.returnValue(
        of([
          { key: "a", humanReadableName: "A", other: 1 },
          { key: "b" },
        ]) as never,
      );

      TestBed.configureTestingModule({
        providers: [{ provide: MetadataKeysV4Service, useValue: api }],
      });
      service = TestBed.inject(MetadataKeySearchService);
    });

    it("should ask for a page of keys sorted by key", () => {
      service.search("", 40, 20).subscribe();

      expect(requestedFilter()).toEqual({
        where: {},
        fields: ["key", "humanReadableName"],
        limits: { skip: 40, limit: 20, sort: { key: "asc" } },
      });
    });

    it("should search the key and the readable name without case", () => {
      service.search("  temp ", 0, 20).subscribe();

      const match = { $regex: "temp", $options: "i" };
      expect(requestedFilter().where).toEqual({
        $or: [{ key: match }, { humanReadableName: match }],
      });
    });

    it("should search for the typed text, not for a pattern", () => {
      service.search("a.b(1)", 0, 20).subscribe();

      expect(requestedFilter().where.$or[0].key.$regex).toBe("a\\.b\\(1\\)");
    });

    it("should only keep the key and its name", (done) => {
      service.search("", 0, 20).subscribe((keys) => {
        expect(keys).toEqual([
          { key: "a", humanReadableName: "A" },
          { key: "b", humanReadableName: undefined },
        ]);
        done();
      });
    });
  });

  describe("staticKeySource", () => {
    const keys: MetadataKey[] = [
      { key: "temperature", humanReadableName: "Sample temperature" },
      { key: "pressure" },
      { key: "humidity" },
    ];
    const source = staticKeySource(of(keys));
    const found = (term: string, skip = 0, limit = 20) => {
      let result: string[] = [];
      source(term, skip, limit).subscribe(
        (page) => (result = page.map(({ key }) => key)),
      );
      return result;
    };

    it("should list all keys without a search", () => {
      expect(found("")).toEqual(["temperature", "pressure", "humidity"]);
    });

    it("should search the key and the readable name without case", () => {
      expect(found("PRES")).toEqual(["pressure"]);
      expect(found("sample")).toEqual(["temperature"]);
      expect(found("nothing")).toEqual([]);
    });

    it("should list the keys page by page", () => {
      expect(found("", 0, 2)).toEqual(["temperature", "pressure"]);
      expect(found("", 2, 2)).toEqual(["humidity"]);
    });
  });
});
