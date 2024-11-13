import { DatafilesComponent } from "../../datasets/datafiles/datafiles.component";
import { DatasetDetailComponent } from "./dataset-detail.component";
import { LinkyPipe } from "ngx-linky";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { of } from "rxjs";
import { Dataset, Sample, User } from "shared/sdk";
import { MatDialogRef } from "@angular/material/dialog";
import { SampleEditComponent } from "datasets/sample-edit/sample-edit.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MockStore } from "@ngrx/store/testing";
import { Store, StoreModule } from "@ngrx/store";
import {
  addKeywordFilterAction,
  clearFacetsAction,
  updatePropertyAction,
} from "state-management/actions/datasets.actions";
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "shared/MockStubs";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { AppConfigService } from "app-config.service";
import { AttachmentService } from "shared/services/attachment.service";

describe("DatasetDetailComponent", () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({
    editMetadataEnabled: true,
  });

  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatTabsModule,
        NgxJsonViewerModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      providers: [AttachmentService],
      declarations: [DatasetDetailComponent, DatafilesComponent, LinkyPipe],
    });
    TestBed.overrideComponent(DatasetDetailComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailComponent);
    component = fixture.componentInstance;
    component.dataset = {
      pid: "testPid",
      isPublished: false,
    } as unknown as Dataset;
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

  describe("#onClickKeyword()", () => {
    it("should update datasets keyword filter and navigate to datasets table", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      const keyword = "test";
      component.dataset = new Dataset();
      component.onClickKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        addKeywordFilterAction({ keyword }),
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets");
    });
  });

  describe("#onAddKeyword()", () => {
    it("should add property keywords if it does not exist already", () => {
      const event = {
        chipInput: {
          inputElement: {
            value: "test",
          },
        },
        value: "test",
      };
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.onEditModeEnable();
      component.onAddKeyword(event as MatChipInputEvent);

      expect(component.keywords).toBeTruthy();
      expect(component.keywords.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
    });

    it("should do nothing if keyword already exists", () => {
      const event = {
        chipInput: {
          inputElement: {
            value: "test",
          },
        },
        value: "test",
      };
      component.dataset = new Dataset();
      component.dataset.keywords = ["test"];
      component.onEditModeEnable();
      expect(component.keywords.value.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
      component.onAddKeyword(event as MatChipInputEvent);

      expect(component.keywords.value.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
    });

    it("should add a keyword if the keyword does not exist", () => {
      const event = {
        chipInput: {
          inputElement: {
            value: "test",
          },
        },
        value: "test",
      };
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.dataset.keywords = [];
      component.onEditModeEnable();
      expect(component.keywords.value.length).toBe(0);
      expect(component.form.value.keywords.length).toBe(0);
      component.onAddKeyword(event as MatChipInputEvent);

      expect(component.keywords.value.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
    });
  });

  describe("#onRemoveKeyword()", () => {
    it("should do nothing if the keyword does not exist", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.dataset = new Dataset();
      component.dataset.keywords = [];
      component.onRemoveKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an updatePropertyAction if the keyword does exist", () => {
      const keyword = "test";
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.dataset.keywords = [keyword];
      component.onEditModeEnable();
      expect(component.keywords.value.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
      component.onRemoveKeyword(keyword);

      expect(component.keywords.value.length).toBe(0);
      expect(component.form.value.keywords.length).toBe(0);
    });
  });

  describe("#onSaveGeneralInformationChanges()", () => {
    it("should dispatch an updatePropertyAction", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      component.dataset.keywords = [keyword];
      component.dataset.datasetName = "Test dataset name";
      component.dataset.description = "Test dataset description";
      component.onEditModeEnable();
      expect(component.keywords.value.length).toBe(1);
      expect(component.form.value.keywords.length).toBe(1);
      component.onSaveGeneralInformationChanges();

      const property = {
        keywords: component.dataset.keywords,
        datasetName: component.dataset.datasetName,
        description: component.dataset.description,
      };

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property }),
      );
    });
  });

  describe("#onSlidePublic()", () => {
    it("should dispatch a updatePropertyAction", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      const event = new MatSlideToggleChange({} as MatSlideToggle, true);
      const property = { isPublished: true };
      component.onSlidePublic(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property }),
      );
    });
  });

  describe("#onRemoveShare()", () => {
    it("should do nothing if dataset is undefined", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      component.dataset = undefined;
      const share = "test";
      component.onRemoveShare(share);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should do nothing if dataset is defined and group does not exist", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      component.dataset = new Dataset();
      component.dataset.sharedWith = [];
      const share = "test";
      component.onRemoveShare(share);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch an updatePropertyAction if dataset is defined and group exists", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      const pid = "testPid";
      const share = "test";
      component.dataset = {
        pid,
        isPublished: false,
        sharedWith: [share],
      } as unknown as Dataset;
      const dialogOpenSpy = spyOn(component.dialog, "open").and.returnValue({
        afterClosed: () => of("ok"),
      } as MatDialogRef<DialogComponent>);
      component.onRemoveShare(share);

      const property = { sharedWith: [] };
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property }),
      );
    });
  });

  describe("#onClickInstrument()", () => {
    it("should navigate to an instrument", () => {
      const instrumentId = "testId";

      component.onClickInstrument(instrumentId);

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/instruments/" + instrumentId,
      );
    });
  });

  describe("#onClickProposal()", () => {
    it("should navigate to a proposal", () => {
      const proposalId = "ABC123";
      component.onClickProposal(proposalId);

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/proposals/" + proposalId,
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

  describe("#openSampleEditDialog()", () => {
    it("should open the sample edit dialog and dispatch updatePropertyAction", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      component.dataset = new Dataset();
      component.dataset.ownerGroup = "test";
      component.sample = new Sample();
      const sampleId = "testId";
      component.sample.sampleId = sampleId;
      const pid = "testPid";
      component.dataset.pid = pid;
      const property = { sampleId };
      const dialogOpenSpy = spyOn(component.dialog, "open").and.returnValue({
        afterClosed: () => of({ sample: { sampleId: "testId" } }),
      } as MatDialogRef<SampleEditComponent>);
      component.openSampleEditDialog();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialogOpenSpy).toHaveBeenCalledWith(SampleEditComponent, {
        width: "1000px",
        data: { ownerGroup: "test", sampleId: "testId" },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property }),
      );
    });
  });

  describe("#onSaveMetadata()", () => {
    it("should dispatch an updatePropertyAction", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      const pid = "testPid";
      component.dataset = new Dataset();
      component.dataset.pid = pid;
      const metadata = {};
      const property = { scientificMetadata: metadata };
      component.onSaveMetadata(metadata);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePropertyAction({ pid, property }),
      );
    });
  });

  describe("#isPI()", () => {
    it("should return true if user username is admin", () => {
      component.user = new User({
        username: "admin",
        email: "test@email.com",
      });

      const isPI = component.isPI();

      expect(isPI).toEqual(true);
    });

    it("should return true if user email equals principalInvestigator of a raw dataset", () => {
      component.user = new User({ email: "test@email.com" });
      component.dataset = {
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "raw",
        ownerGroup: "test",
        principalInvestigator: "test@email.com",
        creationLocation: "test",
      } as unknown as Dataset;

      const isPI = component.isPI();

      expect(isPI).toEqual(true);
    });

    it("should return false if user email does not equal principalInvestigator of a raw dataset", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = {
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "raw",
        ownerGroup: "test",
        principalInvestigator: "test@email.com",
        creationLocation: "test",
      } as unknown as Dataset;
      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });

    it("should return true if user email equals investigator of a derived dataset", () => {
      component.user = new User({ email: "test@email.com" });
      component.dataset = {
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "derived",
        ownerGroup: "test",
        investigator: "test@email.com",
        inputDatasets: ["test"],
        usedSoftware: ["test"],
      } as unknown as Dataset;

      const isPI = component.isPI();

      expect(isPI).toEqual(true);
    });

    it("should return false if user email does not equal investigator of a derived dataset", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = {
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "derived",
        ownerGroup: "test",
        investigator: "test@email.com",
        inputDatasets: ["test"],
        usedSoftware: ["test"],
      } as unknown as Dataset;
      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });

    it("should return false if dataset type is neither 'raw' or 'derived'", () => {
      component.user = new User({ email: "failTest@email.com" });
      component.dataset = {
        owner: "test",
        contactEmail: "test",
        sourceFolder: "test",
        creationTime: new Date(),
        type: "failTest",
        ownerGroup: "test",
        principalInvestigator: "test@email.com",
        creationLocation: "test",
      } as unknown as Dataset;
      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });

    it("should return false if no user is provided", () => {
      component.user = undefined;

      const isPI = component.isPI();

      expect(isPI).toEqual(false);
    });
  });
});
