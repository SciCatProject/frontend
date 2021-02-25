import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { DatafilesComponent } from "./datafiles.component";
import { AppConfigModule } from "app-config.module";
import { UserApi } from "shared/sdk";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { CheckboxEvent } from "shared/modules/table/table.component";
import { MockUserApi } from "shared/MockStubs";
import { MatCheckboxChange } from "@angular/material/checkbox";

describe("DatafilesComponent", () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          ReactiveFormsModule,
          MatTableModule,
          AppConfigModule,
          PipesModule,
          RouterModule,
          StoreModule.forRoot({}),
          RouterModule.forRoot([]),
        ],
        declarations: [DatafilesComponent],
      });
      TestBed.overrideComponent(DatafilesComponent, {
        set: {
          providers: [{ provide: UserApi, useClass: MockUserApi }],
        },
      });
      TestBed.compileComponents();
    })
  );

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
      },
    ];
    component.tableData = component.files;
    component.sourcefolder = "/test/";
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

    it("should set 'selected' of the provided file to false if previously set to true and subtract the size of the file from 'selectedFileSize'", () => {
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
