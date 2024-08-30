import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { Dataset } from "shared/sdk";
import { AdminTabComponent } from "./admin-tab.component";
import { MatCardModule } from "@angular/material/card";
import { of } from "rxjs";

describe("AdminTabComponent", () => {
  let component: AdminTabComponent;
  let store: jasmine.SpyObj<Store>;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AdminTabComponent],
      providers: [
        {
          provide: Store,
          useValue: jasmine.createSpyObj("Store", [
            "select",
            "pipe",
            "dispatch",
          ]),
        },
      ],
      imports: [MatCardModule, StoreModule.forRoot({})], // Provide the actual StoreModule or mock Store if needed
    });

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    component = TestBed.createComponent(AdminTabComponent).componentInstance;

    store.select.calls.reset();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("#resetDataset()", () => {
    it("should return 'undefined' without confirmation", () => {
      spyOn(window, "confirm").and.returnValue(true);

      const selectSpy = store.select.and.returnValue(
        of({ email: "test@example.com", username: "testuser" }),
      );
      const dispatchSpy = store.dispatch as jasmine.Spy;
      const pipeSpy = store.select as jasmine.Spy;
      component.dataset = new Dataset();
      const res = component.resetDataset();

      expect(res).toBeUndefined();
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
