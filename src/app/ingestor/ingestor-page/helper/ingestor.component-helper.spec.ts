import { createAjv } from "@jsonforms/core";
import { getJsonSchemaFromDto } from "./ingestor.component-helper";

describe("getJsonSchemaFromDto", () => {
  const schema = getJsonSchemaFromDto();
  const ajv = createAjv();

  for (const field of ["startTime", "endTime"]) {
    describe(field, () => {
      const validate = ajv.compile({
        type: "object",
        properties: { [field]: schema.properties[field] },
      });

      it("accepts a cleared or omitted optional date-time", () => {
        expect(schema.required).not.toContain(field);
        expect(validate({ [field]: null })).toBeTrue();
        expect(validate({})).toBeTrue();
      });

      it("accepts valid date-times and rejects invalid values", () => {
        expect(validate({ [field]: "2026-10-14T12:00:00.000Z" })).toBeTrue();
        expect(validate({ [field]: "not-a-date" })).toBeFalse();
        expect(validate({ [field]: "2026-02-30T12:00:00.000Z" })).toBeFalse();
        expect(validate({ [field]: "" })).toBeFalse();
        expect(validate({ [field]: 123 })).toBeFalse();
      });
    });
  }

  it("keeps non-optional date-times and other optional strings non-nullable", () => {
    for (const field of ["creationTime", "description"]) {
      expect(schema.properties[field].type).toBe("string");
      const validate = ajv.compile(schema.properties[field]);
      expect(validate(null)).toBeFalse();
    }
  });
});
