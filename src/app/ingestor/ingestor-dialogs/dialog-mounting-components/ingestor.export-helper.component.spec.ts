import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  ExportTemplateHelperComponent,
  ExportOptions,
} from "./ingestor.export-helper.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ExportTemplateHelperComponent", () => {
  let component: ExportTemplateHelperComponent;
  let fixture: ComponentFixture<ExportTemplateHelperComponent>;

  const mockData: ExportOptions = {
    exportSciCat: false,
    exportOrganizational: false,
    exportSample: false,
    exportAll: false,
    exportAsJSON: false,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ExportTemplateHelperComponent],
      imports: [MatCheckboxModule, MatDividerModule, FormsModule],
      providers: [{ provide: "data", useValue: mockData }],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTemplateHelperComponent);
    component = fixture.componentInstance;
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
});
