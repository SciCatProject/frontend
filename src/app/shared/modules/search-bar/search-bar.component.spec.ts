import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SearchBarComponent } from "./search-bar.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";

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
        MatInputModule,
        MatOptionModule,
      ],
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
      spyOn(component.searchBarFocus, "emit");

      component.query = "test";
      component.doFocus();

      expect(component.searchBarFocus.emit).toHaveBeenCalledTimes(1);
      expect(component.searchBarFocus.emit).toHaveBeenCalledWith(
        component.query,
      );
    });
  });

  describe("#doSearch()", () => {
    it("should call next on searchSubject", () => {
      spyOn(component.searchSubject, "next");

      component.query = "test";
      component.doSearch();

      expect(component.searchSubject.next).toHaveBeenCalledTimes(1);
      expect(component.searchSubject.next).toHaveBeenCalledWith(
        component.query,
      );
    });
  });
});
