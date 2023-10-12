import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "@ngrx/store/testing";
import { Dataset } from "shared/sdk";
import { AdminTabComponent } from "./admin-tab.component";
import { MatCardModule } from "@angular/material/card";

describe("AdminTabComponent", () => {
  let component: AdminTabComponent;
  let fixture: ComponentFixture<AdminTabComponent>;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTabComponent],

      imports: [MatCardModule, StoreModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTabComponent);
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
  describe("#resetDataset()", () => {
    it("should return 'undefined' without confirmation", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      const pipeSpy = spyOn(store, "pipe");
      component.dataset = new Dataset();
      const res = component.resetDataset();

      expect(res).toBeUndefined();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
      expect(pipeSpy).toHaveBeenCalledTimes(0);
    });
  });
});
