import { LoginService } from "users/login.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import {
  MockConfigService,
  MockStore,
  MockUserApi,
  MockLoginService
} from "shared/MockStubs";
import { ObjKeysPipe, TitleCasePipe } from "shared/pipes/index";
import { UserApi } from "shared/sdk/services";
import { ConfigService } from "../../shared/services";

import { UserSettingsComponent } from "./user-settings.component";

describe("UserSettingsComponent", () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        NguiDatetimePickerModule,
        StoreModule.forRoot({})
      ],
      declarations: [UserSettingsComponent, ObjKeysPipe, TitleCasePipe]
    });
    TestBed.overrideComponent(UserSettingsComponent, {
      set: {
        providers: [
          // needed for config form sub component
          { provide: ConfigService, useClass: MockConfigService },
          { provide: LoginService, useClass: MockLoginService },
          { provide: Store, useClass: MockStore },
          { provide: UserApi, useClass: MockUserApi }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
