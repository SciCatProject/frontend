import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProposalSearchComponent } from "./proposal-search.component";

describe("ProposalSearchComponent", () => {
  let component: ProposalSearchComponent;
  let fixture: ComponentFixture<ProposalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
