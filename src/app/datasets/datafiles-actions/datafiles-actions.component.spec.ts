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
import { MockMatDialogRef, MockUserApi } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import { UsersService } from "@scicatproject/scicat-sdk-ts";

describe("DatafilesActionsComponent", () => {
  let component: DatafilesActionsComponent;
  let fixture: ComponentFixture<DatafilesActionsComponent>;
  const mockAppConfigService = {
    getConfig: () => {
      return {
        maxDirectDownloadSize: 10000,
        datafilesActionsEnabled: true,
      };
    },
  };

  const actionsConfig = [
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
          { provide: UsersService, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: AppConfigService, useValue: mockAppConfigService },
          { provide: UsersService, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesActionsComponent);
    component = fixture.componentInstance;
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
    component.actionsConfig = actionsConfig;
    component.actionDataset = {
      pid: "57eb0ad6-48d4-11ef-814b-df221a8e3571",
      sourceFolder: "/level_1/level_2/level3",
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("sorted actions should be sorted", () => {
    const sortedActionsConfig = component.sortedActionsConfig;

    for (let i = 1; i < sortedActionsConfig.length; i++) {
      expect(
        sortedActionsConfig[i].order >= sortedActionsConfig[i - 1].order,
      ).toEqual(true);
    }
  });

  it("actions should be visible when enabled in configuration", () => {
    expect(component.visible).toEqual(true);
  });

  it("actions should be visible when disabled in configuration", () => {
    spyOn(mockAppConfigService, "getConfig").and.returnValue({
      maxDirectDownloadSize: 10000,
      datafilesActionsEnabled: false,
    });
    expect(component.visible).toEqual(false);
  });

  it("max file size should be the same as set in configuration, aka 10000", () => {
    expect(component.maxFileSize).toEqual(10000);
  });

  it("max file size should be the same as set in configuration, aka 5000", () => {
    spyOn(mockAppConfigService, "getConfig").and.returnValue({
      maxDirectDownloadSize: 5000,
      datafilesActionsEnabled: true,
    });
    expect(component.maxFileSize).toEqual(5000);
  });

  it("actions should be visible with default configuration", () => {
    spyOn(mockAppConfigService, "getConfig").and.returnValue({
      maxDirectDownloadSize: 10000,
      datafilesActionsEnabled: true,
    });
    expect(component.visible).toEqual(true);
  });

  it("there should be 4 actions as defined in default configuration", async () => {
    expect(component.sortedActionsConfig.length).toEqual(actionsConfig.length);
    const htmlElement: HTMLElement = fixture.nativeElement;
    const htmlActions = htmlElement.querySelectorAll("datafiles-action");
    expect(htmlActions.length).toEqual(actionsConfig.length);
  });

  it("there should be 0 actions with no actions configured", async () => {
    component.actionsConfig = [];
    fixture.detectChanges();
    expect(component.sortedActionsConfig.length).toEqual(0);
    const htmlElement: HTMLElement = fixture.nativeElement;
    const htmlActions = htmlElement.querySelectorAll("datafiles-action");
    expect(htmlActions.length).toEqual(0);
  });
});
