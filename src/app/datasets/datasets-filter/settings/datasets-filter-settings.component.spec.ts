import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockMatDialogRef, MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { removeScientificConditionAction } from "state-management/actions/datasets.actions";
import { of } from "rxjs";
import { deselectColumnAction } from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {
  MatDialogModule,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AsyncPipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./datasets-filter-settings.component";
import { ConditionConfig } from "../../../shared/modules/filters/filters.module";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

export class MockMatDialog {
  open() {
    return {
      afterClosed: () => of([]),
    };
  }
}

const getConfig = () => ({
  scienceSearchEnabled: false,
});

const condition: ScientificCondition = {
  lhs: "test",
  relation: "EQUAL_TO_NUMERIC",
  rhs: 5,
  unit: "s",
};

describe("DatasetsFilterSettingsComponent", () => {
  let component: DatasetsFilterSettingsComponent;
  let fixture: ComponentFixture<DatasetsFilterSettingsComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      declarations: [
        DatasetsFilterSettingsComponent,
        SearchParametersDialogComponent,
      ],
      providers: [AsyncPipe],
    });
    TestBed.overrideComponent(DatasetsFilterSettingsComponent, {
      set: {
        providers: [
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: MatSnackBar },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              conditionConfigs: [
                {
                  condition,
                  enabled: true,
                },
              ],
            },
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("#showDatasetsFilterSettingsDialog()", () => {
    it("should open DatasetsFilterSettingsComponent", () => {
      spyOn(component.dialog, "open").and.callThrough();
      dispatchSpy = spyOn(store, "dispatch");

      // Spy or stub other side effects in addCondition as needed
      spyOn(component, "toggleCondition").and.callFake(
        (ignored: ConditionConfig) => ignored,
      );

      component.metadataKeys$ = of(["test", "keys"]);
      component.addCondition();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        SearchParametersDialogComponent,
        {
          data: {
            parameterKeys: ["test", "keys"],
          },
        },
      );
    });
  });

  describe("#removeCondition()", () => {
    it("should dispatch a removeScientificConditionAction and a deselectColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const conditionConfig: ConditionConfig = {
        condition,
        enabled: true,
      };

      component.removeCondition(conditionConfig, 0);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeScientificConditionAction({ condition }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectColumnAction({ name: condition.lhs, columnType: "custom" }),
      );
    });
  });
});
