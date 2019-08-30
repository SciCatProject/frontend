import { DatasetFormComponent } from "./dataset-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore } from "../../shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { rootReducer } from "../../state-management/reducers/root.reducer";
import { SharedCatanieModule } from "shared/shared.module";
import { MatSelectModule, MatFormFieldModule } from "@angular/material";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        SharedCatanieModule,
        StoreModule.forRoot({
          rootReducer
        })
      ]
    });
    TestBed.overrideComponent(DatasetFormComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
