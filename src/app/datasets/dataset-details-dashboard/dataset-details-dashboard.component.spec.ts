import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetDetailsDashboardComponent } from "./dataset-details-dashboard.component";
import { MockStore, MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import {
  clearFacetsAction,
  addKeywordFilterAction,
  addAttachmentAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  updatePropertyAction,
} from "../../state-management/actions/datasets.actions";
import { Dataset, UserApi, User, Sample } from "shared/sdk";
import { ReadFile, ReadMode } from "ngx-file-helpers";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigModule, APP_CONFIG } from "app-config.module";
import { SharedCatanieModule } from "shared/shared.module";
import { Router, ActivatedRoute } from "@angular/router";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import {
  MatSlideToggleChange,
  MatSlideToggle,
} from "@angular/material/slide-toggle";

describe("DetailsDashboardComponent", () => {
  let component: DatasetDetailsDashboardComponent;
  let fixture: ComponentFixture<DatasetDetailsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;
  let pipeSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetDetailsDashboardComponent],
      imports: [AppConfigModule, SharedCatanieModule, StoreModule.forRoot({})],
    });
    TestBed.overrideComponent(DatasetDetailsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: UserApi, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailsDashboardComponent);
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

  describe("#isPI()", () => {
    it("should return true if user email equals principalInvestigator of a raw dataset", () => {
      component.user = new User({ email: "test@email.com" });
      component.dataset = new Dataset({
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "raw",
        ownerGroup: "test",
      });
      component.dataset["principalInvestigator"] = "test@email.com";
      component.dataset["creationLocation"] = "test";

      const isPI = component.isPI();

      expect(isPI).toEqual(true);
    });

    it("should return false if user email does not equal principalInvestigator of a raw dataset", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = new Dataset({
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "raw",
        ownerGroup: "test",
      });
      component.dataset["principalInvestigator"] = "test@email.com";
      component.dataset["creationLocation"] = "test";

      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });

    it("should return true if user email equals investigator of a derived dataset", () => {
      component.user = new User({ email: "test@email.com" });
      component.dataset = new Dataset({
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "derived",
        ownerGroup: "test",
      });
      component.dataset["investigator"] = "test@email.com";
      component.dataset["inputDatasets"] = ["test"];
      component.dataset["usedSoftware"] = ["test"];

      const isPI = component.isPI();

      expect(isPI).toEqual(true);
    });

    it("should return false if user email does not equal investigator of a derived dataset", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = new Dataset({
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "derived",
        ownerGroup: "test",
      });
      component.dataset["investigator"] = "test@email.com";
      component.dataset["inputDatasets"] = ["test"];
      component.dataset["usedSoftware"] = ["test"];

      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });

    it("should return false if dataset type is neither 'raw' or 'derived'", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = new Dataset({
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "failTest",
        ownerGroup: "test",
      });
      component.dataset["principalInvestigator"] = "test@email.com";
      component.dataset["creationLocation"] = "test";

      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });
  });

  describe("#onSlidePublic()", () => {
    it("should dispatch a updatePropertyAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      const event = new MatSlideToggleChange({} as MatSlideToggle, true);
      const property = { isPublished: true };
      component.onSlidePublic(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property })
      );
    });
  });

  describe("#onClickKeyword()", () => {
    it("should update datasets keyword filter and navigate to datasets table", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const keyword = "test";
      component.onClickKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        addKeywordFilterAction({ keyword })
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets");
    });
  });

  describe("#onAddKeyword()", () => {
    it("should do nothing if keyword already exists", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.dataset = new Dataset();
      component.dataset.keywords = [keyword];
      component.onAddKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an updatePropertyAction if the keyword does not exist", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.dataset.keywords = [];
      const property = { keywords: [keyword] };
      component.onAddKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property })
      );
    });
  });

  describe("#onRemoveKeyword()", () => {
    it("should do nothing if the keyword does not exist", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.dataset = new Dataset();
      component.dataset.keywords = [];
      component.onRemoveKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an updatePropertyAction if the keyword does exist", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.dataset.keywords = [keyword];
      const property = { keywords: [] };
      component.onRemoveKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property })
      );
    });
  });

  describe("#onClickProposal()", () => {
    it("should navigate to a proposal", () => {
      const proposalId = "ABC123";
      component.onClickProposal(proposalId);

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/proposals/" + proposalId
      );
    });
  });

  describe("#onClickSample()", () => {
    it("should navigate to a sample", () => {
      const sampleId = "testId";
      component.onClickSample(sampleId);

      expect(router.navigateByUrl).toHaveBeenCalledWith("/samples/" + sampleId);
    });
  });

  describe("#onSampleChange()", () => {
    it("should dispatch an updatePropertyAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;

      const sampleId = "testId";
      const sample = new Sample();
      sample.sampleId = sampleId;

      const property = { sampleId };

      component.onSampleChange(sample);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property })
      );
    });
  });

  describe("#onSaveMetadata()", () => {
    it("should dispatch an updatePropertyAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      const metadata = {};
      const property = { scientificMetadata: metadata };
      component.onSaveMetadata(metadata);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property })
      );
    });
  });

  describe("#resetDataset()", () => {
    it("should return 'null' without confirmation", () => {
      dispatchSpy = spyOn(store, "dispatch");
      pipeSpy = spyOn(store, "pipe");
      const dataset = new Dataset();
      const res = component.resetDataset(dataset);

      expect(res).toBeNull();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      expect(pipeSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("#onFileUploaderFilePicked()", () => {
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
          text: () => new Blob().text(),
        },
      };
      component.onFileUploaderFilePicked(file);

      expect(component.pickedFile).toEqual(file);
    });
  });

  describe("#onFileUploaderReadEnd()", () => {
    it("should do nothing if fileCount is not larger than zero", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onFileUploaderReadEnd(0);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an AddAttchment action if fileCount is larger than zero", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.user = new User();
      component.dataset = new Dataset();
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
          text: () => new Blob().text(),
        },
      };
      component.onFileUploaderReadEnd(1);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addAttachmentAction({ attachment: component.attachment })
      );
    });
  });

  describe("#updateCaption()", () => {
    it("should dispatch an UpdateAttachmentCaptionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.dataset = new Dataset();
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
        })
      );
    });
  });

  describe("#deleteAttachment()", () => {
    it("should dispatch a DeleteAttachment action", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.dataset = new Dataset();
      const attachmentId = "testAttachmentId";
      component.deleteAttachment(attachmentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeAttachmentAction({
          datasetId: component.dataset.pid,
          attachmentId,
        })
      );
    });
  });
});
