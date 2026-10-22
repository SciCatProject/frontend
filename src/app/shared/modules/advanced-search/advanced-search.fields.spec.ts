import {
  DATASET_FIELDS,
  FIELD_TYPES,
  METADATA_FIELD,
  getDatasetField,
  getFieldOptions,
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

  it("should only list scientific metadata without dataset fields", () => {
    expect(getFieldOptions([]).map(({ value }) => value)).toEqual([
      METADATA_FIELD,
    ]);
  });
});
