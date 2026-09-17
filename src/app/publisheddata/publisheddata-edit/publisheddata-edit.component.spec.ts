import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { ActionsSubject, Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { PublishedDataV4Service } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { of } from "rxjs";
import {
  MockActivatedRoute,
  MockPublishedDataApi,
  MockRouter,
  MockStore,
} from "shared/MockStubs";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import {
  createPublishedDataAction,
  resyncPublishedDataAction,
  savePublishedDataAction,
  updatePublishedDataAction,
} from "state-management/actions/published-data.actions";
import { PublisheddataEditComponent } from "./publisheddata-edit.component";

const getConfig = () => ({
  facility: "test",
  landingPage: "https://test-landing-page.com",
});

describe("PublisheddataEditComponent", () => {
  let component: PublisheddataEditComponent;
  let fixture: ComponentFixture<PublisheddataEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublisheddataEditComponent],
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        SharedScicatFrontendModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectDatasetsInBatch, value: [] },
            { selector: selectCurrentPublishedData, value: {} },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(PublisheddataEditComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ActionsSubject, useValue: of({}) },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: PublishedDataV4Service, useClass: MockPublishedDataApi },
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should default to create mode when the route does not set one", () => {
    expect(component.mode).toEqual("create");
  });

  describe("form validity", () => {
    it("should be invalid while title or abstract are empty", () => {
      component.form.patchValue({ title: "", abstract: "" });

      expect(component.form.valid).toEqual(false);
    });

    it("should be valid once title and abstract are filled in", () => {
      component.form.patchValue({
        title: "testTitle",
        abstract: "testAbstract",
        datasetPids: ["testPid"],
      });

      expect(component.form.valid).toEqual(true);
    });
  });

  describe("#onSaveChanges()", () => {
    beforeEach(() => {
      component.form.patchValue({
        title: "testTitle",
        abstract: "testAbstract",
        datasetPids: ["testPid"],
      });
    });

    it("should save a new published data when nothing has been created yet", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");

      component.onSaveChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(
        savePublishedDataAction({ data: component["getPublishedData"]() }),
      );
    });

    it("should update the draft when it has already been saved in create mode", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");
      component.publishedDataDoi = "10.1234/draft";

      component.onSaveChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(
        updatePublishedDataAction({
          doi: "10.1234/draft",
          data: component["getPublishedData"](),
        }),
      );
    });

    it("should resync an existing published data in edit mode", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");
      component.mode = "edit";
      component.publishedDataDoi = "10.1234/existing";

      component.onSaveChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(
        resyncPublishedDataAction({
          doi: "10.1234/existing",
          data: component["getPublishedData"](),
          redirect: false,
        }),
      );
    });

    it("should not dispatch anything if the form is invalid", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");
      component.form.patchValue({ title: "" });

      component.onSaveChanges();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("#onSaveAndContinue()", () => {
    beforeEach(() => {
      component.form.patchValue({
        title: "testTitle",
        abstract: "testAbstract",
        datasetPids: ["testPid"],
      });
    });

    it("should create the published data when nothing has been saved yet", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");

      component.onSaveAndContinue();

      expect(dispatchSpy).toHaveBeenCalledWith(
        createPublishedDataAction({ data: component["getPublishedData"]() }),
      );
    });

    it("should resync and redirect when a doi is already known", () => {
      const dispatchSpy = spyOn(component["store"], "dispatch");
      component.publishedDataDoi = "10.1234/draft";

      component.onSaveAndContinue();

      expect(dispatchSpy).toHaveBeenCalledWith(
        resyncPublishedDataAction({
          doi: "10.1234/draft",
          data: component["getPublishedData"](),
          redirect: true,
        }),
      );
    });
  });

  describe("#hasUnsavedChanges()", () => {
    it("should report changes once the metadata differs from the loaded one", () => {
      expect(component.hasUnsavedChanges()).toEqual(false);

      component.onMetadataChange({ resourceType: "raw" });

      expect(component.hasUnsavedChanges()).toEqual(true);
    });

    it("should not report changes when the metadata is unchanged", () => {
      component.onMetadataChange({});

      expect(component.hasUnsavedChanges()).toEqual(false);
    });
  });
});
