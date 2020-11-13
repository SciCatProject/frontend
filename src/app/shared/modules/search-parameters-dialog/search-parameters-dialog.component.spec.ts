import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchParametersDialogComponent } from "./search-parameters-dialog.component";

describe("SearchParametersDialogComponent", () => {
  let component: SearchParametersDialogComponent;
  let fixture: ComponentFixture<SearchParametersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchParametersDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchParametersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
