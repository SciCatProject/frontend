import { DatasetFormComponent } from "./dataset-form.component";
import { FormsModule } from "@angular/forms";
import { MockStore } from "../../shared/MockStubs";
import { Store } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent],
      imports: [FormsModule]
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
