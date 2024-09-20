import { isDevMode, NO_ERRORS_SCHEMA } from "@angular/core";
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
import {
  addGroupFilterAction,
  removeGroupFilterAction,
} from "state-management/actions/datasets.actions";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
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
import { GroupFilterComponent } from "./group-filter.component";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "app-config.service";

describe("GroupFilterComponent", () => {
  let component: GroupFilterComponent;
  let fixture: ComponentFixture<GroupFilterComponent>;

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
      declarations: [GroupFilterComponent, SearchParametersDialogComponent],
      providers: [
        AsyncPipe,
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
      ],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#onGroupInput()", () => {
    it("should call next on groupInput$", () => {
      const nextSpy = spyOn(component.groupInput$, "next");

      const event = {
        target: {
          value: "group",
        },
      };

      component.onGroupInput(event);

      expect(nextSpy).toHaveBeenCalledOnceWith(event.target.value);
    });
  });

  describe("#groupSelected()", () => {
    it("should dispatch an AddGroupFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const group = "test";
      component.groupSelected(group);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(addGroupFilterAction({ group }));
    });
  });

  describe("#groupRemoved()", () => {
    it("should dispatch a RemoveGroupFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const group = "test";
      component.groupRemoved(group);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeGroupFilterAction({ group }),
      );
    });
  });
});
