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
import { PublishedDataService } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";

describe("PublisheddataEditComponent", () => {
  let component: PublisheddataEditComponent;
  let fixture: ComponentFixture<PublisheddataEditComponent>;
  const getConfig = () => ({
    landingPage: "https://test-landing-page.com",
  });

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
          { provide: AppConfigService, useValue: { getConfig } },
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
});
