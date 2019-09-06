import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { ProposalSearchComponent } from "./proposal-search.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
} from "@angular/material";
import { rootReducer } from "state-management/reducers/root.reducer";
import { SearchProposalAction } from "state-management/actions/proposals.actions";

describe("ProposalSearchComponent", () => {
  let component: ProposalSearchComponent;
  let fixture: ComponentFixture<ProposalSearchComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalSearchComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.overrideComponent(ProposalSearchComponent, {});
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSearchComponent);
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

  describe("#textSearchChanged()", () => {
    it("should dispatch a SearchProposalAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.textSearchChanged(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new SearchProposalAction(query));
    });
  });
});
