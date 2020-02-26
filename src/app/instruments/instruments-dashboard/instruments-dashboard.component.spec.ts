import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { InstrumentsDashboardComponent } from "./instruments-dashboard.component";
import { MockStore } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { getInstruments } from "state-management/selectors/instruments.selectors";
import { Store } from "@ngrx/store";

describe("InstrumentsDashboardComponent", () => {
  let component: InstrumentsDashboardComponent;
  let fixture: ComponentFixture<InstrumentsDashboardComponent>;

  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InstrumentsDashboardComponent],
      imports: [],
      providers: [
        provideMockStore({
          selectors: [{ selector: getInstruments, value: [] }]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsDashboardComponent);
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
});
