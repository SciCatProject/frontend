import {
  DATASET_FIELDS,
  FIELD_ICONS,
  METADATA_FIELD,
  getDatasetField,
  getFieldOptions,
  getQuickPicks,
} from "./condition-filter.fields";

describe("condition filter fields", () => {
  it("should give every field an icon and a unique key", () => {
    const keys = DATASET_FIELDS.map(({ key }) => key);

    expect(new Set(keys).size).toBe(keys.length);
    expect(DATASET_FIELDS.every(({ icon }) => !!icon)).toBeTrue();
  });

  it("should give creation time a date icon, it has two date inputs", () => {
    expect(getDatasetField("creationTime").icon).toBe(FIELD_ICONS.date);
    expect(getDatasetField("keywords").icon).toBe(FIELD_ICONS.text);
  });

  it("should list all fields with scientific metadata, in alphabetical order", () => {
    const options = getFieldOptions(DATASET_FIELDS);
    const labels = options.map(({ label }) => label);

    expect(options.length).toBe(DATASET_FIELDS.length + 1);
    expect(options.find(({ value }) => value === METADATA_FIELD).icon).toBe(
      FIELD_ICONS.metadata,
    );
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
  });

  it("should have scientific metadata first in the quick picks, then the marked fields", () => {
    const picks = getQuickPicks(getFieldOptions(DATASET_FIELDS));

    expect(picks[0].value).toBe(METADATA_FIELD);
    expect(picks.map(({ value }) => value)).toEqual(
      jasmine.arrayContaining(["creationTime", "datasetName", "keywords"]),
    );
    expect(picks.length).toBe(
      DATASET_FIELDS.filter(({ quickPick }) => quickPick).length + 1,
    );
  });

  it("should have no quick picks without dataset fields except scientific metadata", () => {
    expect(
      getQuickPicks(getFieldOptions([])).map(({ value }) => value),
    ).toEqual([METADATA_FIELD]);
  });
});
