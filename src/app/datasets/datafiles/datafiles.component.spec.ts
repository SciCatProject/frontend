import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { DatafilesComponent } from "./datafiles.component";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { CheckboxEvent } from "shared/modules/table/table.component";
import {
  MockAuthService,
  MockDatafilesActionsComponent,
  MockMatDialogRef,
  MockUserApi,
} from "shared/MockStubs";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AppConfigService } from "app-config.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { DatafilesActionsComponent } from "datasets/datafiles-actions/datafiles-actions.component";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { AuthService } from "shared/services/auth/auth.service";
import { FileSizePipe } from "shared/pipes/filesize.pipe";

describe("DatafilesComponent", () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  const getConfig = () => ({
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
            provide: DatafilesActionsComponent,
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
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
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
    component.tableData = component.files;
    component.sourceFolder = "/test/";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#getAreAllSelected()", () => {
    it("should return 'false' if no file is selected", () => {
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(false);
    });

    it("should return 'false' if only some files are selected", () => {
      component.tableData[0].selected = true;
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(false);
    });

    it("should return 'true' if all files are selected", () => {
      component.tableData.forEach((file) => {
        file.selected = true;
      });
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(true);
    });
  });

  describe("#getIsNoneSelected()", () => {
    it("should return 'true' if no file is selected", () => {
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(true);
    });

    it("should return 'false' if some files are selected", () => {
      component.tableData[0].selected = true;
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(false);
    });

    it("should return 'false' if all files are selected", () => {
      component.tableData.forEach((file) => {
        file.selected = true;
      });
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(false);
    });
  });

  describe("#getAllFiles()", () => {
    it("should return an array of file paths of files in table", () => {
      const files = component.getAllFiles();

      expect(Array.isArray(files)).toEqual(true);
      expect(files.includes("test1")).toEqual(true);
      expect(files.includes("test2")).toEqual(true);
    });
  });

  describe("#getSelectedFiles()", () => {
    it("should return an array of file paths from selected files in table", () => {
      component.tableData[0].selected = true;

      const files = component.getSelectedFiles();

      expect(Array.isArray(files)).toEqual(true);
      expect(files.includes("test1")).toEqual(true);
    });
  });

  describe("#updateSelectionStatus()", () => {
    it("should set 'areAllSelected' to false and 'isNoneSelected' to true if no file is selected", () => {
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(false);
      expect(component.isNoneSelected).toEqual(true);
    });

    it("should set both 'areAllSelected' and 'isNoneSelected' to false if some files are selected", () => {
      component.tableData[0].selected = true;
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(false);
      expect(component.isNoneSelected).toEqual(false);
    });

    it("should set 'areAllSelected' to true and 'isNoneSelected' to false if all files are selected", () => {
      component.tableData.forEach((file) => {
        file.selected = true;
      });
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(true);
      expect(component.isNoneSelected).toEqual(false);
    });
  });

  describe("#onSelectOne()", () => {
    it("should set 'selected' to true and add the size of the file to 'selectedFileSize'", () => {
      const file = component.tableData[0];
      const event = new MatCheckboxChange();
      event.checked = true;
      const checkboxEvent: CheckboxEvent = { event, row: file };
      component.onSelectOne(checkboxEvent);

      expect(component.tableData[0].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(file.size);
    });

    it("should set 'selected' of the provided file to false and subtract the size of the file from 'selectedFileSize'", () => {
      const firstFile = component.tableData[0];
      const event = new MatCheckboxChange();
      event.checked = true;
      const firstCheckboxEvent: CheckboxEvent = { event, row: firstFile };
      component.onSelectOne(firstCheckboxEvent);

      expect(component.tableData[0].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(firstFile.size);

      const event2 = new MatCheckboxChange();
      event2.checked = false;
      const secondCheckboxEvent: CheckboxEvent = {
        event: event2,
        row: firstFile,
      };
      component.onSelectOne(secondCheckboxEvent);

      expect(component.tableData[0].selected).toEqual(false);
      expect(component.selectedFileSize).toEqual(0);
    });
  });

  describe("#onSelectAll()", () => {
    it("should set 'selected' of all files to true if previously set to false and add the size of the files to 'selectedFileSize'", () => {
      const event = {
        checked: true,
      } as MatCheckboxChange;
      component.onSelectAll(event);

      component.tableData.forEach((file) => {
        expect(file.selected).toEqual(true);
      });

      expect(component.selectedFileSize).toEqual(15000);
    });

    it("should set 'selected' of all files to false and subtract the size of the files from 'selectedFileSize'", () => {
      const firstEvent = {
        checked: true,
      } as MatCheckboxChange;
      component.onSelectAll(firstEvent);

      component.tableData.forEach((file) => {
        expect(file.selected).toEqual(true);
      });

      expect(component.selectedFileSize).toEqual(15000);

      const secondEvent = {
        checked: false,
      } as MatCheckboxChange;
      component.onSelectAll(secondEvent);

      component.tableData.forEach((file) => {
        expect(file.selected).toEqual(false);
      });

      expect(component.selectedFileSize).toEqual(0);
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
