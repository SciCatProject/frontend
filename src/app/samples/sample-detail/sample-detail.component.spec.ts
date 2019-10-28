import { ActivatedRoute, Router } from "@angular/router";
import {
  MatCardModule,
  MatTabsModule,
  MatButtonModule,
  MatIconModule
} from "@angular/material";
import { MockActivatedRoute, MockStore } from "../../shared/MockStubs";
import { SampleDetailComponent } from "./sample-detail.component";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { rootReducer } from "state-management/reducers/root.reducer";
import { PageChangeEvent } from "shared/modules/table/table.component";
import {
  changeDatasetsPageAction,
  fetchSampleDatasetsAction,
  saveCharacteristicsAction
} from "state-management/actions/samples.actions";
import { Dataset, Sample } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_CONFIG } from "app-config.module";

describe("SampleDetailComponent", () => {
  let component: SampleDetailComponent;
  let fixture: ComponentFixture<SampleDetailComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDetailComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTabsModule,
        NgxJsonViewerModule,
        SharedCatanieModule,
        StoreModule.forRoot({ rootReducer })
      ],
      providers: [DatePipe, FileSizePipe, SlicePipe]
    });
    TestBed.overrideComponent(SampleDetailComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true
            }
          },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDetailComponent);
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

  describe("#formatTableData()", () => {
    it("should do nothing if there are no datasets", () => {
      const data = component.formatTableData(null);

      expect(data).toBeUndefined();
    });

    it("should return an array of data objects if there are datasets", () => {
      const datasets = [new Dataset()];
      const data = component.formatTableData(datasets);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onSaveCharacteristics()", () => {
    it("should dispatch a saveCharacteristicsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const sample = new Sample();
      sample.sampleId = "testId";
      component.sample = sample;
      const characteristics = {};

      component.onSaveCharacteristics(characteristics);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveCharacteristicsAction({
          sampleId: sample.sampleId,
          characteristics
        })
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changeDatasetsPageAction and a fetchSampleDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const sample = new Sample();
      sample.sampleId = "testId";
      component.sample = sample;
      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 25,
        length: 25
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeDatasetsPageAction({
          page: event.pageIndex,
          limit: event.pageSize
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchSampleDatasetsAction({ sampleId: sample.sampleId })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      dataset.pid = "testId";

      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + dataset.pid
      );
    });
  });
});
