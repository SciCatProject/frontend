import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { DatasetState } from "state-management/state/datasets.store";
import { BatchCardComponent } from "./batch-card.component";

describe("BatchCardComponent", () => {
  let component: BatchCardComponent;
  let fixture: ComponentFixture<BatchCardComponent>;

  let store: MockStore<DatasetState>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BatchCardComponent],
      imports: [MatButtonModule, MatCardModule, MatIconModule],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectDatasetsInBatch, value: [] }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#clear()", () => {
    it("should dispatch a clearBatchAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.clear();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
