import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material";
import { LogbookFilterComponent } from "./logbook-filter.component";
import { Logbook, LogbookInterface } from "shared/sdk";

describe("LogbookFilterComponent", () => {
  let component: LogbookFilterComponent;
  let fixture: ComponentFixture<LogbookFilterComponent>;

  const logbookData: LogbookInterface = {
    name: "tesName",
    roomId: "testId",
    messages: [{ message: "test1" }, { message: "test2" }]
  };
  const logbook = new Logbook(logbookData);
  const event = new MatCheckboxChange();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCheckboxModule],
      declarations: [LogbookFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbookFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#isSelected()", () => {
    it("should return true", () => {
      const entry = "test";
      const selected = component.isSelected(entry);

      expect(selected).toEqual(true);
    });
  });

  describe("#doSelect()", () => {
    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;
      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "Bot Messages";
      event.checked = false;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });

    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "Images";
      event.checked = false;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });

    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "User Messages";
      event.checked = false;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });

    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "Bot Messages";
      event.checked = true;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });

    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "Images";
      event.checked = true;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });

    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "User Messages";
      event.checked = true;

      component.doSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(component.onSelect.emit).toHaveBeenCalledTimes(1);
      expect(component.onSelect.emit).toHaveBeenCalledWith(component.filters);
    });
  });
});
