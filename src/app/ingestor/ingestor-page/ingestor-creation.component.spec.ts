import { IngestorCreationComponent } from "./ingestor-creation.component";
import { IngestorHelper } from "./helper/ingestor.component-helper";
import * as fromActions from "state-management/actions/ingestor.actions";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "@ngrx/store/testing";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { AppConfigService } from "app-config.service";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";

describe("IngestorCreationComponent", () => {
  let component: IngestorCreationComponent;
  let fixture: ComponentFixture<IngestorCreationComponent>;
  let store: MockStore;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  const getConfig = () => ({
    ingestorEnabled: false,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IngestorCreationComponent],
      imports: [
        MatCardModule,
        MatListModule,
        MatIconModule,
        StoreModule.forRoot({}),
      ],
    });
    TestBed.overrideComponent(IngestorCreationComponent, {
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
          { provide: UsersService, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorCreationComponent);
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

  it("should create empty transfer object with CREATION mode", () => {
    spyOn(store, "dispatch");

    component.onClickAddIngestion();

    // Verify the actual object structure
    const expectedObject = IngestorHelper.createEmptyRequestInformation();
    expectedObject.editorMode = "CREATION";

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.resetIngestionObject({ ingestionObject: expectedObject }),
    );
  });
});
