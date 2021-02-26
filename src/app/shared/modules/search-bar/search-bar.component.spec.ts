import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SearchBarComponent } from "./search-bar.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

describe("SearchBarComponent", () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SearchBarComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#doFocus()", () => {
    it("should emit an event", () => {
      spyOn(component.onFocus, "emit");

      component.query = "test";
      component.doFocus();

      expect(component.onFocus.emit).toHaveBeenCalledTimes(1);
      expect(component.onFocus.emit).toHaveBeenCalledWith(component.query);
    });
  });

  describe("#doSearch()", () => {
    it("should call next on searchSubject", () => {
      spyOn(component.searchSubject, "next");

      component.query = "test";
      component.doSearch();

      expect(component.searchSubject.next).toHaveBeenCalledTimes(1);
      expect(component.searchSubject.next).toHaveBeenCalledWith(
        component.query
      );
    });
  });

  describe("#focus()", () => {
    it("should call focus on searchBar", () => {
      spyOn(component.searchBar.nativeElement, "focus");

      component.focus();

      expect(component.searchBar.nativeElement.focus).toHaveBeenCalledTimes(1);
    });
  });
});
