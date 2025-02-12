export enum EmType {
  Helical = "helical",
  SingleParticle = "single-particle",
  SubtomogramAveraging = "subtomogram-averaging",
  Tomogram = "tomogram",
  ElectronCristallography = "electron-cristallography",
}

export enum EmFile {
  MainMap = "vo-map",
  HalfMap1 = "half-map1",
  HalfMap2 = "half-map2",
  MaskMap = "mask-map",
  AddMap = "add-map",
  Coordinates = "co-cif",
  Image = "img-emdb",
  FSC = "fsc-xml",
  LayerLines = "layer-lines",
  StructureFactors = "xs-cif",
  MTZ = "xs-mtz",
}

export function isMap(emFile: EmFile): boolean {
  return (
    emFile === EmFile.MainMap ||
    emFile === EmFile.HalfMap1 ||
    emFile === EmFile.HalfMap2 ||
    emFile === EmFile.MaskMap ||
    emFile === EmFile.AddMap
  );
}

export interface OneDepUserInfo {
  email: string;
  orcidIds: string[];
  country: string;
  method: string;
  jwtToken: string;
  password?: string;
}

export interface OneDepCreate {
  depID: string;
}
export interface DepositionFile {
  emName: EmFile;
  id?: number;
  nameFE: string;
  type: string;
  fileName: string;
  file: File;
  contour?: number;
  details?: string;
  required: boolean;
  fileFormat?: string[];
  prioritySort?: number; // additional fsc and xml may have no value, sort will be exequted based on id
  explanation?: string;
}

interface EmMethod {
  value: EmType;
  viewValue: string;
  files: DepositionFile[];
}

export const createMethodsList = (): EmMethod[] => {
  const depositionImage: DepositionFile = {
    emName: EmFile.Image,
    nameFE: "Public Image",
    type: "img-emdb",
    fileName: "",
    file: null,
    required: false,
    fileFormat: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    prioritySort: 0,
    explanation:
      "Image of the map (500 x 500 pixels in .jpg, .png, etc. format)",
  };
  const depositionMainMap: DepositionFile = {
    emName: EmFile.MainMap,
    nameFE: "Main Map",
    type: "vo-map",
    fileName: "",
    file: null,
    contour: null,
    details: "",
    required: false,
    fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
    prioritySort: 2,
    explanation:
      "Primary map (.mrc or .ccp4 format, may use gzip or bzip2 compression) along with recommended contour level",
  };
  const depositionHalfMap1: DepositionFile = {
    emName: EmFile.HalfMap1,
    nameFE: "Half Map (1)",
    type: "half-map",
    fileName: "",
    file: null,
    contour: null,
    details: "",
    required: false,
    fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
    prioritySort: 4,
    explanation:
      "Half maps (as used for FSC calculation; two maps must be uploaded)",
  };
  const depositionHalfMap2: DepositionFile = {
    emName: EmFile.HalfMap2,
    nameFE: "Half Map (2)",
    type: "half-map",
    fileName: "",
    file: null,
    contour: null,
    details: "",
    required: false,
    fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
    prioritySort: 5,
    explanation:
      "Half maps (as used for FSC calculation; two maps must be uploaded)",
  };
  const depositionMaskMap: DepositionFile = {
    emName: EmFile.MaskMap,
    nameFE: "Mask Map",
    type: "mask-map",
    fileName: "",
    file: null,
    contour: null,
    details: "",
    required: false,
    fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
    prioritySort: 3,
    explanation:
      "Primary/raw map mask, segmentation/focused refinement mask and half-map mask",
  };
  const depositionAddMap: DepositionFile = {
    emName: EmFile.AddMap,
    id: 0,
    nameFE: "Additional Map",
    type: "add-map",
    fileName: "",
    file: null,
    contour: null,
    details: "",
    required: false,
    fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
    prioritySort: 10,
    explanation:
      "Difference maps, maps showing alternative conformations and/or compositions, maps with differential processing (e.g. filtering, sharpening and masking)",
  };
  const depositionFSC: DepositionFile = {
    emName: EmFile.FSC,
    id: 0,
    nameFE: "FSC-XML",
    type: "fsc-xml",
    fileName: "",
    file: null,
    fileFormat: [".xml"],
    required: false,
    prioritySort: 7,
    explanation: "Half-map FSC, Map-model FSC, Cross-validation FSCs",
  };
  const depositionLayerLines: DepositionFile = {
    emName: EmFile.LayerLines,
    nameFE: "Other: Layer Lines Data ",
    type: "layer-lines",
    fileName: "",
    file: null,
    required: false,
    prioritySort: 9,
  };
  const depositionCoordinates: DepositionFile = {
    emName: EmFile.Coordinates,
    nameFE: "Coordinates",
    type: "co-cif",
    fileName: "",
    file: null,
    required: false,
    fileFormat: [
      ".cif",
      ".pdb",
      ".ent",
      ".brk",
      ".cif.gz",
      ".pdb.gz",
      ".ent.gz",
      ".brk.gz",
    ],
    prioritySort: 1,
    explanation: "mmCIF or PDB format",
  };
  const depositionStructureFactors: DepositionFile = {
    emName: EmFile.StructureFactors,
    nameFE: "Structure Factors",
    type: "xs-cif",
    fileName: "",
    file: null,
    required: false,
    prioritySort: 8,
    fileFormat: [".cif", ".mtz", ".cif.gz", ".mtz.gz"],
  };
  const depositionMTZ: DepositionFile = {
    emName: EmFile.MTZ,
    nameFE: "MTZ",
    type: "xs-mtz",
    fileName: "",
    file: null,
    required: false,
    prioritySort: 6,
  };
  return [
    {
      value: EmType.Helical,
      viewValue: "Helical",
      files: [
        depositionImage,
        depositionCoordinates,
        depositionMainMap,
        depositionHalfMap1,
        depositionHalfMap2,
        depositionMaskMap,
        depositionFSC,
        depositionLayerLines,
        depositionAddMap,
      ],
    },
    {
      value: EmType.SingleParticle,
      viewValue: "Single Particle",
      files: [
        depositionImage,
        depositionCoordinates,
        depositionMainMap,
        depositionHalfMap1,
        depositionHalfMap2,
        depositionMaskMap,
        depositionFSC,
        depositionLayerLines,
        depositionAddMap,
      ],
    },
    {
      value: EmType.SubtomogramAveraging,
      viewValue: "Subtomogram Averaging",
      files: [
        depositionImage,
        depositionCoordinates,
        depositionMainMap,
        depositionHalfMap1,
        depositionHalfMap2,
        depositionMaskMap,
        depositionFSC,
        depositionLayerLines,
        depositionAddMap,
      ],
    },
    {
      value: EmType.Tomogram,
      viewValue: "Tomogram",
      files: [
        depositionImage,
        depositionMainMap,
        depositionMaskMap,
        depositionFSC,
        depositionLayerLines,
        depositionAddMap,
      ],
    },
    {
      value: EmType.ElectronCristallography,
      viewValue: "Electron Crystallography",
      files: [
        depositionImage,
        depositionCoordinates,
        depositionMainMap,
        depositionHalfMap1,
        depositionHalfMap2,
        depositionMaskMap,
        depositionStructureFactors,
        depositionMTZ,
        depositionFSC,
        depositionLayerLines,
        depositionAddMap,
      ],
    },
  ];
};
