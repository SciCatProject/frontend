import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { AnonymousDashboardComponent } from "./anonymous-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StoreModule, Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute, MockStore } from "shared/MockStubs";
import { provideMockStore } from "@ngrx/store/testing";
import { getHasPrefilledFilters } from "state-management/selectors/datasets.selectors";
import { TableColumn, Dataset } from "state-management/models";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";
import {
  selectColumnAction,
  deselectColumnAction
} from "state-management/actions/user.actions";
import { MatSidenav } from "@angular/material/sidenav";
import { MatCheckboxChange } from "@angular/material/checkbox";

describe("AnonymousDashboardComponent", () => {
  let component: AnonymousDashboardComponent;
  let fixture: ComponentFixture<AnonymousDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [BrowserAnimationsModule, StoreModule.forRoot({})],
      declarations: [AnonymousDashboardComponent, MatSidenav],
      providers: [
        provideMockStore({
          selectors: [{ selector: getHasPrefilledFilters, value: true }]
        })
      ]
    });
    TestBed.overrideComponent(AnonymousDashboardComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useValue: router }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onSettingsClick()", () => {
    it("should toggle the sideNav", () => {
      const toggleSpy = spyOn(component.sideNav, "toggle");

      component.onSettingsClick();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe("#onCloseClick()", () => {
    it("should close the sideNav", () => {
      const closeSpy = spyOn(component.sideNav, "close");

      component.onCloseClick();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("#onSelectColumn()", () => {
    const column: TableColumn = {
      name: "test",
      order: 0,
      type: "standard",
      enabled: false
    };

    it("should dispatch a selectColumnAction if checkBoxChange.checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: true
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectColumnAction({ name: column.name, columnType: column.type })
      );
    });

    it("should dispatch a deselectColumnAction if checkBoxChange.checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: false
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectColumnAction({ name: column.name, columnType: column.type })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/anonymous/datasets/" + encodeURIComponent(dataset.pid)
      );
    });
  });
});
