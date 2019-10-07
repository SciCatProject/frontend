import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material";
import { Store, StoreModule } from "@ngrx/store";
import { rootReducer } from "state-management/reducers/root.reducer";
import { ContentSelectorComponent } from "./content-selector.component";
import { MockStore } from "shared/MockStubs";
import {
  updateFilterAction,
  fetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";
import { Logbook, LogbookInterface } from "shared/sdk";

describe("ContentSelectorComponent", () => {
  let component: ContentSelectorComponent;
  let fixture: ComponentFixture<ContentSelectorComponent>;

  let store: MockStore;
  let dispatchSpy;

  const logbookData: LogbookInterface = {
    name: "tesName",
    roomId: "testId",
    messages: [{ message: "test1" }, { message: "test2" }],
    id: 0
  };
  const logbook = new Logbook(logbookData);
  const event = new MatCheckboxChange();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCheckboxModule, StoreModule.forRoot({ rootReducer })],
      declarations: [ContentSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

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

  describe("#onSelect()", () => {
    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showBotMessages set to true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;
      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "Bot Messages";
      event.checked = false;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });

    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showImages set to true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "Images";
      event.checked = false;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });

    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showUserMessages set to true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };

      const entry = "User Messages";
      event.checked = false;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });

    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showBotMessages set to false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "Bot Messages";
      event.checked = true;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });

    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showImages set to false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "Images";
      event.checked = true;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });

    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction with showUserMessages set to false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;

      component.filters = {
        textSearch: "test",
        showBotMessages: false,
        showImages: false,
        showUserMessages: false
      };

      const entry = "User Messages";
      event.checked = true;

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: logbook.name,
          filters: component.filters
        })
      );
    });
  });
});
