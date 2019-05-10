import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PublisheddataTableComponent } from "./publisheddata-table.component";

describe("PublisheddataTableComponent", () => {
  let component: PublisheddataTableComponent;
  let fixture: ComponentFixture<PublisheddataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublisheddataTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
