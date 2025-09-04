/* eslint @typescript-eslint/no-empty-function:0 */

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";

import { SearchParametersDialogComponent } from "./search-parameters-dialog.component";
import { ScientificCondition } from "../../../state-management/models";

const getConfig = () => ({
  scienceSearchUnitsEnabled: true,
});

describe("SearchParametersDialogComponent", () => {
  let component: SearchParametersDialogComponent;
  let fixture: ComponentFixture<SearchParametersDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
      ],
      declarations: [SearchParametersDialogComponent],
    });
    TestBed.overrideComponent(SearchParametersDialogComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
          { provide: MAT_DIALOG_DATA, useValue: { parameterKeys: [] } },
          { provide: MatDialogRef, useValue: { close: () => {} } },
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

  describe("#cancel()", () => {
    it("should close the dialog", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");
      component.cancel();
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("#getUnits()", () => {
    it("should get units from unitsService and call toggleUnitField", () => {
      const getUnitsSpy = spyOn(component["unitsService"], "getUnits");
      const fieldToggleSpy = spyOn(component, "toggleUnitField");

      const parameterKey = "mass";
      component.getUnits(parameterKey);

      expect(getUnitsSpy).toHaveBeenCalledTimes(1);
      expect(getUnitsSpy).toHaveBeenCalledWith(parameterKey);
      expect(fieldToggleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("#toggleUnitField()", () => {
    it("should enable unitField if lhs is valid and relation is not EQUAL_TO_STRING", () => {
      const formValues = {
        lhs: "mass",
        relation: "LESS_THAN",
        rhs: 5,
        unit: "",
      };
      component.parametersForm.setValue(formValues as ScientificCondition);

      component.toggleUnitField();

      expect(component.parametersForm.get("unit").enabled).toEqual(true);
    });
    it("should disable unitField if lhs is invalid", () => {
      const formValues = {
        lhs: "m",
        relation: "LESS_THAN",
        rhs: 5,
        unit: "",
      };
      component.parametersForm.setValue(formValues as ScientificCondition);

      component.toggleUnitField();

      expect(component.parametersForm.get("unit").disabled).toEqual(true);
    });
    it("should disable unitField if relation is EQUAL_TO_STRING", () => {
      const formValues = {
        lhs: "mass",
        relation: "EQUAL_TO_STRING",
        rhs: 5,
        unit: "",
      };
      component.parametersForm.setValue(formValues as ScientificCondition);

      component.toggleUnitField();

      expect(component.parametersForm.get("unit").disabled).toEqual(true);
    });
  });
});
