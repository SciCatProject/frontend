import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";

import { ConfigService } from "shared/services/config.service";
import { MockConfigService, MockStore } from "shared/MockStubs";
import { ObjKeysPipe, TitleCasePipe } from "shared/pipes/index";

import { ConfigFormComponent } from "./config-form.component";
import { Store, StoreModule } from "@ngrx/store";
import { TreeTableModule } from "ng-treetable";

import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule
} from "@angular/material";

describe("ConfigFormComponent", () => {
  let component: ConfigFormComponent;
  let fixture: ComponentFixture<ConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NguiDatetimePickerModule,
        TreeTableModule,
        StoreModule.forRoot({}),
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule
      ],
      declarations: [ConfigFormComponent, ObjKeysPipe, TitleCasePipe],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: Store, useClass: MockStore }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFormComponent);
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
