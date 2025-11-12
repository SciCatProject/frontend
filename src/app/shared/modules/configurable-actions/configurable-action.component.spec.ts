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
import { StoreModule } from "@ngrx/store";
import {
  MockHtmlElement,
  MockMatDialogRef,
  MockUserApi,
} from "shared/MockStubs";
import { ActionConfig, ActionItems } from "./configurable-action.interfaces";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { AuthService } from "shared/services/auth/auth.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AppConfigService } from "app-config.service";
import { boolean } from "mathjs";

describe("1000: ConfigurableActionComponent", () => {
  let component: ConfigurableActionComponent;
  let fixture: ComponentFixture<ConfigurableActionComponent>;
  let htmlForm: HTMLFormElement;
  let htmlInput: HTMLInputElement;

  const actionsConfig: ActionConfig[] = [
    {
      id: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      description:
        "This action let users download all files using the zip service",
      order: 1,
      label: "Download All",
      files: "all",
      mat_icon: "download",
      type: "form",
      url: "https://zip.scicatproject.org/download/all",
      target: "_blank",
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0FilesPath",
        totalSize: "#Dataset0FilesTotalSize",
        folder: "#Dataset0SourceFolder",
      },
      enabled: "#MaxDownloadableSize(@totalSize)",
      inputs: {
        "item[]": "@pid",
        "directory[]": "@folder",
        "files[]": "@files",
      },
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      description:
        "This action let users download selected files using the zip service",
      order: 2,
      label: "Download Selected",
      files: "selected",
      mat_icon: "download",
      type: "form",
      url: "https://zip.scicatproject.org/download/selected",
      target: "_blank",
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0SelectedFilesPath",
        selected: "#Dataset0SelectedFilesCount",
        totalSize: "#Dataset0SelectedFilesTotalSize",
        folder: "#Dataset0SourceFolder",
      },
      inputs: {
        auth_token: "#tokenBearer",
        jwt: "#jwt",
        "item[]": "@pid",
        "directory[]": "@folder",
        "files[]": "@files",
      },
      enabled: "#Length(@files) && #MaxDownloadableSize(@totalSize)",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      description:
        "This action let users download jupyter notebook properly populated with dataset pid and all files using an instance of sciwyrm",
      order: 3,
      label: "Notebook All (Form)",
      files: "all",
      icon: "/assets/icons/jupyter_logo.png",
      type: "form",
      url: "https://www.scicat.info/notebook/all",
      target: "_blank",
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0FilesPath",
        totalSize: "#Dataset0FilesTotalSize",
        folder: "#Dataset0SourceFolder",
      },
      enabled: "",
      inputs: {
        auth_token: "#token",
        jwt: "#jwt",
        "item[]": "@pid",
        "directory[]": "@folder",
        "files[]": "@files",
      },
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      order: 4,
      label: "Notebook Selected (Form)",
      files: "selected",
      icon: "/assets/icons/jupyter_logo.png",
      type: "form",
      url: "https://www.scicat.info/notebook/selected",
      target: "_blank",
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0SelectedFilesPath",
        selected: "#Dataset0SelectedFiles",
        totalSize: "#Dataset0SelectedFilesTotalSize",
        folder: "#Dataset0SourceFolder",
      },
      inputs: {
        auth_token: "#token",
        jwt: "#jwt",
        "item[]": "@pid",
        "directory[]": "@folder",
        "files[]": "@files",
      },
      enabled: "@selected",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "0cd5b592-0b1a-11f0-a42c-23e177127ee7",
      description:
        "This action let users download jupyter notebook properly populated with dataset pid and all files using an instance of sciwyrm",
      order: 5,
      label: "Notebook All (Download JSON)",
      files: "all",
      type: "json-download",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://www.sciwyrm.info/notebook",
      target: "_blank",
      authorization: ["#datasetAccess", "#datasetPublic"],
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0FilesPath",
        folder: "#Dataset0SourceFolder",
      },
      payload:
        '{"template_id":"c975455e-ede3-11ef-94fb-138c9cd51fc0","parameters":{"dataset":"{{ @pid }}","directory":"{{ @folder }}","files": {{ @files[] }},"jwt":"{{ #jwt }}","scicat_url":"https://staging.scicat.ess.url","file_server_url":"sftserver2.esss.dk","file_server_port":"22"}}',
      filename: "{{ #uuid }}.ipynb",
    },
    {
      id: "a414773a-a526-11f0-a7f2-ff1026e5dba9",
      description:
        "This action let users download jupyter notebook properly populated with dataset pid and selected files using an instance of sciwyrm",
      order: 6,
      label: "Notebook Selected (Download JSON)",
      files: "selected",
      type: "json-to-download",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://www.sciwyrm.info/notebook",
      target: "_blank",
      enabled: "@selected > 0",
      authorization: ["#datasetAccess", "#datasetPublic"],
      variables: {
        pid: "#Dataset0Pid",
        files: "#Dataset0SelectedFilesPath",
        selected: "#Dataset0SelectedFiles",
        folder: "#Dataset0SourceFolder",
      },
      payload:
        '{"template_id":"c975455e-ede3-11ef-94fb-138c9cd51fc0","parameters":{"dataset":"{{ pid }}","directory":"{{ sourceFolder }}","files": {{ files }},"jwt":"{{ jwt }}","scicat_url":"https://staging.scicat.ess.url","file_server_url":"sftserver2.esss.dk","file_server_port":"22"}}',
      filename: "{{ uuid }}.ipynb",
    },
    {
      id: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      description:
        "This action let users make a call an arbitrary URL and store the reply in the store",
      order: 7,
      label: "Publish",
      type: "xhr",
      mat_icon: "action",
      method: "PATCH",
      url: "http://localhost:3000/dataset/{{ @pid }}/",
      target: "_blank",
      enabled: "#datasetOwner && @isPublished",
      authorization: ["#datasetOwner && !@isPublished"],
      variables: {
        pid: "@Dataset0Pid",
        isPublished: "#Dataset[0]Field[isPublished]",
      },
      payload: '{"isPublished":"true"}',
      headers: {
        "Content-Type": "application/json",
        Authorization: "#tokenBearer",
      },
    },
    {
      id: "94a1d694-a526-11f0-947b-038d53cd837a",
      description:
        "This action let users make a call an arbitrary URL and store the reply in the store",
      order: 8,
      label: "Unpublish",
      type: "xhr",
      mat_icon: "action",
      method: "PATCH",
      url: "http://localhost:3000/dataset/{{ @pid }}/",
      target: "_blank",
      enabled: "#datasetOwner && !@isPublished",
      authorization: ["#datasetOwner && @isPublished"],
      variables: {
        pid: "#Dataset0Pid",
        isPublished: "#Dataset[0]Field[isPublished]",
      },
      payload: '{"isPublished":"false"}',
      headers: {
        "Content-Type": "application/json",
        Authorization: "#tokenBearer",
      },
    },
    {
      id: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      description: "This action let users jump to another URL entirely",
      order: 9,
      label: "ESS",
      files: "all",
      type: "link",
      mat_icon: "action",
      url: "https://ess.eu",
      target: "_blank",
      authorization: ["true"],
    },
  ];

  const mockActionItems: ActionItems = {
    datasets: [
      {
        pid: "40f3beec-bee2-11f0-8c47-4b68a24470e0",
        sourceFolder: "/source/folder/1",
        ownerGroup: "group1",
        isPublished: false,
        files: [
          {
            path: "/file/1",
            size: 1000,
            selected: true,
            time: "2019-09-06T13:11:37.102Z",
          },
          {
            path: "/file/2",
            size: 2000,
            selected: false,
            time: "2019-09-06T13:11:37.102Z",
          },
          {
            path: "/file/3",
            size: 3000,
            selected: true,
            time: "2019-09-06T13:11:37.102Z",
          },
        ],
      },
      {
        pid: "48217db2-bee2-11f0-ace4-b7a1618f0eba",
        sourceFolder: "/source/folder/2",
        ownerGroup: "group2",
        files: [
          {
            path: "/file/4",
            size: 4000,
            selected: true,
            time: "2019-09-06T13:11:37.102Z",
          },
        ],
      },
    ],
  };

  const lowerMaxFileSizeLimit = 5000;
  const higherMaxFileSizeLimit = 20000;
  enum maxSizeType {
    lower = "lower",
    higher = "higher",
  }

  enum selectedFilesType {
    none = "none",
    file1 = "file1",
    file2 = "file2",
    all = "all",
  }

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

  const getCurrentToken = () => ({
    id: "4ac45f3e-4d79-11ef-856c-6339dab93bee",
  });

  beforeAll(() => {
    htmlForm = document.createElement("form");
    (htmlForm as HTMLFormElement).submit = () => {};
    htmlInput = document.createElement("input");
  });

  let mockConfigService: any;
  beforeEach(waitForAsync(() => {
    mockConfigService = {
      appConfig: {
        maxDirectDownloadSize: 0,
      },
      getConfig() {
        return this.appConfig;
      },
    };
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
            useValue: { getToken: getCurrentToken },
          },
          { provide: AppConfigService, useValue: mockConfigService },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableActionComponent);
    component = fixture.componentInstance;
    component.actionConfig = actionsConfig[0];
    component.actionItems = mockActionItems;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /*
   * Unit tests for enabled/disabled cases performed
   * ------------------------
   * -------- Action                         , uuid
   * Test # , Max Size           , Selected           , Is Published      , Status
   * --------------------------------------------------------------------------------
   * -------- Download All                   , eed8efec-4354-11ef-a3b5-d75573a5d37f
   * 0010   , low max file size  , no selected files  , n/a               , disabled
   * 0020   , low max file size  , file 1 selected    , n/a               , disabled
   * 0030   , low max file size  , file 2 selected    , n/a               , disabled
   * 0040   , low max file size  , all files selected , n/a               , disabled
   * 0050   , high max file size , no selected files  , n/a               , enabled
   * 0060   , high max file size , file 1 selected    , n/a               , enabled
   * 0070   , high max file size , file 2 selected    , n/a               , enabled
   * 0080   , high max file size , all files selected , n/a               , enabled
   *
   * -------- Download Selected              , 3072fafc-4363-11ef-b9f9-ebf568222d26
   * 0110   , low max file size  , no selected files  , n/a               , disabled
   * 0120   , low max file size  , file 1 selected    , n/a               , enabled
   * 0130   , low max file size  , file 2 selected    , n/a               , enabled
   * 0140   , low max file size  , all files selected , n/a               , disabled
   * 0150   , high max file size , no selected files  , n/a               , disabled
   * 0160   , high max file size , file 1 selected    , n/a               , enabled
   * 0170   , high max file size , file 2 selected    , n/a               , enabled
   * 0180   , high max file size , all files selected , n/a               , enabled
   *
   * -------- Notebook All (Form)            , 4f974f0e-4364-11ef-9c63-03d19f813f4e
   * -------- Notebook All (JSON)            , a414773a-a526-11f0-a7f2-ff1026e5dba9
   * 0210   , low max file size  , no selected files  , n/a               , enabled
   * 0220   , low max file size  , file 1 selected    , n/a               , enabled
   * 0230   , low max file size  , file 2 selected    , n/a               , enabled
   * 0240   , low max file size  , all files selected , n/a               , enabled
   * 0250   , high max file size , no selected files  , n/a               , enabled
   * 0260   , high max file size , file 1 selected    , n/a               , enabled
   * 0270   , high max file size , file 2 selected    , n/a               , enabled
   * 0280   , high max file size , all files selected , n/a               , enabled
   *
   * -------- Notebook Selected (Form)       , fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd
   * -------- Notebook Selected (JSON)       , a414773a-a526-11f0-a7f2-ff1026e5dba9
   * 0310   , low max file size  , no selected files  , n/a               , disabled
   * 0320   , low max file size  , file 1 selected    , n/a               , enabled
   * 0330   , low max file size  , file 2 selected    , n/a               , enabled
   * 0340   , low max file size  , all files selected , n/a               , enabled
   * 0350   , high max file size , no selected files  , n/a               , disabled
   * 0360   , high max file size , file 1 selected    , n/a               , enabled
   * 0370   , high max file size , file 2 selected    , n/a               , enabled
   * 0380   , high max file size , all files selected , n/a               , enabled
   *
   * -------- Publish                        , 9c6a11b6-a526-11f0-8795-6f025b320cc3
   * 0410   , n/a                , n/a                , false             , enabled
   * 0420   , n/a                , n/a                , true              , disabled
   *
   * -------- Unpublish                      , 94a1d694-a526-11f0-947b-038d53cd837a
   * 0510   , n/a                , n/a                , false             , disabled
   * 0520   , n/a                , n/a                , true              , enabled
   *
   * -------- ESS (link)                     , c3bcbd40-a526-11f0-915a-93eeff0860ab
   * 0610   , n/a                , n/a                , n/a               , enabled
   *
   */

  interface TestCase {
    test: string;
    action: string;
    limit: maxSizeType;
    selection: selectedFilesType;
    published?: boolean;
    result: boolean;
  }

  const testEnabledDisabledCases: TestCase[] = [
    // -------- Download All
    {
      test: "0010: Download All should be disabled with lowest max size limit and no files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      selection: selectedFilesType.none,
      result: false,
    },
    {
      test: "0020: Download All should be disabled with lowest max size limit and file 1 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file1,
      result: false,
    },
    {
      test: "0030: Download All should be disabled with lowest max size limit and file 2 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file2,
      result: false,
    },
    {
      test: "0040: Download All should be disabled with lowest max size limit and all files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.lower,
      selection: selectedFilesType.all,
      result: false,
    },
    {
      test: "0050: Download All should be enabled with highest max size limit and no files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: true,
    },
    {
      test: "0060: Download All should be enabled with highest max size limit and file 1 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0070: Download All should be enabled with highest max size limit and file 2 selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0080: Download All should be enabled with highest max size limit and all files selected",
      action: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: true,
    },
    //
    // -------- Download Selected
    {
      test: "0110: Download Selected should be disabled with lowest max size and no files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      selection: selectedFilesType.none,
      result: false,
    },
    {
      test: "0120: Download Selected should be enabled with lowest max size and file 1 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0130: Download Selected should be enabled with lowest max size and file 2 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0140: Download Selected should be disabled with lowest max size and all files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.lower,
      selection: selectedFilesType.all,
      result: false,
    },
    {
      test: "0150: Download Selected should be disabled with highest max size and no files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    },
    {
      test: "0160: Download Selected should be enabled with highest max size and file 1 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0170: Download Selected should be enabled with highest max size and file 2 selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0180: Download Selected should be enabled with highest max size and all files selected",
      action: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: true,
    },
    //
    // -------- Notebook All (Form and JSON)
    {
      test: "0210: Notebook All should be enabled with lowest max size and no files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      selection: selectedFilesType.none,
      result: true,
    },
    {
      test: "0220: Notebook All should be enabled with lowest max size and file 1 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0230: Notebook All should be enabled with lowest max size and file 2 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0240: Notebook All should be enabled with lowest max size and all files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.lower,
      selection: selectedFilesType.all,
      result: true,
    },
    {
      test: "0250: Notebook All should be enabled with highest max size and no files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: true,
    },
    {
      test: "0260: Notebook All should be enabled with highest max size and file 1 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0270: Notebook All should be enabled with highest max size and file 2 selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0280: Notebook All should be enabled with highest max size and all files selected",
      action: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: true,
    },
    //
    // -------- Notebook Selected (Form and JSON)
    {
      test: "0310: Notebook Selected should be disabled with lowest max size and no files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      selection: selectedFilesType.none,
      result: false,
    },
    {
      test: "0320: Notebook Selected should be enabled with lowest max size and file 1 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0330: Notebook Selected should be enabled with lowest max size and file 2 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0340: Notebook Selected should be enabled with lowest max size and all files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.lower,
      selection: selectedFilesType.all,
      result: true,
    },
    {
      test: "0350: Notebook Selected should be disabled with highest max size and no files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    },
    {
      test: "0360: Notebook Selected should be enabled with highest max size and file 1 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file1,
      result: true,
    },
    {
      test: "0370: Notebook Selected should be enabled with highest max size and file 2 selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
      result: true,
    },
    {
      test: "0380: Notebook Selected should be enabled with highest max size and all files selected",
      action: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: true,
    },
    //
    // -------- Publish
    {
      test: "0410: Publish should be enabled when not already published",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      selection: undefined,
      published: false,
      result: true,
    },
    {
      test: "0420: Publish should be disabled when already published",
      action: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
      limit: undefined,
      selection: undefined,
      published: true,
      result: false,
    },

    // -------- Unpublish
    {
      test: "0510: Unpublish should be disabled when not already published",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      selection: undefined,
      published: false,
      result: false,
    },
    {
      test: "0520: Unpublish should be enabled when already published",
      action: "94a1d694-a526-11f0-947b-038d53cd837a",
      limit: undefined,
      selection: undefined,
      published: true,
      result: true,
    },

    // -------- ESS (link)
    {
      test: "0610: ESS link should always be enabled",
      action: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
      limit: undefined,
      selection: undefined,
      published: undefined,
      result: true,
    },
  ];

  function selectTestCase(testCase: TestCase) {
    component.actionConfig = actionsConfig.filter(
      (a) => a.id == testCase.action,
    )[0];
    switch (testCase.limit) {
      case maxSizeType.higher:
        mockConfigService.appConfig.maxDirectDownloadSize =
          higherMaxFileSizeLimit;
        break;
      case maxSizeType.lower:
      default:
        mockConfigService.appConfig.maxDirectDownloadSize =
          lowerMaxFileSizeLimit;
        break;
    }
    switch (testCase.selection) {
      case selectedFilesType.none:
        mockActionItems.datasets[0].files.forEach((file) => {
          file.selected = false;
        });
        break;
      case selectedFilesType.file1:
        mockActionItems.datasets[0].files.forEach((file) => {
          file.selected = file.path.includes("file/1") ? true : false;
        });
        break;
      case selectedFilesType.file2:
        mockActionItems.datasets[0].files.forEach((file) => {
          file.selected = file.path.includes("file/2") ? true : false;
        });
        break;
      case selectedFilesType.all:
        mockActionItems.datasets[0].files.forEach((file) => {
          file.selected = true;
        });
        break;
    }
    fixture.detectChanges();
  }

  testEnabledDisabledCases.forEach((testCase) => {
    it(testCase.test, () => {
      selectTestCase(testCase);

      expect(component.disabled).toEqual(testCase.result);
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
      selection: selectedFilesType.none,
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
    expect(formFiles.length).toEqual(mockActionItems.datasets[0].files?.length);
  });

  it("1010: Form submission should have correct url when Download All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    } as TestCase);
    const action_url = actionsConfig
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
      selection: selectedFilesType.none,
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
      selection: selectedFilesType.file1,
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
    const selectedFilePath = mockActionItems.datasets[0].files.filter(
      (f) => f.selected,
    )[0].path;
    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("1040: Form submission should have all files when Notebook All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      selection: selectedFilesType.file1,
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

  it("1050: Form submission should have correct url when Notebook All is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    } as TestCase);
    const action_url = actionsConfig
      .filter((a) => a.id == actionSelectorType.download_all)[0]
      .url.replace(/\/$/, "");
    spyOn(document, "createElement").and.callFake(createFakeElement);

    component.perform_action();

    expect(component.form.action.replace(/\/$/, "")).toEqual(action_url);
  });

  it("1060: Form submission should have correct file when Notebook Selected is clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
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
    const selectedFilePath = mockActionItems.datasets[0].files.filter(
      (f) => f.selected,
    )[0].path;

    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("1070: Download All action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_all,
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig.filter((a) => a.id == actionSelectorType.download_all)[0]
        .label,
    );
  });

  it("1080: Download Selected action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.download_selected,
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig.filter(
        (a) => a.id == actionSelectorType.download_selected,
      )[0].label,
    );
  });

  it("1090: Notebook All (Form) action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_form,
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_all_form,
      )[0].label,
    );
  });

  it("1100: Notebook Selected (Form) action button should contain the correct label", () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_selected_form,
      limit: maxSizeType.higher,
      selection: selectedFilesType.all,
      result: false,
    } as TestCase);

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_selected_form,
      )[0].label,
    );
  });

  it("1110: Notebook All (Json) action should fetch with correct payload when clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_all_json,
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
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

    const [url, opts] = (window.fetch as jasmine.Spy).calls.mostRecent().args;
    expect(url).toBe(
      actionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_selected_form,
      )[0].url,
    );
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");

    //{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ @pid }}\",\"directory\":\"{{ @folder }}\",\"files\": {{ @files[] }},\"jwt\":\"{{ #jwt }}\",\"scicat_url\":\"https://staging.scicat.ess.url\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}
    const body = JSON.parse(opts.body);
    expect(body.test_id).toBe("test-id");
    expect(body.parameters.jwt).toBe("TEST_JWT");
    expect(body.parameters.dataset).toBe(mockActionItems.datasets[0].pid);
    expect(body.parameters.directory).toBe(
      mockActionItems.datasets[0].sourceFolder,
    );
    expect(body.parameters.files.length).toBe(
      mockActionItems.datasets[0].files.length,
    );
  });

  it("1120: Notebook Selected (Json) action should fetch with correct payload when clicked", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.notebook_selected_json,
      limit: maxSizeType.higher,
      selection: selectedFilesType.file2,
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

    const [url, opts] = (window.fetch as jasmine.Spy).calls.mostRecent().args;
    expect(url).toBe(
      actionsConfig.filter(
        (a) => a.id == actionSelectorType.notebook_selected_json,
      )[0].url,
    );
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");

    //{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ @pid }}\",\"directory\":\"{{ @folder }}\",\"files\": {{ @files[] }},\"jwt\":\"{{ #jwt }}\",\"scicat_url\":\"https://staging.scicat.ess.url\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}
    const body = JSON.parse(opts.body);
    expect(body.test_id).toBe("test-id");
    expect(body.parameters.jwt).toBe("TEST_JWT");
    expect(body.parameters.dataset).toBe(mockActionItems.datasets[0].pid);
    expect(body.parameters.directory).toBe(
      mockActionItems.datasets[0].sourceFolder,
    );
    expect(body.parameters.files.length).toBe(1);
    expect(body.parameters.files[0]).toBe(
      mockActionItems.datasets[0].files[1].path,
    );
  });

  it("1130: link action should opena new tab and reirect to the specified url", async () => {
    selectTestCase({
      test: "n/a",
      action: actionSelectorType.link,
      limit: maxSizeType.higher,
      selection: selectedFilesType.none,
      result: false,
    } as TestCase);
    spyOn(window, "open");
    component.perform_action();

    const current_action = actionsConfig.filter(
      (a) => a.id == actionSelectorType.link,
    )[0];
    expect(window.open).toHaveBeenCalledWith(
      current_action.url,
      current_action.target,
    );
  });
});
