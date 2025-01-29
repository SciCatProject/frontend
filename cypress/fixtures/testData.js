export const testData = {
  derivedDataset: {
    investigator: "string",
    inputDatasets: [],
    usedSoftware: ["Cypress"],
    jobParameters: {},
    jobLogData: "string",
    scientificMetadata: {},
    owner: "string",
    ownerEmail: "string",
    orcidOfOwner: "string",
    contactEmail: "string",
    sourceFolder: "cypress/e2e/test",
    size: 100000,
    packedSize: 100000,
    creationTime: "2019-10-31T14:44:45.092Z",
    type: "derived",
    validationStatus: "string",
    keywords: ["test1", "test2", "test3"],
    description: "Cypress e2e test derived dataset",
    datasetName: "Cypress Dataset",
    classification: "AV=medium,CO=low",
    license: "string",
    version: "string",
    isPublished: false,
    ownerGroup: "ess",
    accessGroups: [],
    datasetlifecycle: {
      archivable: true,
      retrievable: false,
      publishable: true,
      dateOfDiskPurging: "2019-10-31T14:44:45.092Z",
      archiveRetentionTime: "2019-10-31T14:44:45.092Z",
      dateOfPublishing: "2019-10-31T14:44:45.092Z",
      isOnCentralDisk: true,
      archiveStatusMessage: "string",
      retrieveStatusMessage: "string",
      archiveReturnMessage: {},
      retrieveReturnMessage: {},
      exportedTo: "string",
      retrieveIntegrityCheck: true,
    },
  },
  policy: {
    manager: [],
    archiveEmailsToBeNotified: [],
    retrieveEmailsToBeNotified: [],
    tapeRedundancy: "low",
    autoArchive: true,
    autoArchiveDelay: 7,
    archiveEmailNotification: false,
    retrieveEmailNotification: true,
    embargoPeriod: 3,
    ownerGroup: "p10029",
  },
  proposal: {
    proposalId: "20170266",
    email: "proposer@uni.edu",
    title: "Cypress minimal test proposal",
    abstract: "Abstract of test proposal",
    ownerGroup: "20170251-group",
    accessGroups: [],
  },
  rawDataset: {
    principalInvestigator: "string",
    endTime: "2019-10-31T14:44:46.143Z",
    creationLocation: "Cypress",
    dataFormat: "Nexus Version x.y",
    scientificMetadata: {},
    owner: "string",
    ownerEmail: "string@test.com",
    orcidOfOwner: "string",
    contactEmail: "string@test.com",
    sourceFolder: "cypress/e2e/test",
    size: 1000000,
    packedSize: 1000000,
    creationTime: "2019-10-31T14:44:46.143Z",
    type: "raw",
    validationStatus: "string",
    keywords: ["test1", "test2"],
    description: "Cypress e2e test raw dataset",
    datasetName: "Cypress Dataset",
    classification: "AV=medium,CO=low",
    license: "string",
    version: "string",
    isPublished: false,
    ownerGroup: "ess",
    accessGroups: [],
    sampleId: "string",
    proposalId: "20170266",
    datasetlifecycle: {
      archivable: true,
      retrievable: false,
      publishable: true,
      dateOfDiskPurging: "2019-10-31T14:44:46.144Z",
      archiveRetentionTime: "2019-10-31T14:44:46.144Z",
      dateOfPublishing: "2019-10-31T14:44:46.144Z",
      isOnCentralDisk: true,
      archiveStatusMessage: "string",
      retrieveStatusMessage: "string",
      archiveReturnMessage: {},
      retrieveReturnMessage: {},
      exportedTo: "string",
      retrieveIntegrityCheck: true,
    },
  },
  origDataBlockSmall: {
    chkAlg: "Test-chkAlg",
    size: 528356137,
    dataFileList: [
      {
        path: "N1039-1.tif",
        size: 528356037,
        time: "2017-07-24T13:56:30.000Z",
        uid: "egon.meiera@psi.ch",
        gid: "p16738",
        perm: "-rw-rw-r--",
      },
      {
        path: "this_unique_file.txt",
        size: 100,
        time: "2017-07-24T13:56:25.000Z",
        uid: "egon.meiera@psi.ch",
        gid: "p16738+1",
        perm: "-rw-rw-r--",
      },
    ],
  },
  origDataBlockLarge: {
    chkAlg: "Test-chkAlg",
    size: 5528356137,
    dataFileList: [
      {
        path: "N1039-1.tif",
        size: 5528356037,
        time: "2017-07-24T13:56:30.000Z",
        uid: "egon.meiera@psi.ch",
        gid: "p16738",
        perm: "-rw-rw-r--",
      },
      {
        path: "this_unique_file.txt",
        size: 100,
        time: "2017-07-24T13:56:25.000Z",
        uid: "egon.meiera@psi.ch",
        gid: "p16738+1",
        perm: "-rw-rw-r--",
      },
    ],
  },
};

export const testConfig = {
  dynamicDetialViewComponent: {
    datasetDetailViewLabelOption: {
      currentLabelSet: "test",
      labelSets: {
        test: {
          datasetName: "Test String",
          description: "Test Copy",
          ownerEmail: "Test Linky",
          keywords: "Test Tag",
          "Section Label Regular": "Test Section Regular",
          "Section Label Attachments": "Test Section Attachments",
          "Section Label Metadata JSON": "Test Section Metadata JSON",
          "Section Label Metadata TABLE": "Test Section Metadata TABLE",
          "Section Label Metadata TREE": "Test Section Metadata TREE",
          "Section Label Dataset JsonView": "Test Section Dataset JsonView",
        },
      },
    },
    datasetDetailComponent: {
      enableCustomizedComponent: true,
      customization: [
        {
          type: "attachments",
          label: "Section Label Attachments",
          order: 1,
          options: {
            limit: 2,
            size: "small",
          },
        },
        {
          type: "regular",
          label: "Section Label Regular",
          order: 0,
          fields: [
            {
              element: "text",
              source: "datasetName",
              order: 0,
            },
            {
              element: "copy",
              source: "description",
              order: 1,
            },
            {
              element: "linky",
              source: "ownerEmail",
              order: 2,
            },
            {
              element: "tag",
              source: "keywords",
              order: 3,
            },
          ],
        },
        {
          type: "scientificMetadata",
          label: "Section Label Metadata JSON",
          viewMode: "json",
          order: 2,
        },
        {
          type: "scientificMetadata",
          label: "Section Label Metadata TABLE",
          viewMode: "table",
          order: 3,
        },
        {
          type: "scientificMetadata",
          label: "Section Label Metadata TREE",
          viewMode: "tree",
          order: 4,
        },
        {
          type: "datasetJsonView",
          label: "Section Label Dataset JsonView",
          order: 5,
        },
      ],
    },
  },
  defaultDetailViewComponent: {
    datasetDetailViewLabelOption: {
      currentLabelSet: "test",
      labelSets: {
        test: {
          "Dataset Name": "Test Dataset name",
          Description: "Test Description",
          "Creation time": "Test Creation time",
          Pid: "Test Pid",
          Type: "Test Type",
          "General Information": "Test General Information",
        },
      },
    },
    datasetDetailComponent: {
      enableCustomizedComponent: false,
      customization: [],
    },
  },
};
