import { ViewProposalPageComponent } from "./view-proposal-page.component";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { Router, ActivatedRoute } from "@angular/router";
import { StoreModule, Store } from "@ngrx/store";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { Dataset, Proposal } from "shared/sdk";
import {
  changeDatasetsPageAction,
  fetchProposalDatasetsAction
} from "state-management/actions/proposals.actions";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { APP_CONFIG } from "app-config.module";

describe("ViewProposalPageComponent", () => {
  let component: ViewProposalPageComponent;
  let fixture: ComponentFixture<ViewProposalPageComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewProposalPageComponent],
      imports: [StoreModule.forRoot({})],
      providers: [DatePipe, FileSizePipe, SlicePipe]
    });
    TestBed.overrideComponent(ViewProposalPageComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: APP_CONFIG, useValue: { logbookEnabled: true } }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProposalPageComponent);
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

  describe("#onPageChange()", () => {
    it("should dispatch a changeDatasetsPageAction and a fetchProposalDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const proposal = new Proposal();
      proposal.proposalId = "testId";
      component.proposal = proposal;
      const event: PageChangeEvent = {
        pageIndex: 0,
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
        fetchProposalDatasetsAction({ proposalId: proposal.proposalId })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      const pid = encodeURIComponent(dataset.pid);
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets/" + pid);
    });
  });
});
