import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { MockConfigService, MockStore } from "shared/MockStubs";
import { ConfigService } from "shared/services";

import { UserSettingsComponent } from "./user-settings.component";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { Message, MessageType, Settings } from "state-management/models";
import {
  saveSettingsAction,
  showMessageAction,
} from "state-management/actions/user.actions";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

describe("UserSettingsComponent", () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          FlexLayoutModule,
          MatCardModule,
          MatIconModule,
          ReactiveFormsModule,
          SharedScicatFrontendModule,
          StoreModule.forRoot({}),
        ],
        declarations: [UserSettingsComponent],
      });
      TestBed.overrideComponent(UserSettingsComponent, {
        set: {
          providers: [
            // needed for config form sub component
            { provide: ConfigService, useClass: MockConfigService },
          ],
        },
      });
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
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

  describe("#onSubmit()", () => {
    it("should dispatch a saveSettingsAction and a showMessageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const message = new Message(
        "Settings saved locally",
        MessageType.Success,
        5000
      );

      const settings: Settings = {
        tapeCopies: "one",
        datasetCount: 25,
        jobCount: 25,
        darkTheme: false,
      };

      component.onSubmit(settings);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveSettingsAction({ settings })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(showMessageAction({ message }));
    });
  });

  describe("#onCopy()", () => {
    it("should copy the token to the users clipboard and dispatch a showMessageAction", () => {
      const commandSpy = spyOn(document, "execCommand");
      dispatchSpy = spyOn(store, "dispatch");

      const message = new Message(
        "SciCat token has been copied to your clipboard",
        MessageType.Success,
        5000
      );

      component.onCopy("test");

      expect(commandSpy).toHaveBeenCalledTimes(1);
      expect(commandSpy).toHaveBeenCalledWith("copy");
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(showMessageAction({ message }));
    });
  });
});
