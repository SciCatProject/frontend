import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConfigurableActionComponent } from "./configurable-action.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
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
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
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
import { Subject } from "rxjs";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { selectProfile } from "state-management/selectors/user.selectors";
import { ActionItems } from "./configurable-action.interfaces";

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
  }

  const usersControllerGetUserJWTV3 = () => ({
    subscribe: () => ({
      jwt: "9a2322a8-4a7d-11ef-a0f5-d7c40fcf1693",
    }),
  });

  // const getCurrentToken = () => ({
  //   id: "4ac45f3e-4d79-11ef-856c-6339dab93bee",
  // });

  class MockUserProfile {
    userProfile$ = new Subject<any>();
  }

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
      providers: [provideMockStore()],
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
          //{ provide: Store, useClass: MockStore }
        ],
      },
    });
    TestBed.compileComponents();

    store = TestBed.inject(MockStore);
  }));

  function createComponent(componentActionConfig, componentsActionItems) {
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

    component.perform_action();

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

    component.perform_action();

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

    component.perform_action();

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

    component.perform_action();

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

    component.perform_action();

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

    component.perform_action();

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

    component.perform_action();

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
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
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
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
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
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
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
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
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

    component.perform_action();

    const spy = window.fetch as jasmine.Spy;
    expect(spy.calls.any()).toBeTrue();
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

    component.perform_action();

    const spy = window.fetch as jasmine.Spy;

    expect(spy.calls.any()).toBeTrue();
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
    component.perform_action();

    const current_action = mockActionsConfig.filter(
      (a) => a.id == actionSelectorType.link,
    )[0];
    expect(window.open).toHaveBeenCalledWith(
      current_action.url,
      current_action.target,
    );
  });
});
