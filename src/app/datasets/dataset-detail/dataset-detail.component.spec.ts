import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { ActivatedRoute } from "@angular/router";
import { DatafilesComponent } from "datasets/datafiles/datafiles.component";
import { DatasetDetailComponent } from "./dataset-detail.component";
import { LinkyPipe } from "ngx-linky";
import { MatTableModule } from "@angular/material";
import { MockActivatedRoute, MockStore } from "shared/MockStubs";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import { SharedCatanieModule } from "shared/shared.module";
import {
  ClearFacetsAction,
  AddKeywordFilterAction,
  DeleteAttachment,
  UpdateAttachmentCaptionAction,
  AddAttachment
} from "state-management/actions/datasets.actions";
import { Dataset } from "shared/sdk";
import { ReadFile, ReadMode } from "ngx-file-helpers";

describe("DatasetDetailComponent", () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;

  let router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;
  let pipeSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        AppConfigModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        SharedCatanieModule,
        StoreModule.forRoot({ rootReducer })
      ],
      declarations: [DatasetDetailComponent, DatafilesComponent, LinkyPipe]
    });
    TestBed.overrideComponent(DatasetDetailComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true
            }
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailComponent);
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

  describe("#updateCaption()", () => {
    it("should dispatch an UpdateAttachmentCaptionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const datasetId = "testDatasetId";
      const attachmentId = "testAttachmentId";
      const caption = "Test caption";
      component.updateCaption(datasetId, attachmentId, caption);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new UpdateAttachmentCaptionAction(datasetId, attachmentId, caption)
      );
    });
  });

  describe("#delete()", () => {
    it("should dispatch a DeleteAttachment action", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const datasetId = "testDatasetId";
      const attachmentId = "testAttachmentId";
      component.delete(datasetId, attachmentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeleteAttachment(datasetId, attachmentId)
      );
    });
  });

  describe("#onClickProp()", () => {
    it("should navigate to a proposal", () => {
      const proposalId = "ABC123";
      component.onClickProp(proposalId);

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

  describe("#onClickKeyword()", () => {
    it(" should update datasets keyword filter and navigate to datasets table", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const keyword = "test";
      component.onClickKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(new ClearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        new AddKeywordFilterAction(keyword)
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets");
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
          slice: () => new Blob().slice()
        }
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
          slice: () => new Blob().slice()
        }
      };
      component.onFileUploaderReadEnd(1);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new AddAttachment(component.attachment)
      );
    });
  });
});
