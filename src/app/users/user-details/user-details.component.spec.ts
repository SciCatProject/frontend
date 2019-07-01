import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { MockStore } from "shared/MockStubs";
import { ObjKeysPipe, TitleCasePipe } from "shared/pipes/index";

import { MockConfigService } from "../../shared/MockStubs";
import { ConfigService } from "../../shared/services";

import { UserDetailsComponent } from "./user-details.component";

describe("UserDetailsComponent", () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        NguiDatetimePickerModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        UserDetailsComponent,
        ObjKeysPipe,
        TitleCasePipe
      ]
    });
    TestBed.overrideComponent(UserDetailsComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          // needed for config form sub component
          { provide: ConfigService, useClass: MockConfigService }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    component.user = { username: "admin" };
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should contain all disabled form fields", () => {
    const compiled = fixture.debugElement.nativeElement;
    console.log(compiled.querySelector("input"));
    // expect(compiled.querySelector('input').getAttribute("disabled")).toBe('');
  });

  it("should not have a submission or update button", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("button")).toBeNull();
  });
});
