import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DatafilesActionComponent } from "./datafiles-action.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "shared/pipes/pipes.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { UserApi } from "shared/sdk";
import {
  MockHtmlElement,
  MockMatDialogRef,
  MockUserApi,
} from "shared/MockStubs";
import { ActionDataset } from "./datafiles-action.interfaces";

describe("DatafilesActionComponent", () => {
  let component: DatafilesActionComponent;
  let fixture: ComponentFixture<DatafilesActionComponent>;

  const actionsConfig = [
    {
      id: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      order: 4,
      label: "Download All",
      files: "all",
      mat_icon: "download",
      url: "https://download.scicat.org",
      target: "_blank",
      enabled: "#SizeLimit",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      order: 3,
      label: "Download Selected",
      files: "selected",
      mat_icon: "download",
      url: "https://download.scicat.org",
      target: "_blank",
      enabled: "#Selected && #SizeLimit",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      order: 2,
      label: "Notebook All",
      files: "all",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://notebook.scicat.org",
      target: "_blank",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      order: 1,
      label: "Notebook Selected",
      files: "selected",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://notebook.scicat.org",
      target: "_blank",
      enabled: "#Selected",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
  ];

  const actionDataset: ActionDataset = {
    pid: "1c7298da-4a7c-11ef-a2ce-2fdb7a34e7eb",
    sourceFolder: "/folder_1/folder_2/folder_3",
  };

  const actionFiles = [
    {
      path: "file1",
      size: 5000,
      time: "2019-09-06T13:11:37.102Z",
      chk: "string",
      uid: "string",
      gid: "string",
      perm: "string",
      selected: false,
      hash: "",
    },
    {
      path: "file2",
      size: 10000,
      time: "2019-09-06T13:11:37.102Z",
      chk: "string",
      uid: "string",
      gid: "string",
      perm: "string",
      selected: false,
      hash: "",
    },
  ];

  const lowerMaxFileSizeLimit = 9999;
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
    download_all = 0,
    download_selected = 1,
    notebook_all = 2,
    notebook_selected = 3,
  }

  const jwt = () => ({
    subscribe: (f: any) => ({
      jwt: "9a2322a8-4a7d-11ef-a0f5-d7c40fcf1693",
    }),
  });

  const getCurrentToken = () => ({
    id: "4ac45f3e-4d79-11ef-856c-6339dab93bee",
  });


  const browserWindowMock = {
    document: {
      write() {},
      body: {
        setAttribute() {},
      },
    },
  } as unknown as Window;

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
      declarations: [DatafilesActionComponent],
    });
    TestBed.overrideComponent(DatafilesActionComponent, {
      set: {
        providers: [
          { provide: UserApi, useClass: MockUserApi },
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: UserApi, useValue: { jwt, getCurrentToken } },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesActionComponent);
    component = fixture.componentInstance;
    component.files = structuredClone(actionFiles);
    component.actionConfig = actionsConfig[0];
    component.actionDataset = actionDataset;
    component.maxFileSize = lowerMaxFileSizeLimit;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /*
   * Test cases
   * ------------------------
   * Action            , Max Size           , Selected           , Status
   * ----------------------------------------------------------------
   * Download All      , low max file size  , no selected files  , disabled
   * Download All      , low max file size  , file 1 selected    , disabled
   * Download All      , low max file size  , file 2 selected    , disabled
   * Download All      , low max file size  , all files selected , disabled
   * Download All      , high max file size , no selected files  , enabled
   * Download All      , high max file size , file 1 selected    , enabled
   * Download All      , high max file size , file 2 selected    , enabled
   * Download All      , high max file size , all files selected , enabled
   *
   * Download Selected , low max file size  , no selected files  , disabled
   * Download Selected , low max file size  , file 1 selected    , enabled
   * Download Selected , low max file size  , file 2 selected    , disabled
   * Download Selected , low max file size  , all files selected , disabled
   * Download Selected , high max file size , no selected files  , disabled
   * Download Selected , high max file size , file 1 selected    , enabled
   * Download Selected , high max file size , file 2 selected    , enabled
   * Download Selected , high max file size , all files selected , enabled
   *
   * Notebook All      , low max file size  , no selected files  , enabled
   * Notebook All      , low max file size  , file 1 selected    , enabled
   * Notebook All      , low max file size  , file 2 selected    , enabled
   * Notebook All      , low max file size  , all files selected , enabled
   * Notebook All      , high max file size , no selected files  , enabled
   * Notebook All      , high max file size , file 1 selected    , enabled
   * Notebook All      , high max file size , file 2 selected    , enabled
   * Notebook All      , high max file size , all files selected , enabled
   *
   * Notebook Selected , low max file size  , no selected files  , disbaled
   * Notebook Selected , low max file size  , file 1 selected    , enabled
   * Notebook Selected , low max file size  , file 2 selected    , enabled
   * Notebook Selected , low max file size  , all files selected , enabled
   * Notebook Selected , high max file size , no selected files  , disabled
   * Notebook Selected , high max file size , file 1 selected    , enabled
   * Notebook Selected , high max file size , file 2 selected    , enabled
   * Notebook Selected , high max file size , all files selected , enabled
   */

  function selectTestCase(
    action: actionSelectorType,
    maxSize: maxSizeType,
    selectedFiles: selectedFilesType,
  ) {
    component.actionConfig = actionsConfig[action];
    switch (maxSize) {
      case maxSizeType.higher:
        component.maxFileSize = higherMaxFileSizeLimit;
        break;
      case maxSizeType.lower:
      default:
        component.maxFileSize = lowerMaxFileSizeLimit;
        break;
    }
    component.files = structuredClone(actionFiles);
    switch (selectedFiles) {
      case selectedFilesType.file1:
        component.files[0].selected = true;
        //component.files[1].selected = false;
        break;
      case selectedFilesType.file2:
        //component.files[0].selected = false;
        component.files[1].selected = true;
        break;
      case selectedFilesType.all:
        component.files[0].selected = true;
        component.files[1].selected = true;
        break;
      //case selectedFilesType.none:
      //default:
        //component.files[0].selected = false;
        //component.files[1].selected = false;
    }
    fixture.detectChanges();
  }

  it("Download All should be disabled with lowest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.lower,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download All should be disabled with lowest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.lower,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download All should be disabled with lowest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.lower,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download All should be disabled with lowest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.lower,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download All should be enabled with highest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download All should be enabled with highest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download All should be enabled with highest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download All should be enabled with highest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download Selected should be disabled with lowest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.lower,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download Selected should be enabled with lowest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.lower,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download Selected should be disabled with lowest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.lower,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download Selected should be disabled with lowest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.lower,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download Selected should be disabled with highest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Download Selected should be enabled with highest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download Selected should be enabled with highest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Download Selected should be enabled with highest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with lowest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.lower,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with lowest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.lower,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with lowest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.lower,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with lowest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.lower,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with highest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with highest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with highest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook All should be enabled with highest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be disabled with lowest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.lower,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Notebook Selected should be enabled with lowest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.lower,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be enabled with lowest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.lower,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be enabled with lowest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.lower,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be disabled with highest max size limit and no files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    expect(component.disabled).toEqual(true);
  });

  it("Notebook Selected should be enabled with highest max size limit and file 1 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFilesType.file1,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be enabled with highest max size limit and file 2 selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFilesType.file2,
    );

    expect(component.disabled).toEqual(false);
  });

  it("Notebook Selected should be enabled with highest max size limit and all files selected", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFilesType.all,
    );

    expect(component.disabled).toEqual(false);
  });

  function getFakeElement(elementType: string): HTMLElement {
    const element = new MockHtmlElement(elementType);
    return element as unknown as HTMLElement;
  }

  it("Form submission should have all files when Download All is clicked", async () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    // eslint-disable-next-line @typescript-eslint/quotes
    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(2);
  });

  it("Form submission should have correct url when Download All is clicked", async () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    expect(component.form.action).toEqual(
      actionsConfig[actionSelectorType.download_all].url,
    );
  });

  it("Form submission should have correct dataset when Download All is clicked", async () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    // eslint-disable-next-line @typescript-eslint/quotes
    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formDataset = formChildren.filter((item) =>
      item.name.includes("dataset"),
    );
    expect(formDataset.length).toEqual(1);
    const datasetPid = formDataset[0].value;
    expect(datasetPid).toEqual(actionDataset.pid);
  });

  it("Form submission should have correct file when Download Selected is clicked", async () => {
    const selectedFile = selectedFilesType.file1;
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFile,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    // eslint-disable-next-line @typescript-eslint/quotes
    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(1);
    const formFilePath = formFiles[0].value;
    const selectedFilePath = actionFiles.filter(
      (item) => item.path == selectedFile,
    )[0].path;
    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("Form submission should have all files when Notebook All is clicked", async () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    // eslint-disable-next-line @typescript-eslint/quotes
    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(2);
  });

  it("Form submission should have correct url when Notebook All is clicked", async () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    expect(component.form.action).toEqual(
      actionsConfig[actionSelectorType.notebook_all].url,
    );
  });

  it("Form submission should have correct file when Notebook Selected is clicked", async () => {
    const selectedFile = selectedFilesType.file2;
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFile,
    );
    spyOn(document, "createElement").and.callFake(getFakeElement);
    spyOn(window, "open").and.returnValue(browserWindowMock);

    component.perform_action();

    // eslint-disable-next-line @typescript-eslint/quotes
    const formChildren = Array.from(component.form.children).map(
      (item) => item as unknown as MockHtmlElement,
    );
    const formFiles = formChildren.filter((item) =>
      item.name.includes("files"),
    );
    expect(formFiles.length).toEqual(1);
    const formFilePath = formFiles[0].value;
    const selectedFilePath = actionFiles.filter(
      (item) => item.path == selectedFile,
    )[0].path;
    expect(formFilePath).toEqual(selectedFilePath);
  });

  it("Download All action button should contain the correct label", () => {
    selectTestCase(
      actionSelectorType.download_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig[actionSelectorType.download_all].label,
    );
  });

  it("Download Selected action button should contain the correct label", () => {
    selectTestCase(
      actionSelectorType.download_selected,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig[actionSelectorType.download_selected].label,
    );
  });

  it("Notebook All action button should contain the correct label", () => {
    selectTestCase(
      actionSelectorType.notebook_all,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig[actionSelectorType.notebook_all].label,
    );
  });

  it("Notebook Selected action button should contain the correct label", () => {
    selectTestCase(
      actionSelectorType.notebook_selected,
      maxSizeType.higher,
      selectedFilesType.none,
    );

    const componentElement: HTMLElement = fixture.nativeElement;
    const actionButton = componentElement.querySelector(".action-button");
    expect(actionButton.innerHTML).toContain(
      actionsConfig[actionSelectorType.notebook_selected].label,
    );
  });
});
