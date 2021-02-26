import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PublisheddataEditComponent } from "./publisheddata-edit.component";

import { Router, ActivatedRoute } from "@angular/router";
import {
  MockRouter,
  MockStore,
  MockPublishedDataApi,
  MockActivatedRoute,
} from "shared/MockStubs";
import { Store, ActionsSubject } from "@ngrx/store";
import { APP_CONFIG } from "app-config.module";
import { PublishedDataApi } from "shared/sdk";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

describe("PublisheddataEditComponent", () => {
  let component: PublisheddataEditComponent;
  let fixture: ComponentFixture<PublisheddataEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublisheddataEditComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: getDatasetsInBatch, value: [] },
            { selector: getCurrentPublishedData, value: {} },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(PublisheddataEditComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ActionsSubject, useValue: of({}) },
          { provide: APP_CONFIG, useValue: { facility: "test" } },
          { provide: PublishedDataApi, useClass: MockPublishedDataApi },
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

  describe("#addCreator()", () => {
    it("should push a creator to the creator property in the form", () => {
      const event = {
        input: {
          value: "",
        },
        value: "testCreator",
      };
      component.addCreator(event);

      expect(component.form.creator).toContain(event.value);
    });
  });

  describe("#removeCreator()", () => {
    it("should remove a creator from the creator property in the form", () => {
      const creator = "testCreator";
      component.form.creator = [creator];

      component.removeCreator(creator);

      expect(component.form.creator).not.toContain(creator);
    });
  });

  describe("#formIsValid()", () => {
    it("should return false if form has undefined properties", () => {
      component.form.title = undefined;

      const isValid = component.formIsValid();

      expect(isValid).toEqual(false);
    });

    it("should return true if form has no undefined properties and their lengths > 0", () => {
      component.form = {
        doi: "abc123",
        title: "testTitle",
        creator: ["testCreator"],
        publisher: "testPublisher",
        resourceType: "testType",
        abstract: "testAbstract",
        publicationYear: 2019,
        url: "testUrl",
        dataDescription: "testDataDescription",
        thumbnail: "testThumbnail",
        relatedPublications: ["testpub"],
        downloadLink: "link",
        pidArray: ["abc123"],
        numberOfFiles: null,
        sizeOfArchive: null,
      };

      const isValid = component.formIsValid();

      expect(isValid).toEqual(true);
    });
  });
});
