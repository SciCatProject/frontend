import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
  waitForAsync,
} from "@angular/core/testing";

import { ConfigurableActionComponent } from "./configurable-action.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import {
  MockAuthService,
  MockHtmlElement,
  MockMatDialogRef,
  MockUserApi,
} from "shared/MockStubs";
//import { ActionConfig, ActionItems } from "./configurable-action.interfaces";
import {
  Configuration as ApiConfiguration,
  UsersService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { AuthService } from "shared/services/auth/auth.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
//import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AppConfigService } from "app-config.service";
//import { boolean } from "mathjs";
import {
  higherMaxFileSizeLimit,
  lowerMaxFileSizeLimit,
  maxSizeType,
  mockActionItems,
  mockActionItemsDatafilesAllfiles,
  mockActionItemsDatafilesFile1,
  mockActionItemsDatafilesFile2,
  mockActionItemsDatafilesNofiles,
  mockActionsConfig,
  mockAppConfigService,
  mockUserProfiles,
} from "./configurable-actions.test.data";
import { of } from "rxjs";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import {
  ActionConfig,
  ActionItemDataset,
  ActionItems,
} from "./configurable-action.interfaces";
import {
  actionFailureAction,
  actionSuccessAction,
} from "state-management/actions/actions.actions";
import { buildDefaultBatchActions } from "./configurable-actions.defaults";

describe("1000: ConfigurableActionComponent", () => {
  let component: ConfigurableActionComponent;
  let fixture: ComponentFixture<ConfigurableActionComponent>;
  let htmlForm: HTMLFormElement;
  let htmlInput: HTMLInputElement;

  let store: MockStore;

  enum actionSelectorType {
    download_all = "eed8efec-4354-11ef-a3b5-d75573a5d37f",
    download_selected = "3072fafc-4363-11ef-b9f9-ebf568222d26",
    notebook_all_form = "4f974f0e-4364-11ef-9c63-03d19f813f4e",
    notebook_selected_form = "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
    notebook_all_json = "0cd5b592-0b1a-11f0-a42c-23e177127ee7",
    notebook_selected_json = "a414773a-a526-11f0-a7f2-ff1026e5dba9",
    publish = "9c6a11b6-a526-11f0-8795-6f025b320cc3",
    unpublish = "94a1d694-a526-11f0-947b-038d53cd837a",
    link = "c3bcbd40-a526-11f0-915a-93eeff0860ab",
    dialog_open = "6a4d5226-1cf8-4dbf-a7db-9a4a16b1f523",
    dialog_xhr = "4fcf5658-95f4-4fbd-99fd-8df4bb4bf0d0",
  }

  const usersControllerGetUserJWTV3 = () => ({
    subscribe: () => ({
      jwt: "9a2322a8-4a7d-11ef-a0f5-d7c40fcf1693",
    }),
  });

  // const getCurrentToken = () => ({
  //   id: "4ac45f3e-4d79-11ef-856c-6339dab93bee",
  // });

  beforeAll(() => {
    htmlForm = document.createElement("form");
    (htmlForm as HTMLFormElement).submit = () => {};
    htmlInput = document.createElement("input");
  });

  beforeEach(waitForAsync(() => {
    const mockAuthService = new MockAuthService();

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        PipesModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
      ],
      declarations: [ConfigurableActionComponent],
      providers: [provideMockStore(), DatePipe],
    });
    TestBed.overrideComponent(ConfigurableActionComponent, {
      set: {
        providers: [
          { provide: UsersService, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          {
            provide: UsersService,
            useValue: { usersControllerGetUserJWTV3 },
          },
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
          { provide: AppConfigService, useValue: mockAppConfigService },
          {
            provide: ApiConfiguration,
            useValue: { basePath: mockAppConfigService.appConfig.lbBaseURL },
          },
          //{ provide: Store, useClass: MockStore }
        ],
      },
    });
    TestBed.compileComponents();

    store = TestBed.inject(MockStore);
  }));

  // Narrow, structural views onto private members, used only to spy on/stub
  // them in tests without resorting to `any`.
  type ComponentWithBuildDatasetStaticMap = {
    buildDatasetStaticMap: () => Record<string, () => unknown>;
  };
  type ComponentWithDatePipe = {
    datePipe: { transform: (date: Date, format: string) => string };
  };

  function createComponent(
    componentActionConfig: ActionConfig,
    componentsActionItems: ActionItems,
  ) {
    fixture = TestBed.createComponent(ConfigurableActionComponent);
    component = fixture.componentInstance;
    component.actionConfig = componentActionConfig;
    component.actionItems = componentsActionItems;
    fixture.detectChanges();
    return component;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableActionComponent);
    component = fixture.componentInstance;
    component.actionConfig = mockActionsConfig[0];
    component.actionItems = mockActionItems;
    fixture.detectChanges();
  });
  // beforeEach(inject([Store], (mockStore: MockStore) => {
  //   store = mockStore;
  // }));

  afterEach(() => {
    fixture.destroy();
  });

  // it("0000: should create", () => {
  //   expect(component).toBeTruthy();
  // });

  /*
   * Unit tests for enabled/disabled cases performed
   * ------------------------
   * -------- Action                         , uuid
   * Test # , Max Size           , Selected           , Is Published      , Status   , Result(Enabled)
   * -----------------------------------------------------------------------------------------
   * -------- Download All                   , eed8efec-4354-11ef-a3b5-d75573a5d37f
   * 0010   , low max file size  , no selected files  , n/a               , disabled , false
   * 0020   , low max file size  , file 1 selected    , n/a               , disabled , false
   * 0030   , low max file size  , file 2 selected    , n/a               , disabled , false
   * 0040   , low max file size  , all files selected , n/a               , disabled , false
   * 0050   , high max file size , no selected files  , n/a               , enabled  , true
   * 0060   , high max file size , file 1 selected    , n/a               , enabled  , true
   * 0070   , high max file size , file 2 selected    , n/a               , enabled  , true
   * 0080   , high max file size , all files selected , n/a               , enabled  , true
   *
   * -------- Download Selected              , 3072fafc-4363-11ef-b9f9-ebf568222d26
   * 0110   , low max file size  , no selected files  , n/a               , disabled , false
   * 0120   , low max file size  , file 1 selected    , n/a               , enabled  , true
   * 0130   , low max file size  , file 2 selected    , n/a               , enabled  , true
   * 0140   , low max file size  , all files selected , n/a               , disabled , false
   * 0150   , high max file size , no selected files  , n/a               , disabled , false
   * 0160   , high max file size , file 1 selected    , n/a               , enabled  , true
   * 0170   , high max file size , file 2 selected    , n/a               , enabled  , true
   * 0180   , high max file size , all files selected , n/a               , enabled  , true
   *
   * -------- Notebook All (Form)            , 4f974f0e-4364-11ef-9c63-03d19f813f4e
   * -------- Notebook All (JSON)            , a414773a-a526-11f0-a7f2-ff1026e5dba9
   * 0210   , low max file size  , no selected files  , n/a               , enabled  , true
   * 0220   , low max file size  , file 1 selected    , n/a               , enabled  , true
   * 0230   , low max file size  , file 2 selected    , n/a               , enabled  , true
   * 0240   , low max file size  , all files selected , n/a               , enabled  , true
   * 0250   , high max file size , no selected files  , n/a               , enabled  , true
   * 0260   , high max file size , file 1 selected    , n/a               , enabled  , true
   * 0270   , high max file size , file 2 selected    , n/a               , enabled  , true
   * 0280   , high max file size , all files selected , n/a               , enabled  , true
   *
   * -------- Notebook Selected (Form)       , fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd
   * -------- Notebook Selected (JSON)       , a414773a-a526-11f0-a7f2-ff1026e5dba9
   * 0310   , low max file size  , no selected files  , n/a               , disabled , false
   * 0320   , low max file size  , file 1 selected    , n/a               , enabled  , true
   * 0330   , low max file size  , file 2 selected    , n/a               , enabled  , true
   * 0340   , low max file size  , all files selected , n/a               , enabled  , true
   * 0350   , high max file size , no selected files  , n/a               , disabled , false
   * 0360   , high max file size , file 1 selected    , n/a               , enabled  , true
   * 0370   , high max file size , file 2 selected    , n/a               , enabled  , true
   * 0380   , high max file size , all files selected , n/a               , enabled  , true
   *
   * -------- Publish                        , 9c6a11b6-a526-11f0-8795-6f025b320cc3
   * 0410   , n/a                , n/a                , false             , enabled  , true
   * 0420   , n/a                , n/a                , true              , disabled , false
   *
   * -------- Unpublish                      , 94a1d694-a526-11f0-947b-038d53cd837a
   * 0510   , n/a                , n/a                , false             , disabled , false
   * 0520   , n/a                , n/a                , true              , enabled  , true
   *
   * -------- ESS (link)                     , c3bcbd40-a526-11f0-915a-93eeff0860ab
   * 0610   , n/a                , n/a                , n/a               , enabled  , true
   *
   */

  interface TestCase {
    test: string;
    action: string;
    limit: maxSizeType;
    actionItems: ActionItems;
    published?: boolean;
    result: boolean;
    user?: number;
  }

  const testEnabledDisabledCases: TestCase[] = [
    // -------- Download All
    {
      test: "0010: Download All should be disabled with lowest max size limit and no files are selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    },
    {
      test: "0020: Download All should be disabled with lowest max size limit and file 1 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile1,
      result: false,
    },
    {
      test: "0030: Download All should be disabled with lowest max size limit and file 2 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile2,
      result: false,
    },
    {
      test: "0040: Download All should be disabled with lowest max size limit and all files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: false,
    },
    {
      test: "0050: Download All should be enabled with highest max size limit and no files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    },
    {
      test: "0060: Download All should be enabled with highest max size limit and file 1 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0070: Download All should be enabled with highest max size limit and file 2 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0080: Download All should be enabled with highest max size limit and all files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    // -------- Download Selected
    {
      test: "0110: Download Selected should be disabled with lowest max size and no files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    },
    {
      test: "0120: Download Selected should be enabled with lowest max size and file 1 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0130: Download Selected should be enabled with lowest max size and file 2 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0140: Download Selected should be disabled with lowest max size and all files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: false,
    },
    {
      test: "0150: Download Selected should be disabled with highest max size and no files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    },
    {
      test: "0160: Download Selected should be enabled with highest max size and file 1 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0170: Download Selected should be enabled with highest max size and file 2 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0180: Download Selected should be enabled with highest max size and all files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    // -------- Notebook All (Form and JSON)
    {
      test: "0210: Notebook All should be enabled with lowest max size and no files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    },
    {
      test: "0220: Notebook All should be enabled with lowest max size and file 1 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0230: Notebook All should be enabled with lowest max size and file 2 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0240: Notebook All should be enabled with lowest max size and all files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    {
      test: "0250: Notebook All should be enabled with highest max size and no files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    },
    {
      test: "0260: Notebook All should be enabled with highest max size and file 1 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0270: Notebook All should be enabled with highest max size and file 2 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0280: Notebook All should be enabled with highest max size and all files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    // -------- Notebook Selected (Form and JSON)
    {
      test: "0310: Notebook Selected should be disabled with lowest max size and no files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    },
    {
      test: "0320: Notebook Selected should be enabled with lowest max size and file 1 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0330: Notebook Selected should be enabled with lowest max size and file 2 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0340: Notebook Selected should be enabled with lowest max size and all files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    {
      test: "0350: Notebook Selected should be disabled with highest max size and no files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    },
    {
      test: "0360: Notebook Selected should be enabled with highest max size and file 1 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile1,
      result: true,
    },
    {
      test: "0370: Notebook Selected should be enabled with highest max size and file 2 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: true,
    },
    {
      test: "0380: Notebook Selected should be enabled with highest max size and all files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: true,
    },
    // -------- Publish
    {
      test: "0410: Publish should be enabled when a single dataset is not already published and user is owner",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: false,
      result: true,
      user: 1,
    },
    {
      test: "0420: Publish should be disabled when a single dataset is already published and user is an owner",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: true,
      result: false,
      user: 1,
    },
    {
      test: "0430: Publish should be disabled when a single dataset is not already published and user is not owner",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: false,
      result: false,
      user: 2,
    },
    {
      test: "0440: Publish should be disabled when a single dataset is already published and user is not owner",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: true,
      result: false,
      user: 2,
    },

    // -------- Unpublish
    {
      test: "0510: Unpublish should be disabled when a single dataset is not already published and user is an owner",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: false,
      result: false,
      user: 1,
    },
    {
      test: "0520: Unpublish should be enabled when a single dataset is already published and user is an owner",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: true,
      result: true,
      user: 1,
    },
    {
      test: "0530: Unpublish should be disabled when a single dataset is not already published and users is not an owner",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: false,
      result: false,
      user: 2,
    },
    {
      test: "0540: Unpublish should be disabled when a single dataset is already published and users is not an owner",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      actionItems: mockActionItemsDatafilesNofiles,
      published: true,
      result: false,
      user: 2,
    },

    // -------- ESS (link)
    {
      test: "0610: ESS link should always be enabled, with lower download limit and anonymous user",
      action: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      limit: maxSizeType.lower,
      actionItems: mockActionItemsDatafilesNofiles,
      published: undefined,
      result: true,
    },
    {
      test: "0620: ESS link should always be enabled, with higher download limit and anonymous user",
      action: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      published: undefined,
      result: true,
    },
    {
      test: "0630: ESS link should always be enabled, with user who is an owner",
      action: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      published: undefined,
      result: true,
      user: 1,
    },
    {
      test: "0610: ESS link should always be enabled, with user who is not an owner",
      action: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      published: undefined,
      result: true,
      user: 2,
    },
  ];

  function selectTestCase(testCase: TestCase) {
    const userProfile = mockUserProfiles[testCase.user] || {};

    store.overrideSelector(selectProfile, userProfile);
    store.refreshState();

    const currentActionConfig = mockActionsConfig.filter(
      (a) => a.id == testCase.action,
    )[0];

    switch (testCase.limit) {
      case maxSizeType.higher:
        mockAppConfigService.appConfig.maxDirectDownloadSize =
          higherMaxFileSizeLimit;
        break;
      case maxSizeType.lower:
      default:
        mockAppConfigService.appConfig.maxDirectDownloadSize =
          lowerMaxFileSizeLimit;
        break;
    }

    const published: boolean | string = testCase.published || false;
    if (typeof published === "boolean") {
      testCase.actionItems.datasets.forEach((dataset) => {
        dataset.isPublished = published;
      });
    }

    createComponent(currentActionConfig, testCase.actionItems);
  }

  testEnabledDisabledCases.forEach((testCase) => {
    it(testCase.test, () => {
      selectTestCase(testCase);

      expect(component.disabled).toEqual(!testCase.result);
    });
  });

  function createFakeElement(elementType: string): HTMLElement {
    let element: HTMLElement = null;

    switch (elementType) {
      case "form":
        element = htmlForm.cloneNode(true) as HTMLElement;
        break;
      case "input":
        element = htmlInput.cloneNode(true) as HTMLElement;
        break;
      default:
        element = null;
    }
    return element;
  }

  it("1000: Form submission should have all files when Download All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);

    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );

    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );

    expect(formFiles.length).toEqual(
      mockActionItemsDatafilesNofiles.datasets[0].files?.length,
    );
  });

  it("1010: Form submission should have correct url when Download All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);
    const action_url = mockActionsConfig
      .filter((a) => a.id == actionSelectorType.download_all)[0]
      .url.replace(/\/$/, "");
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    expect(component.form.action.replace(/\/$/, "")).toEqual(action_url);
  });

  it("1020: Form submission should have correct dataset when Download All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );

    const formDataset = formChildren.filter((item) =>
      item.name.includes("dataset"),
    );
    expect(formDataset.length).toEqual(1);

    const datasetPid = formDataset[0].value;
    expect(datasetPid).toEqual(mockActionItems.datasets[0].pid);
  });

  it("1030: Form submission should have correct file when Download Selected is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_selected,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile1,
      result: false,
    } as TestCase);
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(1);
    const formFilePath = formFiles[0].value;
    const selectedFiles =
      mockActionItemsDatafilesFile1.datasets[0].files.filter((f) => f.selected);
    expect(selectedFiles.length).toEqual(1);
    const selectedFilePath = selectedFiles[0].path;
    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("1040: Form submission should have all files when Notebook All (Form) is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(mockActionItems.datasets[0].files.length);
  });

  it("1050: Form submission should have correct url when Notebook All (Form) is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);
    const action_url = mockActionsConfig
      .filter((a) => a.id == actionSelectorType.notebook_all_form)[0]
      .url.replace(/\/$/, "");
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    expect(component.form.action.replace(/\/$/, "")).toEqual(action_url);
  });

  it("1060: Form submission should have correct file when Notebook Selected (Form) is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_selected_form,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: false,
    } as TestCase);
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.performAction();

    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(1);
    const formFilePath = formFiles[0].value;
    const selectedFiles =
      mockActionItemsDatafilesFile2.datasets[0].files.filter((f) => f.selected);
    expect(selectedFiles.length).toEqual(1);
    const selectedFilePath = selectedFiles[0].path;
    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("1070: Download All action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector("button");
    expect(actionButton).not.toBeNull();
    expect(actionButton?.textContent).toContain(
      mockActionsConfig.filter(
        (a) => a.id == actionSelectorType.download_all,
      )[0].label,
    );
  });

  it("1080: Download Selected action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_selected,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector("button");
    expect(actionButton).not.toBeNull();
    expect(actionButton?.textContent).toContain(
      mockActionsConfig.filter(
        (a) => a.id == actionSelectorType.download_selected,
      )[0].label,
    );
  });

  it("1090: Notebook All (Form) action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector("button");
    expect(actionButton).not.toBeNull();
    expect(actionButton?.textContent).toContain(
      mockActionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_all_form,
      )[0].label,
    );
  });

  it("1100: Notebook Selected (Form) action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_selected_form,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesAllfiles,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector("button");
    expect(actionButton).not.toBeNull();
    expect(actionButton?.textContent).toContain(
      mockActionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_selected_form,
      )[0].label,
    );
  });

  it("1110: Notebook All (Json) action should fetch with correct payload when clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_json,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);

    component.jwt = "TEST_JWT";

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve(
        new Response(new Blob(), {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    component.performAction();

    const spy = window.fetch as jasmine.Spy;
    expect(spy.calls.count()).toBeGreaterThan(0);
    const call = spy.calls.mostRecent();
    expect(call).toBeDefined();
    const [url, opts] = call.args;
    //const [url, opts] = (window.fetch as jasmine.Spy).calls.mostRecent().args;

    const currentAction = mockActionsConfig.filter(
      (a) => a.id == actionSelectorType.notebook_all_json,
    )[0];
    expect(url).toBe(currentAction.url);
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");

    //{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ @pid }}\",\"directory\":\"{{ @folder }}\",\"files\": {{ @files[] }},\"jwt\":\"{{ #jwt }}\",\"scicat_url\":\"https://staging.scicat.ess.url\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}

    const body = JSON.parse(opts.body);

    expect(body.template_id).toBe("c975455e-ede3-11ef-94fb-138c9cd51fc0");
    expect(body.parameters.jwt).toBe("TEST_JWT");
    expect(body.parameters.dataset).toBe(
      mockActionItemsDatafilesNofiles.datasets[0].pid,
    );
    expect(body.parameters.directory).toBe(
      mockActionItemsDatafilesNofiles.datasets[0].sourceFolder,
    );
    expect(body.parameters.files.length).toBe(
      mockActionItemsDatafilesNofiles.datasets[0].files.length,
    );
  });

  it("1120: Notebook Selected (Json) action should fetch with correct payload when clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_selected_json,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesFile2,
      result: false,
    } as TestCase);

    component.jwt = "TEST_JWT";
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve(
        new Response(new Blob(), {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    component.performAction();

    const spy = window.fetch as jasmine.Spy;

    expect(spy.calls.count()).toBeGreaterThan(0);
    const call = spy.calls.mostRecent();

    expect(call).toBeDefined();
    const [url, opts] = call.args;
    const currentAction = mockActionsConfig.filter(
      (a) => a.id == actionSelectorType.notebook_selected_json,
    )[0];

    expect(url).toBe(currentAction.url);
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");

    //{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ @pid }}\",\"directory\":\"{{ @folder }}\",\"files\": {{ @files[] }},\"jwt\":\"{{ #jwt }}\",\"scicat_url\":\"https://staging.scicat.ess.url\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}
    const body = JSON.parse(opts.body);
    expect(body.template_id).toBe("c975455e-ede3-11ef-94fb-138c9cd51fc0");
    expect(body.parameters.jwt).toBe("TEST_JWT");
    expect(body.parameters.dataset).toBe(
      mockActionItemsDatafilesFile2.datasets[0].pid,
    );
    expect(body.parameters.directory).toBe(
      mockActionItemsDatafilesFile2.datasets[0].sourceFolder,
    );
    expect(body.parameters.files.length).toBe(1);
    expect(body.parameters.files[0]).toBe(
      mockActionItemsDatafilesFile2.datasets[0].files.filter(
        (f) => f.selected,
      )[0].path,
    );
  });

  it("1130: link action should open a new tab and redirect to the specified url", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.link,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);
    spyOn(window, "open");
    component.performAction();

    const current_action = mockActionsConfig.filter(
      (a) => a.id == actionSelectorType.link,
    )[0];
    expect(window.open).toHaveBeenCalledWith(
      current_action.url,
      current_action.target,
    );
  });

  it("1140: should build dependency graph", () => {
    const variables: Record<string, unknown> = {
      files: "#Dataset0FilesPath",
      first: "@files[0]",
      copy: "@first",
    };

    const graph = component["buildDependenciesGraph"](variables);

    expect(graph["files"]).toEqual(new Set<string>());
    expect(graph["first"]).toEqual(new Set<string>(["files"]));
    expect(graph["copy"]).toEqual(new Set<string>(["first"]));
  });

  it("1150: should support multiple dependencies", () => {
    const variables: Record<string, unknown> = {
      a: "@b",
      b: "@c",
      c: "@a",
    };

    const graph = component["buildDependenciesGraph"](variables);

    expect(graph["a"]).toEqual(new Set<string>(["b"]));
    expect(graph["b"]).toEqual(new Set<string>(["c"]));
    expect(graph["c"]).toEqual(new Set<string>(["a"]));
  });

  it("1160: should resolve dependent variables with array index extraction", () => {
    // Mock the static dataset handler to return the files array when requested
    spyOn(
      component as unknown as ComponentWithBuildDatasetStaticMap,
      "buildDatasetStaticMap",
    ).and.returnValue({
      "#Dataset0FilesPath": () => ["/file/1", "/file/2", "/file/3"],
    });

    component.actionConfig = {
      variables: {
        files: "#Dataset0FilesPath",
        first: "@files[0]",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(component.variables["files"]).toEqual([
      "/file/1",
      "/file/2",
      "/file/3",
    ]);
    expect(component.variables["first"]).toBe("/file/1");
  });

  it("1170: should resolve chained dependencies", () => {
    spyOn(
      component as unknown as ComponentWithBuildDatasetStaticMap,
      "buildDatasetStaticMap",
    ).and.returnValue({
      "#Dataset0FilesPath": () => ["/file/1", "/file/2", "/file/3"],
    });

    component.actionConfig = {
      variables: {
        files: "#Dataset0FilesPath",
        first: "@files[0]",
        copy: "@first",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(component.variables["copy"]).toBe("/file/1");
  });

  it("1180: should detect cyclic dependencies", () => {
    spyOn(console, "error");

    component.actionConfig = {
      variables: {
        a: "@b",
        b: "@a",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(console.error).toHaveBeenCalledWith(
      jasmine.stringContaining("Cyclic dependency detected in variable"),
    );
  });

  it("1190: should resolve selectors after variable substitution", () => {
    // Mock datePipe transform response
    (component as unknown as ComponentWithDatePipe).datePipe = {
      transform: () => "2026",
    };

    component.actionConfig = {
      variables: {
        year: "#date_format(2026-05-12T14:53:45Z, yyyy)",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(component.variables["year"]).toBe("2026");
  });

  it("1200: dialog action should open dialog with configured data", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.dialog_open,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);

    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of(undefined),
    } as MatDialogRef<unknown>);

    component.performAction();

    expect(component.dialog.open).toHaveBeenCalled();
  });

  it("1210: dialog action should execute xhr on close using dialog variables", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.dialog_xhr,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: false,
    } as TestCase);

    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({ reason: "integration-test" }),
    } as MatDialogRef<unknown>);

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve(
        new Response(new Blob(), {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    component.performAction();

    const fetchSpy = window.fetch as jasmine.Spy;
    expect(fetchSpy.calls.count()).toBe(1);
    const [url, opts] = fetchSpy.calls.mostRecent().args;
    expect(url).toBe("https://example.org/action");

    const requestOptions = opts as RequestInit;
    expect(requestOptions.method).toBe("POST");

    const body = JSON.parse(String(requestOptions.body)) as Record<
      string,
      unknown
    >;
    expect(body["dataset"]).toBe(
      mockActionItemsDatafilesNofiles.datasets[0].pid,
    );
    expect(body["reason"]).toBe("integration-test");
  });

  it("1211: executeNextStep should not warn about unsupported type when onSuccess is xhr or form", () => {
    const consoleWarnSpy = spyOn(console, "warn");
    const typeXhrSpy = spyOn<any>(component, "typeXhr");
    const typeFormSpy = spyOn<any>(component, "typeForm");
    const typeJsonToDownloadSpy = spyOn<any>(component, "typeJsonToDownload");

    component["executeNextStep"]("xhr");
    component["executeNextStep"]("form");
    component["executeNextStep"]("json-download");

    expect(typeXhrSpy).toHaveBeenCalledTimes(1);
    expect(typeFormSpy).toHaveBeenCalledTimes(1);
    expect(typeJsonToDownloadSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("1212: executeNextStep should warn once about a genuinely unsupported onSuccess type", () => {
    const consoleWarnSpy = spyOn(console, "warn");
    const typeXhrSpy = spyOn<any>(component, "typeXhr");
    const typeFormSpy = spyOn<any>(component, "typeForm");

    component["executeNextStep"]("link");

    expect(consoleWarnSpy).toHaveBeenCalledOnceWith(
      "Unsupported onSuccess action type:",
      "link",
    );
    expect(typeXhrSpy).not.toHaveBeenCalled();
    expect(typeFormSpy).not.toHaveBeenCalled();
  });

  it("1151: xhr action should dispatch actionFailureAction when request fails", fakeAsync(() => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-failure-test",
      label: "XHR",
      type: "xhr",
      url: "https://example.org/action",
      method: "POST",
      payload: "#empty",
      variables: {},
      enabled: "true",
    };

    const error = new Error("Network failure");
    const componentStore = component["store"] as Store;
    const storeDispatchSpy = spyOn(componentStore, "dispatch");
    spyOn(window, "fetch").and.returnValue(Promise.reject(error));

    component["typeXhr"]();
    flushMicrotasks();

    expect(storeDispatchSpy).toHaveBeenCalledWith(actionFailureAction());
  }));

  it("1220: #datasetOwner token should enable action for owner", () => {
    store.overrideSelector(selectProfile, mockUserProfiles[1]);
    store.overrideSelector(selectIsAdmin, false);
    store.refreshState();

    const ownerConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "owner-enabled-test",
      enabled: "#datasetOwner",
      variables: {},
    };

    createComponent(ownerConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeFalse();
  });

  it("1230: #userIsAdmin token should enable action for admin", () => {
    store.overrideSelector(selectProfile, mockUserProfiles[2]);
    store.overrideSelector(selectIsAdmin, true);
    store.refreshState();

    const adminConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "admin-enabled-test",
      enabled: "#userIsAdmin",
      variables: {},
    };

    createComponent(adminConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeFalse();
  });

  it("1240: #isPublished token should follow dataset publish status", () => {
    const publishedItems: ActionItems = {
      datasets: structuredClone(mockActionItemsDatafilesNofiles.datasets),
    };
    publishedItems.datasets[0].isPublished = true;

    const publishedConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "published-enabled-test",
      enabled: "#isPublished",
      variables: {},
    };

    createComponent(publishedConfig, publishedItems);
    expect(component.disabled).toBeFalse();
  });

  it("1250: #!isPublished token should follow dataset publish status", () => {
    const unpublishedItems: ActionItems = {
      datasets: structuredClone(mockActionItemsDatafilesNofiles.datasets),
    };
    unpublishedItems.datasets[0].isPublished = false;

    const unpublishedConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "unpublished-enabled-test",
      enabled: "#!isPublished",
      variables: {},
    };

    createComponent(unpublishedConfig, unpublishedItems);
    expect(component.disabled).toBeFalse();
  });

  it("1260: #Length should evaluate selected file list length", () => {
    const lengthConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "length-enabled-test",
      enabled: "#Length(@files) > 0",
      variables: {
        files: "#Dataset0SelectedFilesPath",
      },
    };

    createComponent(lengthConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeTrue();

    createComponent(lengthConfig, mockActionItemsDatafilesFile1);
    expect(component.disabled).toBeFalse();
  });

  it("1270: #MaxDownloadableSize should compare against configured max size", () => {
    mockAppConfigService.appConfig.maxDirectDownloadSize =
      lowerMaxFileSizeLimit;

    const sizeConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "max-download-enabled-test",
      enabled: "#MaxDownloadableSize(@totalSize)",
      variables: {
        totalSize: "#Dataset0FilesTotalSize",
      },
    };

    createComponent(sizeConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeTrue();

    mockAppConfigService.appConfig.maxDirectDownloadSize =
      higherMaxFileSizeLimit;
    createComponent(sizeConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeFalse();
  });

  it("1280: hidden expression should hide action when condition is true", () => {
    const hiddenConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "hidden-test",
      hidden: "#Length(@files) === 0",
      variables: {
        files: "#Dataset0SelectedFilesPath",
      },
    };

    createComponent(hiddenConfig, mockActionItemsDatafilesNofiles);
    expect(component.visible).toBeFalse();

    createComponent(hiddenConfig, mockActionItemsDatafilesFile1);
    expect(component.visible).toBeTrue();
  });

  it("1285: disabled should return boolean disabled config directly", () => {
    const disabledBooleanConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "disabled-boolean-test",
      disabled: true,
      variables: {},
    };

    createComponent(disabledBooleanConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeTrue();

    disabledBooleanConfig.disabled = false;
    createComponent(disabledBooleanConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeFalse();
  });

  it("1286: disabled should invert boolean enabled config directly", () => {
    const enabledBooleanConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "enabled-boolean-test",
      enabled: true,
      variables: {},
    };

    createComponent(enabledBooleanConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeFalse();

    enabledBooleanConfig.enabled = false;
    createComponent(enabledBooleanConfig, mockActionItemsDatafilesNofiles);
    expect(component.disabled).toBeTrue();
  });

  interface SelectorCoverageCase {
    name: string;
    selector: string;
    expected: unknown;
  }

  const allKeywordMapSelectors: SelectorCoverageCase[] = [
    {
      name: "Dataset0Pid",
      selector: "#Dataset0Pid",
      expected: mockActionItems.datasets[0].pid,
    },
    {
      name: "Dataset0FilesPath",
      selector: "#Dataset0FilesPath",
      expected: (mockActionItems.datasets[0].files || []).map((f) => f.path),
    },
    {
      name: "Dataset0FilesTotalSize",
      selector: "#Dataset0FilesTotalSize",
      expected: (mockActionItems.datasets[0].files || []).reduce(
        (sum, f) => sum + Number(f.size || 0),
        0,
      ),
    },
    {
      name: "Dataset0SourceFolder",
      selector: "#Dataset0SourceFolder",
      expected: mockActionItems.datasets[0].sourceFolder,
    },
    {
      name: "Dataset0SelectedFilesPath",
      selector: "#Dataset0SelectedFilesPath",
      expected: (mockActionItems.datasets[0].files || [])
        .filter((f) => f.selected)
        .map((f) => f.path),
    },
    {
      name: "Dataset0SelectedFilesCount",
      selector: "#Dataset0SelectedFilesCount",
      expected: (mockActionItems.datasets[0].files || []).filter(
        (f) => f.selected,
      ).length,
    },
    {
      name: "Dataset0SelectedFilesTotalSize",
      selector: "#Dataset0SelectedFilesTotalSize",
      expected: (mockActionItems.datasets[0].files || [])
        .filter((f) => f.selected)
        .reduce((sum, f) => sum + Number(f.size || 0), 0),
    },
    {
      name: "DatasetIndexedField",
      selector: "#Dataset[0]Field[isPublished]",
      expected: mockActionItems.datasets[0].isPublished,
    },
    {
      name: "DatasetsPid",
      selector: "#DatasetsPid",
      expected: mockActionItems.datasets.map((d) => d.pid),
    },
    {
      name: "DatasetsSourceFolder",
      selector: "#DatasetsSourceFolder",
      expected: mockActionItems.datasets.map((d) => d.sourceFolder),
    },
    {
      name: "DatasetsFilesPath",
      selector: "#DatasetsFilesPath",
      expected: mockActionItems.datasets.flatMap((d) =>
        (d.files || []).map((f) => f.path),
      ),
    },
    {
      name: "DatasetsFilesTotalSize",
      selector: "#DatasetsFilesTotalSize",
      expected: mockActionItems.datasets
        .flatMap((d) => d.files || [])
        .reduce((sum, f) => sum + Number(f.size || 0), 0),
    },
    {
      name: "DatasetsSelectedFilesPath",
      selector: "#DatasetsSelectedFilesPath",
      expected: mockActionItems.datasets
        .flatMap((d) => d.files || [])
        .filter((f) => f.selected)
        .map((f) => f.path),
    },
    {
      name: "DatasetsSelectedFilesCount",
      selector: "#DatasetsSelectedFilesCount",
      expected: mockActionItems.datasets
        .flatMap((d) => d.files || [])
        .filter((f) => f.selected).length,
    },
    {
      name: "DatasetsSelectedFilesTotalSize",
      selector: "#DatasetsSelectedFilesTotalSize",
      expected: mockActionItems.datasets
        .flatMap((d) => d.files || [])
        .filter((f) => f.selected)
        .reduce((sum, f) => sum + Number(f.size || 0), 0),
    },
    {
      name: "DatasetsField",
      selector: "#DatasetsField[sourceFolder]",
      expected: mockActionItems.datasets.map((d) => d.sourceFolder),
    },
    {
      name: "Dataset[0]Field[size]",
      selector: "#Dataset[0]Field[size]",
      expected: mockActionItems.datasets[0].size,
    },
    {
      name: "#user.username",
      selector: "#user.username",
      expected: "abc",
    },
    {
      name: "#prop1",
      selector: "#prop1",
      expected: "prop1Value",
    },
    {
      name: "DatasetsPidEmptyFilesMap",
      selector: "#DatasetsPidEmptyFilesMap",
      expected: JSON.stringify(
        mockActionItems.datasets.map((d) => ({ pid: d.pid, files: [] })),
      ),
    },
    {
      name: "DatasetsField",
      selector: "#DatasetsField[sourceFolder]",
      expected: mockActionItems.datasets.map((d) => d.sourceFolder),
    },
    {
      name: "DatasetsTotalSize",
      selector: "#DatasetsTotalSize",
      expected: 0,
    },
    {
      name: "DatasetsTotalPackedSize",
      selector: "#DatasetsTotalPackedSize",
      expected: 0,
    },
    {
      name: "apiBaseUrl",
      selector: "#apiBaseUrl",
      expected: mockAppConfigService.appConfig.lbBaseURL,
    },
  ];

  allKeywordMapSelectors.forEach((testCase) => {
    it(`1290: ${testCase.name} selector should resolve`, () => {
      const selectorConfig: ActionConfig = {
        ...mockActionsConfig[0],
        id: `selector-${testCase.name}`,
        type: "link",
        variables: {
          value: testCase.selector,
        },
      };
      createComponent(selectorConfig, {
        ...mockActionItems,
        user: { username: "abc" },
        prop1: "prop1Value",
      });
      expect(component.variables["value"]).toEqual(testCase.expected);
    });
  });

  describe("1300: xhr action failures with different HTTP status codes", () => {
    const xhrFailureStatusCodes = [400, 404, 500, 503];

    xhrFailureStatusCodes.forEach((status) => {
      it(`1300: xhr action should dispatch actionFailureAction with HTTP ${status} when the server responds with a non-ok status`, fakeAsync(() => {
        selectTestCase({
          test: "n/a",
          action: actionSelectorType.download_all,
          limit: maxSizeType.higher,
          actionItems: mockActionItemsDatafilesNofiles,
          result: true,
        } as TestCase);

        component.actionConfig = {
          ...mockActionsConfig[0],
          id: `xhr-status-${status}-test`,
          label: "XHR",
          type: "xhr",
          url: "https://example.org/action",
          method: "POST",
          payload: "#empty",
          variables: {},
          enabled: "true",
        };

        const componentStore = component["store"] as Store;
        const storeDispatchSpy = spyOn(componentStore, "dispatch");
        const actionFinishedSpy = jasmine.createSpy("actionFinished");
        component.actionFinished.subscribe(actionFinishedSpy);

        spyOn(window, "fetch").and.returnValue(
          Promise.resolve(new Response(null, { status, statusText: "Error" })),
        );

        component["typeXhr"]();
        flushMicrotasks();

        expect(storeDispatchSpy).toHaveBeenCalledWith(actionFailureAction());
        expect(actionFinishedSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ success: false }),
        );
      }));
    });
  });

  it("1305: xhr action should dispatch actionFailureAction when an ok response has a non-JSON body, instead of a false success", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-malformed-json-test",
      label: "XHR",
      type: "xhr",
      url: "https://example.org/action",
      method: "POST",
      payload: "#empty",
      variables: {},
      enabled: "true",
    };

    const componentStore = component["store"] as Store;
    const storeDispatchSpy = spyOn(componentStore, "dispatch");
    const actionFinishedSpy = jasmine.createSpy("actionFinished");
    component.actionFinished.subscribe(actionFinishedSpy);

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve("<html>not json</html>"),
      } as Response),
    );

    component["typeXhr"]();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(storeDispatchSpy).not.toHaveBeenCalledWith(actionSuccessAction());
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ type: actionFailureAction.type }),
    );
    expect(actionFinishedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ success: false }),
    );
    expect(actionFinishedSpy).not.toHaveBeenCalledWith(
      jasmine.objectContaining({ success: true }),
    );
  });

  it("1310: xhr action should dispatch actionSuccessAction and emit the response payload on success", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-success-test",
      label: "XHR",
      type: "xhr",
      url: "https://example.org/action",
      method: "POST",
      payload: "#empty",
      variables: {},
      enabled: "true",
    };

    const componentStore = component["store"] as Store;
    const storeDispatchSpy = spyOn(componentStore, "dispatch");
    const actionFinishedSpy = jasmine.createSpy("actionFinished");
    component.actionFinished.subscribe(actionFinishedSpy);

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ ok: true })),
      } as Response),
    );

    component["typeXhr"]();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(storeDispatchSpy).toHaveBeenCalledWith(actionSuccessAction());
    expect(actionFinishedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ success: true, result: { ok: true } }),
    );
  });

  it("1315: xhr action url should interpolate a #apiBaseUrl-derived variable from the API configuration", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-apiBaseUrl-test",
      label: "XHR",
      type: "xhr",
      url: "{{ @baseUrl }}/api/v3/jobs",
      method: "POST",
      payload: "#empty",
      variables: { baseUrl: "#apiBaseUrl" },
      enabled: "true",
    };

    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      } as Response),
    );

    component["resolveVariableContext"]();
    component["typeXhr"]();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const fetchSpy = window.fetch as jasmine.Spy;
    expect(fetchSpy.calls.mostRecent().args[0]).toBe(
      `${mockAppConfigService.appConfig.lbBaseURL}/api/v3/jobs`,
    );
  });

  it("1320: should detect longer cyclic dependency chains (a -> b -> c -> a)", () => {
    spyOn(console, "error");

    component.actionConfig = {
      variables: {
        a: "@b",
        b: "@c",
        c: "@a",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(console.error).toHaveBeenCalledWith(
      jasmine.stringContaining("Cyclic dependency detected in variable"),
    );
    // Each link in the cycle ends up interpolating a reference to a variable
    // that was never set (because the recursion that would set it was cut
    // short by the cycle check), so all three resolve to "" rather than
    // throwing or hanging.
    expect(component.variables["a"]).toBe("");
    expect(component.variables["b"]).toBe("");
    expect(component.variables["c"]).toBe("");
  });

  it("1330: should still resolve unrelated variables when a cyclic dependency is present", () => {
    spyOn(console, "error");

    component.actionConfig = {
      variables: {
        a: "@b",
        b: "@a",
        independent: "#Dataset0Pid",
      },
    } as unknown as ActionConfig;

    component["resolveVariableContext"]();

    expect(component.variables["independent"]).toBe(
      mockActionItems.datasets[0].pid,
    );
  });

  it("1340: DatasetsTotalSize and DatasetsTotalPackedSize should sum size/packedSize across datasets", () => {
    const actionItemsWithSizes: ActionItems = {
      datasets: [
        {
          ...mockActionItems.datasets[0],
          size: 100,
          packedSize: 10,
        } as ActionItemDataset,
        {
          ...mockActionItems.datasets[1],
          size: 250,
          packedSize: 25,
        } as ActionItemDataset,
      ],
    };

    const selectorConfig: ActionConfig = {
      ...mockActionsConfig[0],
      id: "selector-DatasetsTotalSize-nonzero",
      type: "link",
      variables: {
        totalSize: "#DatasetsTotalSize",
        totalPackedSize: "#DatasetsTotalPackedSize",
      },
    };

    createComponent(selectorConfig, actionItemsWithSizes);

    expect(component.variables["totalSize"]).toBe(350);
    expect(component.variables["totalPackedSize"]).toBe(35);
  });

  it("1350: concurrently triggered xhr actions should each fire their own independent request", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-concurrent-test",
      label: "XHR",
      type: "xhr",
      url: "https://example.org/action",
      method: "POST",
      payload: "#empty",
      variables: {},
      enabled: "true",
    };

    const componentStore = component["store"] as Store;
    const storeDispatchSpy = spyOn(componentStore, "dispatch");
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      } as Response),
    );

    component["typeXhr"]();
    component["typeXhr"]();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const fetchSpy = window.fetch as jasmine.Spy;
    expect(fetchSpy.calls.count()).toBe(2);
    expect(storeDispatchSpy.calls.count()).toBe(2);
    expect(storeDispatchSpy.calls.argsFor(0)[0]).toEqual(actionSuccessAction());
    expect(storeDispatchSpy.calls.argsFor(1)[0]).toEqual(actionSuccessAction());
  });

  it("1360: destroying the component while an xhr request is in flight does not cancel the request or throw", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      actionItems: mockActionItemsDatafilesNofiles,
      result: true,
    } as TestCase);

    component.actionConfig = {
      ...mockActionsConfig[0],
      id: "xhr-cancellation-test",
      label: "XHR",
      type: "xhr",
      url: "https://example.org/action",
      method: "POST",
      payload: "#empty",
      variables: {},
      enabled: "true",
    };

    const componentStore = component["store"] as Store;
    const storeDispatchSpy = spyOn(componentStore, "dispatch");
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      } as Response),
    );

    component["typeXhr"]();
    component.ngOnDestroy();

    // The component has no cancellation mechanism (no AbortController): the
    // in-flight request still resolves and dispatches after destroy, and
    // destroying the component does not throw while that happens.
    await expectAsync(
      new Promise((resolve) => setTimeout(resolve, 0)),
    ).toBeResolved();
    expect(storeDispatchSpy).toHaveBeenCalledWith(actionSuccessAction());
  });

  describe("1400: default batch actions (Archive/Retrieve) visibility", () => {
    const [archiveAction, retrieveAction] = buildDefaultBatchActions([]);

    it("1400: Archive should be visible in a batch-view/cart context, where currentArchViewMode is not provided", () => {
      createComponent(archiveAction, mockActionItems);
      expect(component.visible).toBeTrue();
    });

    it("1401: Retrieve should be visible in a batch-view/cart context, where currentArchViewMode is not provided", () => {
      createComponent(retrieveAction, mockActionItems);
      expect(component.visible).toBeTrue();
    });

    it("1402: on the dataset list page, Archive should be visible only in archivable mode", () => {
      createComponent(archiveAction, {
        ...mockActionItems,
        currentArchViewMode: "archivable",
      });
      expect(component.visible).toBeTrue();

      createComponent(archiveAction, {
        ...mockActionItems,
        currentArchViewMode: "retrievable",
      });
      expect(component.visible).toBeFalse();
    });

    it("1403: on the dataset list page, Retrieve should be visible only in retrievable mode", () => {
      createComponent(retrieveAction, {
        ...mockActionItems,
        currentArchViewMode: "retrievable",
      });
      expect(component.visible).toBeTrue();

      createComponent(retrieveAction, {
        ...mockActionItems,
        currentArchViewMode: "archivable",
      });
      expect(component.visible).toBeFalse();
    });
  });
});
