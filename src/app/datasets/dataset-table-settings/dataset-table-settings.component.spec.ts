import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import {
  DatasetTableSettingsComponent,
  SelectColumnEvent
} from "./dataset-table-settings.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { SearchBarModule } from "shared/modules/search-bar/search-bar.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TableColumn } from "state-management/models";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

describe("DatasetTableSettingsComponent", () => {
  let component: DatasetTableSettingsComponent;
  let fixture: ComponentFixture<DatasetTableSettingsComponent>;

  let emitSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetTableSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        SearchBarModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#doCloseClick()", () => {
    it("should emit a MouseEvent", () => {
      emitSpy = spyOn(component.closeClick, "emit");

      const event = {} as MouseEvent;

      component.doCloseClick(event);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe("#doSelectColumn()", () => {
    it("should emit a SelectColumnEvent", () => {
      emitSpy = spyOn(component.selectColumn, "emit");

      const event = {} as MatCheckboxChange;
      const column: TableColumn = {
        name: "test",
        order: 0,
        type: "standard",
        enabled: true
      };

      const emittedEvent: SelectColumnEvent = {
        checkBoxChange: event,
        column
      };

      component.doSelectColumn(event, column);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(emittedEvent);
    });
  });

  describe("#doSearch()", () => {
    it("should set filteredColumns based on the input value", () => {
      component.selectableColumns = [
        { name: "test", order: 0, type: "standard", enabled: true },
        { name: "filter", order: 1, type: "custom", enabled: true },
      ];

      component.doSearch("test");

      expect(component.filteredColumns.length).toEqual(1);
    });
  });
});
