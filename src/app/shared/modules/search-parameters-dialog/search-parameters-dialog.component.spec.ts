import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { APP_CONFIG } from "app-config.module";

import { SearchParametersDialogComponent } from "./search-parameters-dialog.component";

describe("SearchParametersDialogComponent", () => {
  let component: SearchParametersDialogComponent;
  let fixture: ComponentFixture<SearchParametersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SearchParametersDialogComponent],
      imports: [MatAutocompleteModule],
    });
    TestBed.overrideComponent(SearchParametersDialogComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: { scienceSearchUnitsEnabled: true },
          },
          { provide: MAT_DIALOG_DATA, useValue: { parameterKeys: [] } },
          { provide: MatDialogRef, useValue: {} },
        ],
      },
    });
    TestBed.compileComponents();
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
