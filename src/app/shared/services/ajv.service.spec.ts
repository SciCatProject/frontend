import { TestBed } from "@angular/core/testing";

import { AjvService } from "./ajv.service";
import { omit } from "lodash-es";

describe("AjvService", () => {
  let service: AjvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AjvService],
    });
    service = TestBed.inject(AjvService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it('should remove top level "dynamicDefaults"', () => {
    const schema = {
      type: "object",
      dynamicDefaults: {
        ts: "datetime",
      },
      properties: {
        ts: {
          type: "string",
          format: "date-time",
        },
      },
    };

    const cleanedupSchema = service.cleanupSchema(schema);
    expect(cleanedupSchema).toEqual(omit(schema, "dynamicDefaults"));
  });

  it('should remove top level "dynamicDefaults" in an "allOf"', () => {
    const schema = {
      type: "object",
      allOf: [
        {
          dynamicDefaults: {
            ts: "datetime",
          },
        },
        {
          properties: {
            ts: {
              type: "string",
            },
          },
        },
      ],
    };
    const cleanedupSchema = service.cleanupSchema(schema);
    expect(cleanedupSchema).toEqual(omit(schema, "allOf[0].dynamicDefaults"));
  });

  it('should remove "dynamicDefaults" from nested objects and within "allOf" structures', () => {
    const schema = {
      type: "object",
      dynamicDefaults: { userId: "uuid" },
      properties: {
        metadata: {
          type: "object",
          dynamicDefaults: { createdAt: "datetime" },
          properties: {
            createdAt: { type: "string" },
          },
        },
        profile: {
          allOf: [
            {
              dynamicDefaults: { lastLogin: "datetime" },
              properties: { lastLogin: { type: "string" } },
            },
            {
              type: "object",
              properties: { username: { type: "string" } },
            },
          ],
        },
      },
    };

    const cleanedupSchema = service.cleanupSchema(schema);
    expect(cleanedupSchema).toEqual(
      omit(schema, [
        "dynamicDefaults",
        "properties.metadata.dynamicDefaults",
        "properties.profile.allOf[0].dynamicDefaults",
      ]),
    );
  });
});
