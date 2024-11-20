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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { PublishedDataService } from "@scicatproject/scicat-sdk-ts";

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
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectCurrentPublishedData, value: {} }],
        }),
      ],
    });
    TestBed.overrideComponent(PublisheddataEditComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ActionsSubject, useValue: of({}) },
          { provide: PublishedDataService, useClass: MockPublishedDataApi },
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
        chipInput: {
          inputElement: {
            value: "testCreator",
          },
        },
        value: "testCreator",
      } as MatChipInputEvent;
      component.addCreator(event);

      expect(component.creator!.value).toContain(event.value);
    });
  });

  describe("#removeCreator()", () => {
    it("should remove a creator from the creator property in the form", () => {
      const creator = "testCreator";
      component.creator!.setValue([]);
      component.creator!.value.push("firstCreator", creator);

      component.removeCreator(1);

      expect(component.creator!.value).not.toContain(creator);
    });
  });

  describe("#addRelatedPublication()", () => {
    it("should push a related publication to the relatedPublications property in the form", () => {
      const event = {
        chipInput: {
          inputElement: {
            value: "testRelatedPublication",
          },
        },
        value: "testRelatedPublication",
      } as MatChipInputEvent;
      component.addRelatedPublication(event);

      expect(component.relatedPublications!.value).toContain(event.value);
    });
  });

  describe("#removeRelatedPublication()", () => {
    it("should remove a related publication from the relatedPublications property in the form", () => {
      const relatedPublication = "testRelatedPublication";
      component.relatedPublications!.setValue([]);
      component.relatedPublications!.value.push(
        "firstRelatedPublication",
        relatedPublication,
      );

      component.removeRelatedPublication(1);

      expect(component.relatedPublications!.value).not.toContain(
        relatedPublication,
      );
    });
  });
});
