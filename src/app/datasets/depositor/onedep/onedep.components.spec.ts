import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OneDepComponent } from "./onedep.component";

describe("OneDepComponent", () => {
  let component: OneDepComponent;
  let fixture: ComponentFixture<OneDepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneDepComponent],
    });
    fixture = TestBed.createComponent(OneDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
