import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetFormComponent } from "./dataset-form.component";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent]
    }).compileComponents();
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
