import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleSearchComponent } from "./sample-search.component";
import { MatFormFieldModule } from "@angular/material";

describe("SampleSearchComponent", () => {
  let component: SampleSearchComponent;
  let fixture: ComponentFixture<SampleSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule
      ],
      declarations: [
        SampleSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
