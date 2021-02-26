import { ActivatedRoute, Router } from "@angular/router";

import { MockActivatedRoute, MockStore } from "shared/MockStubs";
import { SampleDetailComponent } from "./sample-detail.component";
import { Store, StoreModule } from "@ngrx/store";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { PageChangeEvent } from "shared/modules/table/table.component";
import {
  changeDatasetsPageAction,
  fetchSampleDatasetsAction,
  saveCharacteristicsAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  addAttachmentAction
} from "state-management/actions/samples.actions";
import { Dataset, Sample, User } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_CONFIG } from "app-config.module";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import { ReadMode, ReadFile } from "ngx-file-helpers";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";

describe("SampleDetailComponent", () => {
  let component: SampleDetailComponent;
  let fixture: ComponentFixture<SampleDetailComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDetailComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTabsModule,
        NgxJsonViewerModule,
        SharedCatanieModule,
        StoreModule.forRoot({})
      ],
      providers: [DatePipe, FileSizePipe, SlicePipe]
    });
    TestBed.overrideComponent(SampleDetailComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true
            }
          },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#formatTableData()", () => {
    it("should do nothing if there are no datasets", () => {
      const data = component.formatTableData(null);

      expect(data).toBeUndefined();
    });

    it("should return an array of data objects if there are datasets", () => {
      const datasets = [new Dataset()];
      const data = component.formatTableData(datasets);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onSaveCharacteristics()", () => {
    it("should dispatch a saveCharacteristicsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const sample = new Sample();
      sample.sampleId = "testId";
      component.sample = sample;
      const characteristics = {};

      component.onSaveCharacteristics(characteristics);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveCharacteristicsAction({
          sampleId: sample.sampleId,
          characteristics
        })
      );
    });
  });

  describe("#onFilePicked()", () => {
    it("should set the value of pickedFile", () => {
      expect(component.pickedFile).toBeUndefined();
      const file: ReadFile = {
        name: "test",
        size: 100,
        type: "image/png",
        readMode: ReadMode.dataURL,
        content: "abc123",
        underlyingFile: {
          lastModified: 123,
          name: "test",
          size: 100,
          type: "image/png",
          arrayBuffer: () => new Blob().arrayBuffer(),
          slice: () => new Blob().slice(),
          stream: () => new Blob().stream(),
          text: () => new Blob().text()
        }
      };
      component.onFilePicked(file);

      expect(component.pickedFile).toEqual(file);
    });
  });

  describe("#onReadEnd()", () => {
    it("should do nothing if filecount = 0", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onReadEnd(0);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an addAttachmentAction if filecount > 0", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.user = new User();
      component.sample = new Sample();
      component.pickedFile = {
        name: "test",
        size: 100,
        type: "image/png",
        readMode: ReadMode.dataURL,
        content: "abc123",
        underlyingFile: {
          lastModified: 123,
          name: "test",
          size: 100,
          type: "image/png",
          arrayBuffer: () => new Blob().arrayBuffer(),
          slice: () => new Blob().slice(),
          stream: () => new Blob().stream(),
          text: () => new Blob().text()
        }
      };
      component.onReadEnd(1);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addAttachmentAction({ attachment: component.attachment })
      );
    });
  });

  describe("#updateCaption()", () => {
    it("should dispatch an updateAttachmentCaptionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.sample = new Sample();
      const sampleId = "testId";
      component.sample.sampleId = sampleId;
      const event: SubmitCaptionEvent = {
        attachmentId: "testId",
        caption: "test"
      };
      component.updateCaption(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateAttachmentCaptionAction({
          sampleId,
          attachmentId: event.attachmentId,
          caption: event.caption
        })
      );
    });
  });

  describe("#deleteAttachment()", () => {
    it("should dispatch a removeAttachmentAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.sample = new Sample();
      const sampleId = "testId";
      component.sample.sampleId = sampleId;
      const attachmentId = "testId";
      component.deleteAttachment(attachmentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeAttachmentAction({ sampleId, attachmentId })
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changeDatasetsPageAction and a fetchSampleDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const sample = new Sample();
      sample.sampleId = "testId";
      component.sample = sample;
      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 25,
        length: 25
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeDatasetsPageAction({
          page: event.pageIndex,
          limit: event.pageSize
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchSampleDatasetsAction({ sampleId: sample.sampleId })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      dataset.pid = "testId";

      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + dataset.pid
      );
    });
  });
});
