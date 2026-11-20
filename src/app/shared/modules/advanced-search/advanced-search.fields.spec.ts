import {
  DATASET_FIELDS,
  FIELD_TYPES,
  METADATA_FIELD,
  getDatasetField,
  getDatasetFields,
  getFieldOptions,
  setDatasetFields,
} from "./advanced-search.fields";

describe("condition filter fields", () => {
  it("should give every dataset field a unique key and a label", () => {
    const keys = DATASET_FIELDS.map(({ key }) => key);

    expect(new Set(keys).size).toBe(keys.length);
    expect(DATASET_FIELDS.every(({ label }) => !!label)).toBeTrue();
  });

  it("should find a dataset field by its key", () => {
    expect(getDatasetField("creationTime").relation).toBe("RANGE");
    expect(getDatasetField("unknown")).toBeUndefined();
  });

  it("should list all fields with scientific metadata, in alphabetical order", () => {
    const options = getFieldOptions(DATASET_FIELDS);
    const labels = options.map(({ label }) => label);

    expect(options.length).toBe(DATASET_FIELDS.length + 1);
    expect(options.some(({ value }) => value === METADATA_FIELD)).toBeTrue();
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
  });

  it("should give every field one of the four kinds of filter, each with an icon", () => {
    const options = getFieldOptions(DATASET_FIELDS);
    const kinds = new Set(options.map(({ type }) => type));

    expect(kinds).toEqual(new Set(["text", "list", "date", "metadata"]));
    expect(
      Object.values(FIELD_TYPES).every(({ icon, label }) => icon && label),
    ).toBeTrue();
    expect(options.find(({ value }) => value === "keywords").type).toBe("list");
    expect(options.find(({ value }) => value === "owner").type).toBe("text");
    expect(options.find(({ value }) => value === "creationTime").type).toBe(
      "date",
    );
    expect(options.find(({ value }) => value === METADATA_FIELD).type).toBe(
      "metadata",
    );
  });

  describe("fields of the config", () => {
    afterEach(() => setDatasetFields());

    it("should replace the defaults", () => {
      setDatasetFields([
        { key: "runNumber", relation: "CONTAINS" },
        { key: "pid", relation: "IN" },
      ]);

      expect(getDatasetFields().map(({ key }) => key)).toEqual([
        "runNumber",
        "pid",
      ]);
      expect(getDatasetField("keywords")).toBeUndefined();
    });

    it("should take the labels from the localization, then from the defaults, then the key", () => {
      setDatasetFields(
        [
          { key: "runNumber", relation: "CONTAINS" },
          { key: "keywords", relation: "IN" },
          { key: "pid", relation: "IN" },
        ],
        { runNumber: "Run Number" },
      );

      expect(getDatasetFields().map(({ label }) => label)).toEqual([
        "Run Number",
        "Keywords",
        "pid",
      ]);
    });

    it("should localize the labels of the defaults too", () => {
      setDatasetFields(undefined, { creationTime: "Created" });

      expect(getDatasetField("creationTime").label).toBe("Created");
      expect(getDatasetField("keywords").label).toBe("Keywords");
    });

    it("should fall back to the defaults without a config", () => {
      setDatasetFields([{ key: "pid", relation: "IN" }]);

      [undefined, null, [], "fields" as never].forEach((fields) => {
        setDatasetFields(fields);

        expect(getDatasetFields()).toEqual(DATASET_FIELDS);
      });
    });

    it("should leave out a field without key or with an unknown relation", () => {
      setDatasetFields([
        { key: "pid", relation: "IN" },
        { relation: "IN" },
        { key: "size", relation: "GREATER_THAN" as never },
      ]);

      expect(getDatasetFields()).toEqual([
        { key: "pid", label: "pid", relation: "IN" },
      ]);
    });

    it("should fall back to the defaults when no field is valid", () => {
      setDatasetFields([{ relation: "IN" }]);

      expect(getDatasetFields()).toEqual(DATASET_FIELDS);
    });
  });

  it("should only list scientific metadata without dataset fields", () => {
    expect(getFieldOptions([]).map(({ value }) => value)).toEqual([
      METADATA_FIELD,
    ]);
  });
});
