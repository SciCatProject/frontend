import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RelatedDatasetsComponent } from "./related-datasets.component";

describe("RelatedDatasetsComponent", () => {
  let component: RelatedDatasetsComponent;
  let fixture: ComponentFixture<RelatedDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedDatasetsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
