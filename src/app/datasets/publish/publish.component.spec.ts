import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PublishComponent } from "./publish.component";

import { Router, ActivatedRoute } from "@angular/router";
import {
  MockRouter,
  MockStore,
  MockPublishedDataApi,
  MockActivatedRoute,
} from "shared/MockStubs";
import { Store, ActionsSubject } from "@ngrx/store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { AppConfigService } from "app-config.service";
import { PublishedDataService } from "@scicatproject/scicat-sdk-ts-angular";

const getConfig = () => ({
  facility: "test",
});

describe("PublishComponent", () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublishComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
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
            { selector: selectDatasetsInBatch, value: [] },
            { selector: selectCurrentPublishedData, value: {} },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(PublishComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ActionsSubject, useValue: of({}) },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: PublishedDataService, useClass: MockPublishedDataApi },
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore },
        ],
      },
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

  describe("#formIsValid()", () => {
    it("should return false if form has undefined properties", () => {
      component.form.title = undefined;

      const isValid = component.formIsValid();

      expect(isValid).toEqual(false);
    });

    it("should return true if form has no undefined properties and their lengths > 0", () => {
      component.form = {
        title: "testTitle",
        abstract: "testAbstract",
        datasetPids: ["testPid"],
      };

      const isValid = component.formIsValid();

      expect(isValid).toEqual(true);
    });
  });
});
