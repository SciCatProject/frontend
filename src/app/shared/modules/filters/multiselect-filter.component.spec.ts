import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockHttp, MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
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
import { MultiSelectFilterComponent } from "./multiselect-filter.component";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "app-config.service";

describe("MultiSelectFilterComponent", () => {
  let component: MultiSelectFilterComponent;
  let fixture: ComponentFixture<MultiSelectFilterComponent>;

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
        SharedScicatFrontendModule,
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictActionImmutability: false,
              strictActionSerializability: false,
              strictActionTypeUniqueness: false,
              strictActionWithinNgZone: false,
              strictStateImmutability: false,
              strictStateSerializability: false,
            },
          },
        ),
      ],
      declarations: [
        MultiSelectFilterComponent,
        SearchParametersDialogComponent,
      ],
      providers: [
        AsyncPipe,
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
      ],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#onInput()", () => {
    it("should call next on input$", () => {
      const nextSpy = spyOn(component.input$, "next");

      const event = {
        target: {
          value: "testValue",
        },
      };

      component.onInput(event);

      expect(nextSpy).toHaveBeenCalledOnceWith(event.target.value);
    });
  });

  describe("#itemSelected()", () => {
    it("should dispatch an AddMultiSelectFilterAction", () => {
      dispatchSpy = spyOn(component.selectionChange, "emit");

      const value = "test";
      component.itemSelected(value);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        key: component.key,
        value: value,
        event: "add",
      });
    });
  });

  describe("#itemRemoved()", () => {
    it("should dispatch a RemoveMultiSelectFilterAction", () => {
      dispatchSpy = spyOn(component.selectionChange, "emit");

      const value = "test";
      component.itemRemoved(value);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        key: component.key,
        value: value,
        event: "remove",
      });
    });
  });
});
