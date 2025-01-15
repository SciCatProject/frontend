import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  MockStore,
  MockActivatedRoute,
  createMock,
  mockDataset,
} from "shared/MockStubs";
import { Router, ActivatedRoute } from "@angular/router";
import { StoreModule, Store } from "@ngrx/store";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  changeDatasetsPageAction,
  fetchProposalDatasetsAction,
} from "state-management/actions/proposals.actions";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { DatasetClass } from "@scicatproject/scicat-sdk-ts";
import { ProposalDatasetsComponent } from "./proposal-datasets.component";

const getConfig = () => ({
  logbookEnabled: true,
});

describe("ViewProposalPageComponent", () => {
  let component: ProposalDatasetsComponent;
  let fixture: ComponentFixture<ProposalDatasetsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDatasetsComponent],
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatTabsModule,
        StoreModule.forRoot({}),
      ],
      providers: [DatePipe, FileSizePipe, SlicePipe],
    });
    TestBed.overrideComponent(ProposalDatasetsComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: AppConfigService, useValue: { getConfig } },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDatasetsComponent);
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
    it("should return empty array if there are no datasets", () => {
      const data = component.formatTableData(null);

      expect(data).toEqual([]);
    });

    it("should return an array of data objects if there are datasets", () => {
      const datasets = [mockDataset];
      const data = component.formatTableData(datasets);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changeDatasetsPageAction and a fetchProposalDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const proposalId = "testId";
      component.proposalId = proposalId;
      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeDatasetsPageAction({
          page: event.pageIndex,
          limit: event.pageSize,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchProposalDatasetsAction({ proposalId }),
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = createMock<DatasetClass>({});
      const pid = encodeURIComponent(dataset.pid);
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets/" + pid);
    });
  });
});
