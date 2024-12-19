import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmpiarComponent } from "./empiar.component";

describe("EmpiarComponent", () => {
  let component: EmpiarComponent;
  let fixture: ComponentFixture<EmpiarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpiarComponent],
    });
    fixture = TestBed.createComponent(EmpiarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
