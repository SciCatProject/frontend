import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { DatafilesComponent } from "./datafiles.component";
import { MatTableModule } from "@angular/material";
import { AppConfigModule } from "app-config.module";
import { OrigDatablock } from "shared/sdk";
import { PipesModule } from "shared/pipes/pipes.module";

/* tslint:disable:max-line-length */
describe("DatafilesComponent", () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  let datablocks: OrigDatablock[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        AppConfigModule,
        PipesModule
      ],
      declarations: [DatafilesComponent]
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    datablocks = [new OrigDatablock()];
    datablocks[0].dataFileList = [
      {
        path: "test1",
        size: 5000,
        time: "2019-09-06T13:11:37.102Z",
        chk: "string",
        uid: "string",
        gid: "string",
        perm: "string"
      },
      {
        path: "test2",
        size: 10000,
        time: "2019-09-06T13:11:37.102Z",
        chk: "string",
        uid: "string",
        gid: "string",
        perm: "string"
      }
    ];
  });

  describe("#getDataFiles()", () => {
    it("should add an array of files, with added property 'selected' set to 'false', to dataSource", () => {
      expect(component.dataSource.data.length).toEqual(0);

      component.getDatafiles(datablocks);

      expect(component.dataSource.data.length).toEqual(2);
      component.dataSource.data.forEach(file => {
        expect(Object.keys(file)).toContain("selected");
        expect(file["selected"]).toEqual(false);
      });
    });
  });

  describe("#getAreAllSelected()", () => {
    it("should return 'false' if no file is selected", () => {
      component.getDatafiles(datablocks);
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(false);
    });

    it("should return 'false' if only some files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data[0].selected = true;
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(false);
    });

    it("should return 'true' if all files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data.forEach(file => {
        file.selected = true;
      });
      const areAllSelected = component.getAreAllSelected();

      expect(areAllSelected).toEqual(true);
    });
  });

  describe("#getIsNoneSelected()", () => {
    it("should return 'true' if no file is selected", () => {
      component.getDatafiles(datablocks);
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(true);
    });

    it("should return 'false' if some files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data[0].selected = true;
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(false);
    });

    it("should return 'false' if all files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data.forEach(file => {
        file.selected = true;
      });
      const isNoneSelected = component.getIsNoneSelected();

      expect(isNoneSelected).toEqual(false);
    });
  });

  describe("getSelectedFiles()", () => {
    it("should return an empty array if dataSource is undefined", () => {
      component.dataSource = undefined;
      const selectedFiles = component.getSelectedFiles();

      expect(selectedFiles.length).toEqual(0);
    });

    it("should return an empty array if no files are selected", () => {
      component.getDatafiles(datablocks);
      const selectedFiles = component.getSelectedFiles();

      expect(selectedFiles.length).toEqual(0);
    });

    it("should return an array of file paths if some files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data[0].selected = true;
      const selectedFiles = component.getSelectedFiles();

      expect(selectedFiles.length).toEqual(1);
      expect(selectedFiles).toContain("test1");
    });
  });

  describe("#updateSelectionStatus()", () => {
    it("should set 'areAllSelected' to false and 'isNoneSelected' to true if no file is selected", () => {
      component.getDatafiles(datablocks);
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(false);
      expect(component.isNoneSelected).toEqual(true);
    });

    it("should set both 'areAllSelected' and 'isNoneSelected' to false if some files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data[0].selected = true;
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(false);
      expect(component.isNoneSelected).toEqual(false);
    });

    it("should set 'areAllSelected' to true and 'isNoneSelected' to false if all files are selected", () => {
      component.getDatafiles(datablocks);
      component.dataSource.data.forEach(file => {
        file.selected = true;
      });
      component.updateSelectionStatus();

      expect(component.areAllSelected).toEqual(true);
      expect(component.isNoneSelected).toEqual(false);
    });
  });

  describe("#onSelect()", () => {
    it("should set 'selected' of the provided file to true if previously set to false and add the size of the file to 'selectedFileSize'", () => {
      component.getDatafiles(datablocks);
      const event = {
        checked: true
      };
      const file = component.dataSource.data[0];
      component.onSelect(event, file);

      expect(component.dataSource.data[0].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(file.size);
    });

    it("should set 'selected' of the provided file to false if previously set to true and subtract the size of the file from 'selectedFileSize'", () => {
      component.getDatafiles(datablocks);
      const firstEvent = {
        checked: true
      };
      const firstFile = component.dataSource.data[0];
      component.onSelect(firstEvent, firstFile);

      expect(component.dataSource.data[0].selected).toEqual(true);
      expect(component.selectedFileSize).toEqual(firstFile.size);

      const secondEvent = {
        checked: false
      };
      const secondFile = component.dataSource.data[0];
      component.onSelect(secondEvent, secondFile);

      expect(component.dataSource.data[0].selected).toEqual(false);
      expect(component.selectedFileSize).toEqual(0);
    });
  });

  describe("#onSelectAll()", () => {
    it("should set 'selected' of all files to true if previously set to false and add the size of the files to 'selectedFileSize'", () => {
      component.getDatafiles(datablocks);

      const event = {
        checked: true
      };
      component.onSelectAll(event);

      component.dataSource.data.forEach(file => {
        expect(file.selected).toEqual(true);
      });

      expect(component.selectedFileSize).toEqual(15000);
    });

    it("should set 'selected' of all files to false if previously set to true and subtract the size of the files from 'selectedFileSize'", () => {
      component.getDatafiles(datablocks);

      const firstEvent = {
        checked: true
      };
      component.onSelectAll(firstEvent);

      component.dataSource.data.forEach(file => {
        expect(file.selected).toEqual(true);
      });

      expect(component.selectedFileSize).toEqual(15000);

      const secondEvent = {
        checked: false
      };
      component.onSelectAll(secondEvent);

      component.dataSource.data.forEach(file => {
        expect(file.selected).toEqual(false);
      });

      expect(component.selectedFileSize).toEqual(0);
    });
  });

  describe("#hasTooLargeFiles()", () => {
    it("should return false if maxFileSize is undefined", () => {
      component.getDatafiles(datablocks);
      component.maxFileSize = null;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(false);
    });

    it("should return false if all files are smaller than maxFileSize", () => {
      component.getDatafiles(datablocks);
      component.maxFileSize = 20000;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(false);
    });

    it("should return true if one or more files are larger than maxFileSize", () => {
      component.getDatafiles(datablocks);
      component.maxFileSize = 10;
      const tooLargeFile = component.hasTooLargeFiles(component.files);

      expect(tooLargeFile).toEqual(true);
    });
  });
});
