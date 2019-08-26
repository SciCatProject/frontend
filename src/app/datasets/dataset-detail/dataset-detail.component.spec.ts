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
  AddKeywordFilterAction
} from "state-management/actions/datasets.actions";

describe("DatasetDetailComponent", () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;

  let router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

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

  it("#onClickKeyword should update datasets keyword filter and navigate to datasets table", () => {
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
