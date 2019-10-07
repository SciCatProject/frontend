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
import { Logbook } from "shared/sdk";

describe("ContentSelectorComponent", () => {
  let component: ContentSelectorComponent;
  let fixture: ComponentFixture<ContentSelectorComponent>;

  let store: MockStore;
  let dispatchSpy;

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
    it("should dispatch an updateFilterAction and a fetchFilteredEntriesAction", () => {
      let dispatchSpy = spyOn(store, "dispatch");

      const name = "testName";
      component.logbook = new Logbook();
      component.logbook.name = name;

      component.filters = {
        textSearch: "test",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };
      const event = new MatCheckboxChange();
      event.checked = false;
      const entry = "Bot Messages";

      component.onSelect(event, entry);

      component.filters.showBotMessages = false;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({ name, filters: component.filters })
      );
    });
  });
});
