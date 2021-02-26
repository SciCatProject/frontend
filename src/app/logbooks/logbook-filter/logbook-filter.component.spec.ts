import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LogbookFilterComponent } from "./logbook-filter.component";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material/checkbox";

describe("LogbookFilterComponent", () => {
  let component: LogbookFilterComponent;
  let fixture: ComponentFixture<LogbookFilterComponent>;

  const event = new MatCheckboxChange();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCheckboxModule],
      declarations: [LogbookFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbookFilterComponent);
    component = fixture.componentInstance;
    component.filters = {
      textSearch: "",
      showBotMessages: true,
      showImages: true,
      showUserMessages: true,
      sortField: "timestamp:desc",
      skip: 0,
      limit: 25
    };

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#isSelected()", () => {
    it("should return the value of showBotMessages", () => {
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };

      const entry = "Bot Messages";
      const selected = component.isSelected(entry);

      expect(selected).toEqual(true);
    });

    it("should return the value of showImages", () => {
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };

      const entry = "Images";
      const selected = component.isSelected(entry);

      expect(selected).toEqual(true);
    });

    it("should return the value of showUserMessages", () => {
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };

      const entry = "User Messages";
      const selected = component.isSelected(entry);

      expect(selected).toEqual(false);
    });

    it("should return true if entry does not match any filter property", () => {
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };

      const entry = "Test";
      const selected = component.isSelected(entry);

      expect(selected).toEqual(true);
    });
  });

  describe("#doSelect()", () => {
    it("should emit the new filter", () => {
      spyOn(component.onSelect, "emit");

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
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
