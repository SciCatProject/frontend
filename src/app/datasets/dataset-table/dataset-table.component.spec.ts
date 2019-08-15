import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { DatasetTableComponent } from "./dataset-table.component";
import { HttpClient } from "@angular/common/http";
import { MatDialogModule, MatTableModule } from "@angular/material";
import { MockHttp, MockLoginService, MockRouter, MockDatasetApi, MockArchivingService, MockAttachmentApi } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { combineReducers, StoreModule } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { LoginService } from "../../users/login.service";
import { AttachmentApi, DatasetApi } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";

describe("DatasetTableComponent", () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        MatDialogModule,
        SharedCatanieModule,
        StoreModule.forRoot({
          datasets: datasetsReducer,
          root: combineReducers({
            jobs: jobsReducer
          })
        }),
        AppConfigModule
      ],
      declarations: [DatasetTableComponent]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: AttachmentApi, useClass: MockAttachmentApi },
          { provide: DatasetApi, useClass: MockDatasetApi },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
          { provide: ArchivingService, useClass: MockArchivingService },
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
    expect(compiled.querySelector(".archivable")).toBeTruthy();
    expect(compiled.querySelector(".archivable").textContent).toContain("Archivable");
    expect(compiled.querySelector(".retrievable")).toBeTruthy();
    expect(compiled.querySelector(".retrievable").textContent).toContain("Retrievable");
    expect(compiled.querySelector(".all")).toBeTruthy();
    expect(compiled.querySelector(".all").textContent).toContain("All");
  });

});
