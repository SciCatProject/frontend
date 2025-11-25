import {
  ActionConfig,
  ActionItemDataset,
  ActionItems,
} from "./configurable-action.interfaces";

export const mockAppConfigService = {
  appConfig: {
    maxDirectDownloadSize: 0,
    datafilesActionsEnabled: true,
  },
  getConfig() {
    return this.appConfig;
  },
};

export const mockActionsConfig: ActionConfig[] = [
  {
    id: "c3bcbd40-a526-11f0-915a-93eeff0860ab",
    description: "This action let users jump to another URL entirely",
    order: 9,
    label: "ESS",
    files: "all",
    type: "link",
    icon: "/assets/icons/button_ess.png",
    url: "https://ess.eu",
    target: "_blank",
    authorization: ["true"],
  },
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
    enabled: "#Length(@files) > 0",
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
    url: "https://www.sciwyrm.info/notebook/all",
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
    type: "json-download",
    icon: "/assets/icons/jupyter_logo.png",
    url: "https://www.sciwyrm.info/notebook/selected",
    target: "_blank",
    enabled: "#Length(@files) > 0",
    authorization: ["#datasetAccess", "#datasetPublic"],
    variables: {
      pid: "#Dataset0Pid",
      files: "#Dataset0SelectedFilesPath",
      folder: "#Dataset0SourceFolder",
    },
    payload:
      '{"template_id":"c975455e-ede3-11ef-94fb-138c9cd51fc0","parameters":{"dataset":"{{ @pid }}","directory":"{{ @folder }}","files": {{ @files[] }},"jwt":"{{ #jwt }}","scicat_url":"https://staging.scicat.ess.url","file_server_url":"sftserver2.esss.dk","file_server_port":"22"}}',
    filename: "{{ #uuid }}.ipynb",
  },
  {
    id: "9c6a11b6-a526-11f0-8795-6f025b320cc3",
    description:
      "This action let user, who owns the dataset, to make it public",
    order: 7,
    label: "Publish",
    type: "xhr",
    mat_icon: "lock_open",
    method: "PATCH",
    url: "http://localhost:3000/dataset/{{ @pid }}/",
    target: "_blank",
    enabled: "(#datasetOwner || #userIsAdmin) && !@isPublished",
    authorization: ["#datasetOwner && !@isPublished"],
    variables: {
      pid: "@Dataset0Pid",
      isPublished: "#Dataset[0]Field[isPublished]",
    },
    payload: "{\"isPublished\":\"true\"}",
    headers: {
      "Content-Type": "application/json",
      Authorization: "#tokenBearer",
    },
  },
  {
    id: "94a1d694-a526-11f0-947b-038d53cd837a",
    description:
      "This action let user, who owns the dataset, to make it private",
    order: 8,
    label: "Unpublish",
    type: "xhr",
    mat_icon: "lock",
    method: "PATCH",
    url: "http://localhost:3000/dataset/{{ @pid }}/",
    target: "_blank",
    enabled: "(#datasetOwner || #userIsAdmin) && @isPublished",
    authorization: ["#datasetOwner && @isPublished"],
    variables: {
      pid: "#Dataset0Pid",
      isPublished: "#Dataset[0]Field[isPublished]",
    },
    payload: "{\"isPublished\":\"false\"}",
    headers: {
      "Content-Type": "application/json",
      Authorization: "#tokenBearer",
    },
  },
];

export const mockActionItems: ActionItems = {
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
      isPublished: false,
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

/*
 * selection should be the number which the file path ends with. It can be expressed as string or integer
 */
function filesSelection(
  inDatasets: ActionItemDataset[],
  selection: number[],
): ActionItemDataset[] {
  const outDatasets: ActionItemDataset[] = structuredClone(inDatasets);
  //console.log("Files selection 1",JSON.stringify(outDatasets));
  outDatasets.forEach((d) => {
    d.files.forEach((f) => {
      f.selected = selection.includes(Number(f.path.slice(-1)));
    });
    return d;
  });
  //console.log("Files selection 2",JSON.stringify(outDatasets));
  return outDatasets;
}

export const mockActionItemsDatafilesNofiles = {
  datasets: filesSelection(mockActionItems.datasets.slice(0, 1), []),
};
export const mockActionItemsDatafilesFile1 = {
  datasets: filesSelection(mockActionItems.datasets.slice(0, 1), [1]),
};
export const mockActionItemsDatafilesFile2 = {
  datasets: filesSelection(mockActionItems.datasets.slice(0, 1), [2]),
};
export const mockActionItemsDatafilesAllfiles = {
  datasets: filesSelection(mockActionItems.datasets.slice(0, 1), [1, 2, 3]),
};

export const lowerMaxFileSizeLimit = 5000;
export const higherMaxFileSizeLimit = 20000;
export enum maxSizeType {
  lower = "lower",
  higher = "higher",
}

export enum selectedFilesType {
  none = "none",
  file1 = "file1",
  file2 = "file2",
  all = "all",
}

export const mockUserProfiles = [
  {},
  {
    accessGroups: ["group1", "group3"],
  },
  {
    accessGroups: ["group2", "group3"],
  },
];
