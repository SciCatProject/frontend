import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MockConfigService, MockStore, MockUserApi } from "shared/MockStubs";
import { UserApi } from "shared/sdk/services";
import { ConfigService } from "shared/services";

import { UserSettingsComponent } from "./user-settings.component";
import { SharedCatanieModule } from "shared/shared.module";

describe("UserSettingsComponent", () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        SharedCatanieModule
      ],
      declarations: [UserSettingsComponent]
    });
    TestBed.overrideComponent(UserSettingsComponent, {
      set: {
        providers: [
          // needed for config form sub component
          { provide: ConfigService, useClass: MockConfigService },
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
