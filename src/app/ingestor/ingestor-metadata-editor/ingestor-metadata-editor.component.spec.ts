import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorMetadataEditorComponent } from "./ingestor-metadata-editor.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorMetadataEditorComponent", () => {
  let component: IngestorMetadataEditorComponent;
  let fixture: ComponentFixture<IngestorMetadataEditorComponent>;

  const mockSchema = {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" },
    },
    required: ["name"],
  };

  const mockData = {
    name: "Test",
    age: 25,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorMetadataEditorComponent],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorMetadataEditorComponent);
    component = fixture.componentInstance;

    component.data = mockData;
    component.schema = mockSchema;
    component.renderView = "all";

    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("updateVisualData with nullable objects", () => {
    beforeEach(() => {
      component.schema = {
        type: "object",
        properties: {
          metadata: {
            anyOf: [
              {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
              { type: "null" },
            ],
          },
        },
      };
    });

    it("should normalize an object containing only blank fields to null", () => {
      component.data = { metadata: { name: "", description: "" } };

      component.updateVisualData();

      expect(component.visualData).toEqual({ metadata: null });
      expect(component.data).toEqual({
        metadata: { name: "", description: "" },
      });
    });

    it("should preserve an object containing a populated field", () => {
      component.data = { metadata: { name: "Test", description: "" } };

      component.updateVisualData();

      expect(component.visualData).toEqual({
        metadata: { name: "Test", description: "" },
      });
    });
  });
});
