import {
  DATASET_FIELDS,
  FIELD_TYPES,
  METADATA_FIELD,
  getDatasetField,
  getDatasetFields,
  getFieldOptions,
  getPrefilledFields,
  isMetadataFieldKey,
  setDatasetFields,
  SIDE_PANEL_FIELDS,
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

  it("should list all fields in their order, with scientific metadata last", () => {
    const options = getFieldOptions(DATASET_FIELDS);

    expect(options.length).toBe(DATASET_FIELDS.length + 1);
    expect(options.map(({ value }) => value)).toEqual([
      ...DATASET_FIELDS.map(({ key }) => key),
      METADATA_FIELD,
    ]);
  });

  it("should keep the order of the config", () => {
    setDatasetFields([
      { key: "runNumber", relation: "CONTAINS" },
      { key: "creationTime", relation: "RANGE" },
      { key: "keywords", relation: "IN" },
    ]);

    expect(
      getFieldOptions(getDatasetFields()).map(({ value }) => value),
    ).toEqual(["runNumber", "creationTime", "keywords", METADATA_FIELD]);
    setDatasetFields();
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
          { key: "sourceFolder", relation: "CONTAINS" },
        ],
        { runNumber: "Run Number" },
      );

      expect(getDatasetFields().map(({ label }) => label)).toEqual([
        "Run Number",
        "Keywords",
        "sourceFolder",
      ]);
    });

    it("should localize the labels of the defaults too", () => {
      setDatasetFields(undefined, { creationTime: "Created" });

      expect(getDatasetField("creationTime").label).toBe("Created");
      expect(getDatasetField("keywords").label).toBe("Keywords");
    });

    it("should prefill the fields of the config, in its order", () => {
      setDatasetFields([
        { key: "runNumber", relation: "CONTAINS" },
        { key: "keywords", relation: "IN" },
        { key: "pid", relation: "IN" },
      ]);

      expect(getPrefilledFields().map(({ key }) => key)).toEqual([
        "runNumber",
        "keywords",
        "pid",
      ]);
    });

    it("should prefill the fields the side panel had without a config", () => {
      setDatasetFields([{ key: "runNumber", relation: "IN" }]);
      setDatasetFields();

      expect(getPrefilledFields().map(({ key }) => key)).toEqual(
        SIDE_PANEL_FIELDS,
      );
      expect(SIDE_PANEL_FIELDS).toEqual([
        "creationLocation",
        "pid",
        "ownerGroup",
        "type",
        "keywords",
        "creationTime",
      ]);
    });

    it("should take scientific metadata with dots, its operator, value and unit", () => {
      setDatasetFields(
        [
          {
            key: "scientificMetadata.detector.distance",
            relation: "GREATER_THAN",
            value: 5,
            unit: "mm",
          },
          { key: "scientificMetadata.thickness" },
          { key: "scientificMetadata.speed", relation: "IN" as never },
          { key: "scientificMetadata." },
          { key: "scientificMetadata" },
        ],
        { "scientificMetadata.thickness.value": "Thickness" },
      );

      expect(getDatasetFields()).toEqual([
        {
          key: "scientificMetadata.detector.distance",
          label: "detector.distance",
          relation: "GREATER_THAN",
          value: 5,
          unit: "mm",
        },
        {
          key: "scientificMetadata.thickness",
          label: "Thickness",
          relation: "EQUAL_TO",
        },
        {
          key: "scientificMetadata.speed",
          label: "speed",
          relation: "EQUAL_TO",
        },
      ]);
    });

    it("should take the prefix of scientific metadata in any case", () => {
      setDatasetFields([
        { key: "scientificmetadata.Detector.distance", relation: "RANGE" },
      ]);

      expect(getDatasetFields()[0].key).toBe(
        "scientificMetadata.Detector.distance",
      );
      expect(isMetadataFieldKey("SCIENTIFICMETADATA.a")).toBeTrue();
    });

    it("should not list the fields of scientific metadata in the dropdown, they are rows of its kind", () => {
      setDatasetFields([
        { key: "scientificMetadata.thickness", relation: "RANGE" },
        { key: "creationTime", relation: "RANGE" },
      ]);

      const options = getFieldOptions(getDatasetFields());

      expect(options.map(({ value }) => value)).toEqual([
        "creationTime",
        METADATA_FIELD,
      ]);
      expect(options.map(({ type }) => type)).toEqual(["date", "metadata"]);
      expect(isMetadataFieldKey("scientificMetadata.a")).toBeTrue();
      expect(isMetadataFieldKey("scientificMetadata")).toBeFalse();
    });

    it("should read a range that is written as a text", () => {
      setDatasetFields([
        {
          key: "creationTime",
          relation: "RANGE",
          value: "2026-01-01, 2026-02-01",
        },
        { key: "startTime", relation: "RANGE", value: "2026-01-01" },
        { key: "endTime", relation: "RANGE", value: ", 2026-02-01" },
        { key: "scientificMetadata.thickness", relation: "RANGE", value: 5 },
        { key: "scientificMetadata.speed", relation: "RANGE", value: [1, 3] },
      ]);

      expect(getDatasetFields().map(({ value }) => value)).toEqual([
        ["2026-01-01", "2026-02-01"],
        ["2026-01-01", ""],
        ["", "2026-02-01"],
        ["5", ""],
        [1, 3],
      ]);
    });

    it("should keep the value of a dataset field", () => {
      setDatasetFields([
        { key: "keywords", relation: "IN", value: ["neutron"] },
      ]);

      expect(getDatasetField("keywords").value).toEqual(["neutron"]);
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
        { key: "runNumber", relation: "IN" },
        { relation: "IN" },
        { key: "size", relation: "GREATER_THAN" as never },
      ]);

      expect(getDatasetFields()).toEqual([
        { key: "runNumber", label: "runNumber", relation: "IN" },
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
