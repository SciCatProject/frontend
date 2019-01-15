import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { DatasetTableComponent } from "./dataset-table.component";
import { FileSizePipe } from "../../shared/pipes/filesize.pipe";
import { JsonHeadPipe } from "../../shared/pipes/json-head.pipe";
import { HttpClient } from "@angular/common/http";
import { MatDialogModule, MatTableModule } from "@angular/material";
import { MockHttp, MockLoginService, MockRouter, MockDatasetAttachmentApi, MockDatasetApi } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { combineReducers, StoreModule } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { LoginService } from "../../users/login.service";
import { ThumbnailPipe } from "shared/pipes";
import { DatasetAttachmentApi, DatasetApi } from "shared/sdk";

describe("DatasetTableComponent", () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        MatDialogModule,
        StoreModule.forRoot({
          datasets: datasetsReducer,
          root: combineReducers({
            jobs: jobsReducer
          })
        }),
        AppConfigModule
      ],
      declarations: [
        DatasetTableComponent,
        FileSizePipe,
        JsonHeadPipe,
        ThumbnailPipe
      ]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: DatasetAttachmentApi, useClass: MockDatasetAttachmentApi },
          { provide: DatasetApi, useClass: MockDatasetApi },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true,
              csvEnabled: true
            }
          },
          { provide: ArchivingService, useClass: ArchivingService },
          { provide: LoginService, useClass: MockLoginService }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should contain mode switching buttons", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector(".archive")).toBeTruthy();
    expect(compiled.querySelector(".archive").textContent).toContain(
      "Archivable"
    );
    expect(compiled.querySelector(".retrieve")).toBeTruthy();
    expect(compiled.querySelector(".retrieve").textContent).toContain(
      "Retrievable"
    );
    expect(compiled.querySelector(".view")).toBeTruthy();
    expect(compiled.querySelector(".view").textContent).toContain("All");
  });

  it("should contain an export button", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll(".export-csv")).toBeTruthy();
  });
});
