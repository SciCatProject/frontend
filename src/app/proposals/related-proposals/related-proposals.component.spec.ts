import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { PageChangeEvent } from "shared/modules/table/table.component";

import { RelatedProposalsComponent } from "./related-proposals.component";
import { MockActivatedRoute, createMock } from "shared/MockStubs";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { selectRelatedProposalsPageViewModel } from "state-management/selectors/proposals.selectors";
import { fetchRelatedProposalsAction } from "state-management/actions/proposals.actions";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { DynamicMatTableModule } from "shared/modules/dynamic-material-table/table/dynamic-mat-table.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("RelatedProposalsComponent", () => {
  let component: RelatedProposalsComponent;
  let fixture: ComponentFixture<RelatedProposalsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };
  let store: Store;
  let dispatchSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedProposalsComponent],
      imports: [BrowserAnimationsModule, DynamicMatTableModule.forRoot({})],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [
            {
              selector: selectRelatedProposalsPageViewModel,
              value: {
                relatedProposals: [],
                relatedProposalsCount: 0,
                relatedProposalsFilters: {
                  skip: 0,
                  limit: 25,
                  sortField: "creationTime:desc",
                },
              },
            },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPaginationChange", () => {
    it("should dispatch a fetchRelatedProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };

      component.onPaginationChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchRelatedProposalsAction({
          limit: event.pageSize,
          skip: event.pageIndex * event.pageSize,
          sortColumn: undefined,
          sortDirection: undefined,
        }),
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a proposal", () => {
      const proposal = createMock<ProposalClass>({});

      component.onRowClick({
        event: RowEventType.RowClick,
        sender: { row: proposal },
      });

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(
        "/proposals/" + encodeURIComponent(proposal.proposalId),
      );
    });
  });
});
