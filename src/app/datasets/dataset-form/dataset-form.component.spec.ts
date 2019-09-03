import { DatasetFormComponent } from "./dataset-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore } from "../../shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import { MatSelectModule, MatFormFieldModule } from "@angular/material";
import { SaveDatasetAction } from "state-management/actions/datasets.actions";
import { RawDataset } from "shared/sdk";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFormComponent);
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

  it("#onSubmit() should dispatch a SaveDataset action", () => {
    dispatchSpy = spyOn(store, "dispatch");
    component.dataset = new RawDataset();
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new SaveDatasetAction(component.dataset)
    );
  });
});
