import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PublishComponent } from "./publish.component";
import {
  MatFormFieldModule,
  MatIconModule,
  MatChipsModule,
  MatCardModule,
  MatInputModule
} from "@angular/material";
import { Router } from "@angular/router";
import { MockRouter, MockStore, MockPublishedDataApi } from "shared/MockStubs";
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

describe("PublishComponent", () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublishComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: getDatasetsInBatch, value: [] },
            { selector: getCurrentPublishedData, value: {} }
          ]
        })
      ]
    });
    TestBed.overrideComponent(PublishComponent, {
      set: {
        providers: [
          { provide: ActionsSubject, useValue: of({}) },
          { provide: APP_CONFIG, useValue: { facility: "test" } },
          { provide: PublishedDataApi, useClass: MockPublishedDataApi },
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#addAuthor()", () => {
    it("should push an author to the authors property in the form", () => {
      const event = {
        input: {
          value: ""
        },
        value: "test author"
      };
      component.addAuthor(event);

      expect(component.form.authors).toContain(event.value);
    });
  });

  describe("#removeAuthor()", () => {
    it("should remove an author from the authors property in the form", () => {
      const author = "testAuthor";
      component.form.authors = [author];

      component.removeAuthor(author);

      expect(component.form.authors).not.toContain(author);
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
        title: "testTitle",
        creator: "testCreator",
        authors: ["testAuthor"],
        affiliation: "testAffiliation",
        publisher: "testPublisher",
        resourceType: "testType",
        description: "testDescription",
        abstract: "testAbstract",
        pidArray: ["testPid"],
        publicationYear: 2019,
        url: "testUrl",
        dataDescription: "testDataDescription",
        thumbnail: "testThumbnail",
        numberOfFiles: 1,
        sizeOfArchive: 100
      };

      const isValid = component.formIsValid();

      expect(isValid).toEqual(true);
    });
  });
});
