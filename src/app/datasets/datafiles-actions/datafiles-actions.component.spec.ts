import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DatafilesActionsComponent } from "./datafiles-actions.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { UserApi } from "shared/sdk";
import { MockMatDialogRef, MockUserApi } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";

describe("DatafilesActionsComponent", () => {
  let component: DatafilesActionsComponent;
  let fixture: ComponentFixture<DatafilesActionsComponent>;

  const getConfig = () => ({
    maxDirectDownloadSize: 10000,
    datafilesActionsEnabled: true,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        PipesModule,
        ReactiveFormsModule,
        MatDialogModule,
        RouterModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
      ],
      declarations: [DatafilesActionsComponent],
    });
    TestBed.overrideComponent(DatafilesActionsComponent, {
      set: {
        providers: [
          { provide: UserApi, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: UserApi, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    component.files = [
      {
        path: "test1",
        size: 5000,
        time: "2019-09-06T13:11:37.102Z",
        chk: "string",
        uid: "string",
        gid: "string",
        perm: "string",
        selected: false,
        hash: "",
      },
      {
        path: "test2",
        size: 10000,
        time: "2019-09-06T13:11:37.102Z",
        chk: "string",
        uid: "string",
        gid: "string",
        perm: "string",
        selected: false,
        hash: "",
      },
    ];
    component.actionsConfig = [
      {
        id: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
        order: 4,
        label: "Download All",
        files: "all",
        mat_icon: "download",
        url: "",
        target: "_blank",
        enabled: "#SizeLimit",
        authorization: ["#datasetAccess", "#datasetPublic"],
      },
      {
        id: "3072fafc-4363-11ef-b9f9-ebf568222d26",
        order: 3,
        label: "Download Selected",
        files: "selected",
        mat_icon: "download",
        url: "",
        target: "_blank",
        enabled: "#Selected && #SizeLimit",
        authorization: ["#datasetAccess", "#datasetPublic"],
      },
      {
        id: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
        order: 2,
        label: "Notebook All",
        files: "all",
        icon: "/assets/icons/jupyter_logo.png",
        url: "",
        target: "_blank",
        authorization: ["#datasetAccess", "#datasetPublic"],
      },
      {
        id: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
        order: 1,
        label: "Notebook Selected",
        files: "selected",
        icon: "/assets/icons/jupyter_logo.png",
        url: "",
        target: "_blank",
        enabled: "#Selected",
        authorization: ["#datasetAccess", "#datasetPublic"],
      },
    ];
    component.dataset = {
      pid: "57eb0ad6-48d4-11ef-814b-df221a8e3571",
      sourceFolder: "/level_1/level_2/level3",
    };
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
