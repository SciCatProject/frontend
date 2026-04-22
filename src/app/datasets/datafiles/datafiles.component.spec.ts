import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { DatafilesComponent } from "./datafiles.component";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import {
  MockAuthService,
  MockDatafilesActionsComponent,
  MockMatDialogRef,
  MockUserApi,
} from "shared/MockStubs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AppConfigService } from "app-config.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ConfigurableActionsComponent } from "shared/modules/configurable-actions/configurable-actions.component";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { AuthService } from "shared/services/auth/auth.service";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";

describe("DatafilesComponent", () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  const getConfig = () => ({
    fileDownloadEnabled: true,
    multipleDownloadEnabled: true,
    datafilesActionsEnabled: true,
    datafilesActions: [
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
    ],
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
      declarations: [DatafilesComponent],
    });

    TestBed.overrideComponent(DatafilesComponent, {
      set: {
        providers: [
          { provide: UsersService, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: AuthService, useValue: MockAuthService },
          {
            provide: ConfigurableActionsComponent,
            useClass: MockDatafilesActionsComponent,
          },
          { provide: FileSizePipe },
        ],
      },
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesComponent);
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

    component.sourceFolder = "/test/";
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#getAllFiles()", () => {
    it("should return an array of file paths from files", () => {
      const files = component.getAllFiles();

      expect(Array.isArray(files)).toEqual(true);
      expect(files).toEqual(["test1", "test2"]);
    });
  });

  describe("#getSelectedFiles()", () => {
    it("should return selected file paths", () => {
      component.files[0].selected = true;

      const files = component.getSelectedFiles();

      expect(files).toEqual(["test1"]);
    });
  });

  describe("#onRowEvent()", () => {
    it("should select one row and update selectedFileSize", () => {
      const row = component.files[0];

      component.onRowEvent({
        event: RowEventType.RowSelectionChange,
        sender: { row, checked: true },
      } as any);

      expect(component.files[0].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(5000);
    });

    it("should unselect one row and update selectedFileSize", () => {
      const row = component.files[0];
      row.selected = true;
      component.selectedFileSize = 5000;

      component.onRowEvent({
        event: RowEventType.RowSelectionChange,
        sender: { row, checked: false },
      } as any);

      expect(component.files[0].selected).toEqual(false);
      expect(component.selectedFileSize).toEqual(0);
    });

    it("should apply master selection from selectionModel", () => {
      const selectionModel = {
        isSelected: (file) => file.path === "test1",
      };

      component.onRowEvent({
        event: RowEventType.MasterSelectionChange,
        sender: { selectionModel },
      } as any);

      expect(component.files[0].selected).toEqual(true);
      expect(component.files[1].selected).toEqual(false);
      expect(component.selectedFileSize).toEqual(5000);
    });

    it("should select all rows in master selection", () => {
      const selectionModel = {
        isSelected: () => true,
      };

      component.onRowEvent({
        event: RowEventType.MasterSelectionChange,
        sender: { selectionModel },
      } as any);

      expect(component.files[0].selected).toEqual(true);
      expect(component.files[1].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(15000);
    });
  });

  describe("#hasTooLargeFiles()", () => {
    it("should return false if maxFileSize is undefined", () => {
      component.maxFileSize = null;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(false);
    });

    it("should return false if all files are smaller than maxFileSize", () => {
      component.maxFileSize = 20000;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(false);
    });

    it("should return true if one or more files are larger than maxFileSize", () => {
      component.maxFileSize = 10;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(true);
    });
  });
});
