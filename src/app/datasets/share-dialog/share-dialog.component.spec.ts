/* eslint @typescript-eslint/no-empty-function:0 */

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Store, StoreModule } from "@ngrx/store";
import {
  MockAppConfigService,
  MockAuthService,
  MockDatasetApi,
  MockHttp,
  MockPublishedDataApi,
  MockStore,
  MockUserApi,
  MockUserIdentityApi,
} from "shared/MockStubs";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";

import { ShareDialogComponent } from "./share-dialog.component";
import { DatasetsModule } from "datasets/datasets.module";
import { EffectsModule } from "@ngrx/effects";
import { AppConfigService } from "app-config.service";
import { HttpClient } from "@angular/common/http";
import {
  Configuration,
  DatasetsService,
  InstrumentsService,
  JobsService,
  LogbooksService,
  ProposalsService,
  PublishedDataService,
  SamplesService,
  UserIdentitiesService,
  UsersService,
} from "@scicatproject/scicat-sdk-ts";
import { AuthService } from "shared/services/auth/auth.service";
import { InternalStorage } from "shared/services/auth/base.storage";
import { cold } from "jasmine-marbles";
import { of } from "rxjs";

const data = {
  infoMessage: "",
  disableShareButton: false,
  sharedUsersList: [],
};

describe("ShareDialogComponent", () => {
  let component: ShareDialogComponent;
  let fixture: ComponentFixture<ShareDialogComponent>;
  const appconfig = new MockAppConfigService(null);
  const authService = new MockAuthService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareDialogComponent],
      imports: [
        DatasetsModule,
        BrowserAnimationsModule,
        EffectsModule.forRoot([]),
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Store, useClass: MockStore },
        { provide: UserIdentitiesService, useClass: MockUserIdentityApi },
        { provide: LogbooksService, useValue: {} },
        { provide: DatasetsService, useClass: MockDatasetApi },
        { provide: AppConfigService, useValue: appconfig },
        { provide: HttpClient, useClass: MockHttp },
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useClass: MockUserApi },
        { provide: InstrumentsService, useValue: {} },
        { provide: JobsService, useValue: {} },
        { provide: ProposalsService, useValue: {} },
        { provide: SamplesService, useValue: {} },
        { provide: PublishedDataService, useClass: MockPublishedDataApi },
        { provide: MAT_DIALOG_DATA, useValue: data },
        {
          provide: Configuration,
          useClass: Configuration,
        },
        {
          provide: UserIdentitiesService,
          useValue: { userIdentitiesControllerIsValidEmail: () => {} },
        },
        InternalStorage,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#isInvalid()", () => {
    it("should return true if form value is empty", () => {
      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(true);
    });

    it("should return true if form value is not a valid email address", () => {
      component.emailFormControl.setValue("test");

      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(true);
    });

    it("should return false if form value is a valid email address", () => {
      const email = "test@email.com";
      component.emailFormControl.setValue(email);

      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(false);
    });
  });

  describe("#add()", () => {
    it("should dispatch a showMessageAction with type `error` if user does not exist", fakeAsync(() => {
      spyOn(
        component.userIdentititiesService,
        "userIdentitiesControllerIsValidEmail",
      ).and.throwError("Not found");
      const dispatchSpy = spyOn(component.store, "dispatch");
      const email = "test@email.com";

      component.add(email);
      tick();

      const message = new Message(
        "The email address is not connected to a SciCat user",
        MessageType.Error,
        5000,
      );

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(showMessageAction({ message }));
    }));

    it("should add the user to the users array and reset the form field if user exists", fakeAsync(() => {
      const email = "test@email.com";
      const userIdentity = {
        externalId: "username",
        profile: {
          email,
        },
      };
      // TODO: Fix this any type casting here
      spyOn(
        component.userIdentititiesService,
        "userIdentitiesControllerIsValidEmail",
      ).and.returnValue(of(true) as any);
      component.emailFormControl.setValue(email);
      expect(component.emailFormControl.value).toEqual(email);

      component.add(email);
      tick();

      expect(component.users).toContain(email);
      expect(component.emailFormControl.value).toEqual(null);
    }));
  });

  describe("#remove()", () => {
    it("should do nothing if trying to remove a user not in the array", () => {
      const email = "test@email.com";
      component.users.push(email);
      expect(component.users).toContain(email);
      const users = component.users;

      const notEmail = "notInArray@email.com";
      component.remove(notEmail);

      expect(component.users).toEqual(users);
    });

    it("should remove the email from the emails array if the array contains the email", () => {
      const email = "test@email.com";
      component.users.push(email);
      expect(component.users).toContain(email);

      component.remove(email);

      expect(component.users).not.toContain(email);
    });
  });

  describe("#isEmpty()", () => {
    it("should return false if emails array is not empty", () => {
      const email = "test@email.com";
      component.users.push(email);

      const isEmpty = component.isEmpty();

      expect(isEmpty).toEqual(false);
    });

    it("should return true if emails array is empty", () => {
      const isEmpty = component.isEmpty();

      expect(isEmpty).toEqual(true);
    });
  });

  describe("#share()", () => {
    it("should close the dialog and emit data", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      const email = "test@email.com";
      component.users.push(email);
      const users = component.users;

      component.share();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(dialogCloseSpy).toHaveBeenCalledWith({ users });
    });
  });

  describe("#cancel()", () => {
    it("should close the dialog", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      component.cancel();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
