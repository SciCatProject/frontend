import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { PageChangeEvent } from "shared/modules/table/table.component";

import { RelatedProposalsComponent } from "./related-proposals.component";
import { TableModule } from "shared/modules/table/table.module";
import { createMock } from "shared/MockStubs";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { selectRelatedProposalsPageViewModel } from "state-management/selectors/proposals.selectors";
import {
  changeRelatedProposalsPageAction,
  fetchRelatedProposalsAction,
} from "state-management/actions/proposals.actions";

describe("RelatedProposalsComponent", () => {
  let component: RelatedProposalsComponent;
  let fixture: ComponentFixture<RelatedProposalsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: Store;
  let dispatchSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedProposalsComponent],
      imports: [TableModule],
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

  describe("#onPageChange", () => {
    it("should dispatch a changeRelatedProposalsPageAction and a fetchRelatedProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeRelatedProposalsPageAction({
          page: event.pageIndex,
          limit: event.pageSize,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchRelatedProposalsAction());
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a proposal", () => {
      const proposal = createMock<ProposalClass>({});

      component.onRowClick(proposal);

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(
        "/proposals/" + encodeURIComponent(proposal.proposalId),
      );
    });
  });
});
