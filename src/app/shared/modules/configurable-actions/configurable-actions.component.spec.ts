import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConfigurableActionsComponent } from "./configurable-actions.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { MockMatDialogRef, MockUserApi } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import {
  higherMaxFileSizeLimit,
  lowerMaxFileSizeLimit,
  mockActionItems,
  mockActionsConfig,
  mockAppConfigService,
} from "./configurable-actions.test.data";

describe("1010: ConfigurableActionsComponent", () => {
  let component: ConfigurableActionsComponent;
  let fixture: ComponentFixture<ConfigurableActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        PipesModule,
        ReactiveFormsModule,
        MatDialogModule,
        RouterModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
      ],
      declarations: [ConfigurableActionsComponent],
    });
    TestBed.overrideComponent(ConfigurableActionsComponent, {
      set: {
        providers: [
          { provide: UsersService, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: AppConfigService, useValue: mockAppConfigService },
          { provide: UsersService, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableActionsComponent);
    component = fixture.componentInstance;
    component.actionsConfig = mockActionsConfig;
    component.actionItems = mockActionItems;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("0000: should create", () => {
    expect(component).toBeTruthy();
  });

  it("0010: sorted actions should be sorted", () => {
    const sortedActionsConfig = component.sortedActionsConfig;

    for (let i = 1; i < sortedActionsConfig.length; i++) {
      expect(
        sortedActionsConfig[i].order >= sortedActionsConfig[i - 1].order,
      ).toEqual(true);
    }
  });

  it("0020: actions should be visible when enabled in configuration", () => {
    mockAppConfigService.appConfig.datafilesActionsEnabled = true;
    expect(component.visible).toEqual(true);
  });

  it("0030: actions should be not visible when disabled in configuration", () => {
    mockAppConfigService.appConfig.datafilesActionsEnabled = false;
    //spyOn(mockAppConfigService, "getConfig").and.returnValue(localConfig);
    expect(component.visible).toEqual(false);
  });

  it("0040: max file size should be the same as set in configuration, aka higher limit", () => {
    mockAppConfigService.appConfig.maxDirectDownloadSize =
      higherMaxFileSizeLimit;

    expect(component.maxFileSize).toEqual(higherMaxFileSizeLimit);
  });

  it("0050: max file size should be the same as set in configuration, aka lower limit", () => {
    // const localConfig = mockAppConfigService.getConfig();
    // localConfig.maxDirectDownloadSize = lowerMaxFileSizeLimit;
    // spyOn(mockAppConfigService, "getConfig").and.returnValue(localConfig);
    mockAppConfigService.appConfig.maxDirectDownloadSize =
      lowerMaxFileSizeLimit;

    expect(component.maxFileSize).toEqual(lowerMaxFileSizeLimit);
  });

  it("0060: there should be as many actions as defined in default configuration", async () => {
    component.actionsConfig = mockActionsConfig;
    fixture.detectChanges();

    expect(component.sortedActionsConfig.length).toEqual(
      mockActionsConfig.length,
    );
    const htmlElement: HTMLElement = fixture.nativeElement;
    const htmlActions = htmlElement.querySelectorAll("configurable-action");
    expect(htmlActions.length).toEqual(mockActionsConfig.length);
  });

  it("0070: there should be 0 actions with no actions configured", async () => {
    component.actionsConfig = [];
    fixture.detectChanges();

    expect(component.sortedActionsConfig.length).toEqual(0);
    const htmlElement: HTMLElement = fixture.nativeElement;
    const htmlActions = htmlElement.querySelectorAll("configurable-action");
    expect(htmlActions.length).toEqual(0);
  });
});
