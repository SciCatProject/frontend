import {
  IngestorMetadataEditorHelper,
  convertJSONFormsErrorToString,
} from "./ingestor-metadata-editor-helper";
import { JsonSchema } from "@jsonforms/core";

describe("IngestorMetadataEditorHelper", () => {
  describe("resolveRefs", () => {
    it("should resolve a simple $ref", () => {
      const schema = {
        definitions: {
          name: { type: "string" },
        },
        properties: {
          userName: { $ref: "#/definitions/name" },
        },
      };

      const resolved = IngestorMetadataEditorHelper.resolveRefs(
        schema.properties.userName,
        schema,
      );
      expect(resolved.type).toBe("string");
    });

    it("should return schema as-is when no $ref exists", () => {
      const schema = { type: "string" };
      const resolved = IngestorMetadataEditorHelper.resolveRefs(schema, schema);
      expect(resolved).toEqual(schema);
    });

    it("should handle null or undefined schemas", () => {
      expect(IngestorMetadataEditorHelper.resolveRefs(null, {})).toBeNull();
      expect(
        IngestorMetadataEditorHelper.resolveRefs(undefined, {}),
      ).toBeUndefined();
    });
  });

  describe("isRequiredField", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: {
        instrument: {
          type: "object",
          properties: {
            name: { type: "string" },
            voltage: { type: "number" },
          },
          required: ["name"],
        },
      },
      required: ["instrument"],
    };

    it("should return true for required fields", () => {
      expect(
        IngestorMetadataEditorHelper.isRequiredField("/instrument", schema),
      ).toBe(true);
      expect(
        IngestorMetadataEditorHelper.isRequiredField(
          "/instrument/name",
          schema,
        ),
      ).toBe(true);
    });

    it("should return false for non-required fields", () => {
      expect(
        IngestorMetadataEditorHelper.isRequiredField(
          "/instrument/voltage",
          schema,
        ),
      ).toBe(false);
    });

    it("should return false for invalid paths", () => {
      expect(
        IngestorMetadataEditorHelper.isRequiredField("/nonexistent", schema),
      ).toBe(false);
      expect(IngestorMetadataEditorHelper.isRequiredField("", schema)).toBe(
        false,
      );
    });

    it("should handle null or undefined inputs", () => {
      expect(IngestorMetadataEditorHelper.isRequiredField(null, schema)).toBe(
        false,
      );
      expect(IngestorMetadataEditorHelper.isRequiredField("/test", null)).toBe(
        false,
      );
    });
  });

  describe("filterErrorsForRenderView", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name"],
    };

    const errors = [
      { instancePath: "/name", message: "is required" },
      { instancePath: "/age", message: "must be a number" },
    ];

    it("should return all errors when renderView is 'all'", () => {
      const filtered = IngestorMetadataEditorHelper.filterErrorsForRenderView(
        errors,
        schema,
        "all",
      );
      expect(filtered.length).toBe(2);
    });

    it("should filter to only required field errors when renderView is 'requiredOnly'", () => {
      const filtered = IngestorMetadataEditorHelper.filterErrorsForRenderView(
        errors,
        schema,
        "requiredOnly",
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].instancePath).toBe("/name");
    });

    it("should return empty array when errors is empty", () => {
      const filtered = IngestorMetadataEditorHelper.filterErrorsForRenderView(
        [],
        schema,
        "requiredOnly",
      );
      expect(filtered.length).toBe(0);
    });
  });

  describe("processMetadataErrors", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    };

    it("should return valid when no errors", () => {
      const result = IngestorMetadataEditorHelper.processMetadataErrors(
        [],
        schema,
        "all",
      );
      expect(result.isValid).toBe(true);
      expect(result.errorString).toBe("");
    });

    it("should return invalid with error string when errors exist", () => {
      const errors = [{ instancePath: "/name", message: "is required" }];
      const result = IngestorMetadataEditorHelper.processMetadataErrors(
        errors,
        schema,
        "all",
      );
      expect(result.isValid).toBe(false);
      expect(result.errorString).toContain("is required");
    });
  });
});

describe("convertJSONFormsErrorToString", () => {
  it("should convert errors to string format", () => {
    const errors = [
      { instancePath: "/name", message: "is required" },
      { instancePath: "/age", message: "must be a number" },
    ];
    const result = convertJSONFormsErrorToString(errors);
    expect(result).toContain("1. @/name is required");
    expect(result).toContain("2. @/age must be a number");
  });

  it("should skip errors with 'must NOT have additional properties' message", () => {
    const errors = [
      { message: "must NOT have additional properties" },
      { instancePath: "/name", message: "is required" },
    ];
    const result = convertJSONFormsErrorToString(errors);
    expect(result).not.toContain("additional properties");
    expect(result).toContain("1. @/name is required");
  });

  it("should handle empty error array", () => {
    const result = convertJSONFormsErrorToString([]);
    expect(result).toBe("");
  });
});
