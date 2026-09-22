import { LinkyPipe } from "ngx-linky";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";

import { Store, StoreModule } from "@ngrx/store";

import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";

import { DatasetDetailDynamicComponent } from "./dataset-detail-dynamic.component";
import { InternalLinkType } from "state-management/models";
import { TranslateService } from "@ngx-translate/core";
import { of } from "rxjs";

describe("DatasetDetailDynamicComponent", () => {
  let component: DatasetDetailDynamicComponent;
  let fixture: ComponentFixture<DatasetDetailDynamicComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    parseUrl: jasmine.createSpy("parseUrl").and.callFake((url: string) => url),
    serializeUrl: jasmine
      .createSpy("serializeUrl")
      .and.callFake((url: string) => url),
  };

  const getConfig = () => ({});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedScicatFrontendModule, StoreModule.forRoot({})],
      providers: [
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
      declarations: [DatasetDetailDynamicComponent, LinkyPipe],
    });
    TestBed.overrideComponent(DatasetDetailDynamicComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
    });

    TestBed.compileComponents();
    fixture = TestBed.createComponent(DatasetDetailDynamicComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("rendered internal link labels", () => {
    [
      {
        description: "shows names when related documents are included",
        related: {
          proposals: [{ proposalId: "p1", title: "My Proposal" }],
          samples: [{ sampleId: "s1", description: "My Sample" }],
          instruments: [{ pid: "i1", name: "My Instrument" }],
        },
        labels: ["My Proposal", "My Sample", "My Instrument"],
      },
      {
        description: "shows IDs when the response only contains IDs",
        related: {},
        labels: ["p1", "s1", "i1"],
      },
    ].forEach(({ description, related, labels }) => {
      it(description, () => {
        component.appConfig.datasetDetailComponent = {
          enableCustomizedComponent: true,
          customization: [
            {
              type: "regular",
              label: "Related Documents",
              order: 0,
              row: 1,
              col: 1,
              fields: [
                {
                  element: "internalLink",
                  source: "proposalIds",
                  internalLinkLabel: "title",
                  order: 0,
                },
                {
                  element: "internalLink",
                  source: "sampleIds",
                  internalLinkLabel: "description",
                  order: 1,
                },
                {
                  element: "internalLink",
                  source: "instrumentIds",
                  internalLinkLabel: "name",
                  order: 2,
                },
              ] as any,
            },
          ],
        };
        component.dataset$ = of({
          proposalIds: ["p1"],
          sampleIds: ["s1"],
          instrumentIds: ["i1"],
          ...related,
        } as any);
        component.userGroups$ = of([]);
        spyOn(TestBed.inject(Store), "select").and.returnValue(of(null));
        const click = spyOn(component, "onClickInternalLink");
        fixture.detectChanges();

        const links: HTMLAnchorElement[] = Array.from(
          fixture.nativeElement.querySelectorAll("td a"),
        );
        expect(links.map((link) => link.textContent.trim())).toEqual(labels);
        expect(links.map((link) => link.title)).toEqual(labels);
        links.forEach((link) => link.click());
        expect(click.calls.allArgs()).toEqual([
          ["proposalIds", "p1"],
          ["sampleIds", "s1"],
          ["instrumentIds", "i1"],
        ]);
      });
    });
  });

  describe("getNestedValue", () => {
    it("should read a top-level property", () => {
      const dataset = { pid: "test-pid" } as any;
      expect(component.getNestedValue(dataset, "pid")).toBe("test-pid");
    });

    it("should read a nested property path", () => {
      const dataset = { nested: { property: "nested-value" } } as any;
      expect(component.getNestedValue(dataset, "nested.property")).toBe(
        "nested-value",
      );
    });

    it("should return undefined for a non-existent path", () => {
      const dataset = { pid: "test-pid" } as any;
      expect(
        component.getNestedValue(dataset, "nonexistent.path"),
      ).toBeUndefined();
    });

    it("should return a message when the path is empty", () => {
      expect(component.getNestedValue({} as any, "")).toBe(
        "field source is missing",
      );
    });

    it("should return null when the dataset is null", () => {
      expect(component.getNestedValue(null, "any.path")).toBeNull();
    });
  });

  describe("getInternalLinkItems", () => {
    it("should use the id as label by default", () => {
      const dataset = {
        proposalIds: ["p1"],
        proposals: [{ proposalId: "p1", title: "My Proposal" }],
      } as any;
      expect(component.getInternalLinkItems(dataset, "proposalIds")).toEqual([
        { id: "p1", label: "p1" },
      ]);
    });

    it("should use the configured field from the related document", () => {
      const dataset = {
        proposalIds: ["p1"],
        proposals: [{ proposalId: "p1", title: "My Proposal" }],
      } as any;
      expect(
        component.getInternalLinkItems(dataset, "proposalIds", "title"),
      ).toEqual([{ id: "p1", label: "My Proposal" }]);
    });

    it("should fall back to the id when no relation record matches", () => {
      const dataset = { proposalIds: ["p1"], proposals: [] } as any;
      expect(
        component.getInternalLinkItems(dataset, "proposalIds", "title"),
      ).toEqual([{ id: "p1", label: "p1" }]);
    });

    it("should use the id as label when the source has no relation config", () => {
      const dataset = { inputDatasets: ["d1"] } as any;
      expect(component.getInternalLinkItems(dataset, "inputDatasets")).toEqual([
        { id: "d1", label: "d1" },
      ]);
    });

    it("should fall back to the id when the configured field is missing", () => {
      const dataset = {
        proposalIds: ["p1"],
        proposals: [{ proposalId: "p1", title: "My Proposal" }],
      } as any;
      expect(
        component.getInternalLinkItems(dataset, "proposalIds", "name"),
      ).toEqual([{ id: "p1", label: "p1" }]);
    });

    it("should allow a different label field for the same document type", () => {
      const dataset = {
        proposalIds: ["p1"],
        proposals: [
          { proposalId: "p1", title: "My Proposal", summary: "Summary" },
        ],
      } as any;
      expect(
        component.getInternalLinkItems(dataset, "proposalIds", "summary"),
      ).toEqual([{ id: "p1", label: "Summary" }]);
    });

    it("should resolve the configured instrument name without changing its id", () => {
      const dataset = {
        instrumentIds: ["i1"],
        instruments: [{ pid: "i1", name: "My Instrument" }],
      } as any;
      expect(
        component.getInternalLinkItems(dataset, "instrumentIds", "name"),
      ).toEqual([{ id: "i1", label: "My Instrument" }]);
    });

    it("should normalize a scalar value into a single item", () => {
      const dataset = { inputDatasets: "d1" } as any;
      expect(component.getInternalLinkItems(dataset, "inputDatasets")).toEqual([
        { id: "d1", label: "d1" },
      ]);
    });

    it("should return an empty array when the source is missing", () => {
      expect(component.getInternalLinkItems({} as any, "proposalIds")).toEqual(
        [],
      );
    });
  });

  describe("handleFieldValue", () => {
    it("should join an array of text with a comma", () => {
      expect(
        component.handleFieldValue("text", ["a", "b"], {} as any, "x"),
      ).toBe("a , b");
    });

    it("should return null for an empty text array", () => {
      expect(component.handleFieldValue("text", [], {} as any, "x")).toBe(null);
    });

    it("should return a plain string unchanged", () => {
      expect(component.handleFieldValue("text", "hello", {} as any, "x")).toBe(
        "hello",
      );
    });

    it("should return link items for internalLink", () => {
      const dataset = {
        sampleIds: ["s1"],
        samples: [{ sampleId: "s1", description: "S1" }],
      } as any;
      expect(
        component.handleFieldValue(
          "internalLink",
          ["s1"],
          dataset,
          "sampleIds",
          "description",
        ),
      ).toEqual([{ id: "s1", label: "S1" }]);
    });

    it("should wrap a tag array", () => {
      expect(
        component.handleFieldValue("tag", ["a", "b"], {} as any, "x"),
      ).toEqual(["a", "b"]);
    });
  });

  it("should apply the label choice independently to each configured field", () => {
    component.appConfig.datasetDetailComponent = {
      enableCustomizedComponent: true,
      customization: [
        {
          type: "regular",
          label: "Related Documents",
          order: 0,
          row: 1,
          col: 1,
          fields: [
            {
              element: "internalLink",
              source: "proposalIds",
              internalLinkLabel: "title",
              order: 0,
            },
            {
              element: "internalLink",
              source: "instrumentIds",
              internalLinkLabel: "id",
              order: 1,
            },
            {
              element: "internalLink",
              source: "sampleIds",
              order: 2,
            },
          ] as any,
        },
      ],
    };
    component.dataset$ = of({
      proposalIds: ["p1"],
      proposals: [{ proposalId: "p1", title: "My Proposal" }],
      instrumentIds: ["i1"],
      instruments: [{ pid: "i1", name: "My Instrument" }],
      sampleIds: ["s1"],
      samples: [{ sampleId: "s1", description: "My Sample" }],
    } as any);
    component.userGroups$ = of([]);
    spyOn(TestBed.inject(Store), "select").and.returnValue(of(null));
    component.ngOnInit();

    const subscription = component.datasetView$.subscribe((sections) => {
      expect(sections[0].fields.map((field) => field.value)).toEqual([
        [{ id: "p1", label: "My Proposal" }],
        [{ id: "i1", label: "i1" }],
        [{ id: "s1", label: "s1" }],
      ]);
    });
    subscription.unsubscribe();
  });

  describe("isEmpty", () => {
    [null, undefined, "", [], [null]].forEach((value) => {
      it(`should treat ${JSON.stringify(value)} as empty`, () => {
        expect(component.isEmpty(value)).toBeTrue();
      });
    });

    it("should treat a non-empty value as not empty", () => {
      expect(component.isEmpty("x")).toBeFalse();
      expect(component.isEmpty(["a"])).toBeFalse();
    });
  });

  describe("onClickInternalLink", () => {
    beforeEach(() => {
      (component["router"].navigateByUrl as jasmine.Spy).calls.reset();
      spyOn(window, "open");
      spyOn(component["snackBar"], "open");
    });

    it("should navigate to the instruments page", () => {
      component.onClickInternalLink(
        InternalLinkType.INSTRUMENTS,
        "instrument123",
      );
      expect(window.open).toHaveBeenCalledWith(
        "/instruments/instrument123",
        "_blank",
        "noopener",
      );
    });

    it("should navigate to the datasets page", () => {
      component.onClickInternalLink(InternalLinkType.DATASETS, "dataset123");
      expect(window.open).toHaveBeenCalledWith(
        "/datasets/dataset123",
        "_blank",
        "noopener",
      );
    });

    it("should encode special characters in the id", () => {
      component.onClickInternalLink(
        InternalLinkType.INSTRUMENTS,
        "instrument with spaces",
      );
      expect(window.open).toHaveBeenCalledWith(
        "/instruments/instrument%20with%20spaces",
        "_blank",
        "noopener",
      );
    });

    it("should show an error for an invalid link type", () => {
      component.onClickInternalLink("invalid", "test123");
      expect(window.open).not.toHaveBeenCalled();
      expect(component["snackBar"].open).toHaveBeenCalledWith(
        "The URL is not valid",
        "Close",
        { duration: 2000 },
      );
    });
  });

  describe("getScientificMetadata", () => {
    type TestCase = {
      desc: string;
      dataset: any;
      path?: string;
      expected: any;
    };

    const testCases: TestCase[] = [
      {
        desc: "return null when dataset is null",
        dataset: null,
        path: "any.path",
        expected: null,
      },
      {
        desc: "return null when dataset is undefined",
        dataset: undefined,
        path: "any.path",
        expected: null,
      },
      {
        desc: "return null when dataset has no scientificMetadata",
        dataset: { pid: "test" },
        path: "any.path",
        expected: null,
      },
      {
        desc: "return entire scientificMetadata when no source is provided",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return entire scientificMetadata when empty source is provided",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        path: "",
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return entire scientificMetadata when source is 'scientificMetadata'",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        path: "scientificMetadata",
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return nested metadata when valid path is provided",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C", pressure: "1 atm" },
            otherData: "test",
          },
        },
        path: "scientificMetadata.sampleProperties",
        expected: { temperature: "25°C", pressure: "1 atm" },
      },
      {
        desc: "return nested metadata when path without 'scientificMetadata' prefix is provided",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C", pressure: "1 atm" },
          },
        },
        path: "sampleProperties",
        expected: { temperature: "25°C", pressure: "1 atm" },
      },
      {
        desc: "return deeply nested metadata",
        dataset: {
          scientificMetadata: {
            experiment: { conditions: { environmental: { humidity: "60%" } } },
          },
        },
        path: "experiment.conditions.environmental",
        expected: { humidity: "60%" },
      },
      {
        desc: "return null when path does not exist",
        dataset: {
          scientificMetadata: { sampleProperties: { temperature: "25°C" } },
        },
        path: "nonExistentPath",
        expected: null,
      },
      {
        desc: "return null when partial path exists but final key does not",
        dataset: {
          scientificMetadata: { sampleProperties: { temperature: "25°C" } },
        },
        path: "sampleProperties.nonExistentKey",
        expected: null,
      },
      {
        desc: "return null when path leads to non-object value",
        dataset: {
          scientificMetadata: { sampleProperties: { temperature: "25°C" } },
        },
        path: "sampleProperties.temperature",
        expected: null,
      },
      {
        desc: "return null when path leads to null value",
        dataset: { scientificMetadata: { sampleProperties: null } },
        path: "sampleProperties",
        expected: null,
      },
      {
        desc: "return null when path leads to undefined value",
        dataset: { scientificMetadata: { sampleProperties: undefined } },
        path: "sampleProperties",
        expected: null,
      },
      {
        desc: "handle array values correctly",
        dataset: {
          scientificMetadata: {
            measurements: [
              { value: 1, unit: "cm" },
              { value: 2, unit: "cm" },
            ],
          },
        },
        path: "measurements",
        expected: [
          { value: 1, unit: "cm" },
          { value: 2, unit: "cm" },
        ],
      },
      {
        desc: "handle empty object values",
        dataset: { scientificMetadata: { emptySection: {} } },
        path: "emptySection",
        expected: {},
      },
    ];

    testCases.forEach(({ desc, dataset, path, expected }) => {
      it(`should ${desc}`, () => {
        expect(component.getScientificMetadata(dataset, path)).toEqual(
          expected,
        );
      });
    });
  });
});
