import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute, MockRouter } from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { SharedCatanieModule } from "shared/shared.module";
import { FilesDashboardComponent } from "./files-dashboard.component";

describe("FilesDashboardComponent", () => {
  let component: FilesDashboardComponent;
  let fixture: ComponentFixture<FilesDashboardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [FilesDashboardComponent],
        imports: [BrowserAnimationsModule, SharedCatanieModule],
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ExportExcelService, useValue: {} },
          { provide: Router, useClass: MockRouter },
          { provide: ScicatDataService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
