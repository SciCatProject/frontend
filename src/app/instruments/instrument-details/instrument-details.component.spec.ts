import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { InstrumentDetailsComponent } from "./instrument-details.component";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { saveCustomMetadataAction } from "state-management/actions/instruments.actions";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { AppConfigService } from "app-config.service";

const getConfig = () => ({
  editMetadataEnabled: true,
});

describe("InstrumentDetailsComponent", () => {
  let component: InstrumentDetailsComponent;
  let fixture: ComponentFixture<InstrumentDetailsComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InstrumentDetailsComponent],
      imports: [FlexLayoutModule, MatCardModule, MatIconModule, MatTabsModule],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectCurrentInstrument, value: {} }],
        }),
      ],
    });
    TestBed.overrideComponent(InstrumentDetailsComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentDetailsComponent);
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

  describe("#onSaveCustomMetadata()", () => {
    it("should dispatch a saveCustomMetadataAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const pid = "testPid";
      const customMetadata = {};

      component.onSaveCustomMetadata(pid, customMetadata);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveCustomMetadataAction({ pid, customMetadata }),
      );
    });
  });

  it("should track unsaved changes", () => {
    expect(component.hasUnsavedChanges()).toBeFalse();
    component.onHasUnsavedChanges(true);
    expect(component.hasUnsavedChanges()).toBeTrue();
  });
});
