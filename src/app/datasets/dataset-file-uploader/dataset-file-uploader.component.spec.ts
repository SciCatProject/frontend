import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "@ngrx/store/testing";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import {
  addAttachmentAction,
  removeAttachmentAction,
  updateAttachmentCaptionAction,
} from "state-management/actions/datasets.actions";

import { DatasetFileUploaderComponent } from "./dataset-file-uploader.component";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { AppConfigService } from "app-config.service";
import { HttpClient } from "@angular/common/http";
import { mockDataset, MockHttp, mockUser } from "shared/MockStubs";

const router = {
  navigateByUrl: jasmine.createSpy("navigateByUrl"),
};

const getConfig = () => ({});

describe("DatasetFileUploaderComponent", () => {
  let component: DatasetFileUploaderComponent;
  let fixture: ComponentFixture<DatasetFileUploaderComponent>;
  let dispatchSpy;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetFileUploaderComponent],
      imports: [SharedScicatFrontendModule, StoreModule.forRoot({})],
      providers: [
        { provide: AppConfigService, useValue: { getConfig } },
        { provide: HttpClient, useClass: MockHttp },
      ],
    }).compileComponents();
    TestBed.overrideComponent(DatasetFileUploaderComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFileUploaderComponent);
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

  describe("#onFileUploaderFilePicked()", () => {
    it("should dispatch an AddAttchment action", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.user = mockUser;
      component.dataset = mockDataset;
      const file = {
        name: "test",
        size: 100,
        type: "image/png",
        content: "abc123",
      };
      component.onFileUploaderFilePicked(file);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addAttachmentAction({ attachment: component.attachment }),
      );
    });
  });

  describe("#updateCaption()", () => {
    it("should dispatch an UpdateAttachmentCaptionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.dataset = mockDataset;
      const event: SubmitCaptionEvent = {
        attachmentId: "testAttachmentId",
        caption: "Test caption",
      };
      component.updateCaption(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateAttachmentCaptionAction({
          datasetId: component.dataset.pid,
          attachmentId: event.attachmentId,
          caption: event.caption,
          ownerGroup: component.dataset.ownerGroup,
        }),
      );
    });
  });

  describe("#deleteAttachment()", () => {
    it("should dispatch a DeleteAttachment action", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.dataset = mockDataset;
      const attachmentId = "testAttachmentId";
      component.deleteAttachment(attachmentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeAttachmentAction({
          datasetId: component.dataset.pid,
          attachmentId,
        }),
      );
    });
  });
});
