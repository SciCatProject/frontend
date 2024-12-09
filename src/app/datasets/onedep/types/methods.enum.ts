export enum EmType {
    Helical = "helical",
    SingleParticle = "single-particle",
    SubtomogramAveraging = "subtomogram-averaging",
    Tomogram = "tomogram",
    ElectronCristallography = "electron-cristallography"
};

export enum EmFile {
    MainMap = 'vo-map',
    HalfMap1 = 'half-map1',
    HalfMap2 = 'half-map2',
    MaskMap = 'mask-map',
    AddMap = 'add-map',
    Coordinates = 'co-cif',
    Image = 'img-emdb',
    FSC = 'fsc-xml',
    LayerLines = "layer-lines",
    StructureFactors = "xs-cif",
    MTZ = "xs-mtz",
};


export interface DepositionFiles {
    emName: EmFile;
    id?: number, 
    nameFE: string;
    type: string,
    fileName: string,
    file: File,
    contour?: number,
    details?: string,
    required: boolean,
    explanation?: string, 
}

interface EmMethod {
    value: EmType;
    viewValue: string;
    files:  DepositionFiles[];
}

export const DepositionImage: DepositionFiles ={
    emName: EmFile.Image,
    nameFE: 'Public Image',
    type: "img-emdb",
    fileName: "",
    file: null,
    details: "",
    required: false,
    explanation: "Image of the map (500 x 500 pixels in .jpg, .png, etc. format)",
}
export const DepositionMainMap:DepositionFiles ={
    emName: EmFile.MainMap,
    nameFE: 'Main Map',
    type: "vo-map",
    fileName: "",
    file: null,
    contour: 0.0,
    details: "",
    required: false,
    explanation: "Primary map (.mrc or .ccp4 format, may use gzip or bzip2 compression) along with recommended contour level", 
}
export const DepositionHalfMap1:DepositionFiles ={
    emName: EmFile.HalfMap1,
    nameFE: 'Half Map (1)',
    type: "half-map",
    fileName: "",
    file: null,
    contour: 0.0,
    details: "",
    required: false,
    explanation:"Half maps (as used for FSC calculation; two maps must be uploaded)",
}
export const DepositionHalfMap2:DepositionFiles ={
    emName: EmFile.HalfMap2,
    nameFE: 'Half Map (2)',
    type: "half-map",
    fileName: "",
    file: null,
    contour: 0.0,
    details: "",
    required: false,
    explanation:"Half maps (as used for FSC calculation; two maps must be uploaded)",
}
export const DepositionMaskMap:DepositionFiles ={
    emName: EmFile.MaskMap,
    nameFE: 'Mask Map',
    type: "mask-map",
    fileName: "",
    file: null,
    contour: 0.0,
    details: "",
    required: false,
    explanation:"Primary/raw map mask, segmentation/focused refinement mask and half-map mask",
}
export const DepositionAddMap:DepositionFiles ={
    emName: EmFile.AddMap,
    id:0,
    nameFE: 'Additional Map',
    type: "add-map",
    fileName: "",
    file: null,
    contour: 0.0,
    details: "",
    required: false,
    explanation:"Difference maps, maps showing alternative conformations and/or compositions, maps with differential processing (e.g. filtering, sharpening and masking)", 
}
export const DepositionFSC:DepositionFiles ={
    emName: EmFile.FSC,
    nameFE: 'FSC-XML',
    type: "fsc-xml",
    fileName: "",
    file: null,
    details: "",
    required: false,
    explanation: "Half-map FSC, Map-model FSC, Cross-validation FSCs", 
}
export const DepositionLayerLines:DepositionFiles ={
    emName: EmFile.LayerLines,
    nameFE: 'Other: Layer Lines Data ',
    type: "layer-lines",
    fileName: "",
    file: null,
    details: "",
    required: false,
}
export const DepositionCoordinates: DepositionFiles = {
    emName: EmFile.Coordinates,
    nameFE: 'Coordinates',
    type: "co-cif",
    fileName: "",
    file: null,
    details: "",
    required: false,
    explanation: "mmCIF or PDB format",
}
export const DepositionStructureFactors: DepositionFiles = {
    emName: EmFile.StructureFactors,
    nameFE: 'Structure Factors',
    type: "xs-cif",
    fileName: "",
    file: null,
    details: "",
    required: false,
}
export const DepositionMTZ: DepositionFiles = {
    emName: EmFile.MTZ,
    nameFE: 'MTZ',
    type: "xs-mtz",
    fileName: "",
    file: null,
    details: "",
    required: false,
}


export const MethodsList: EmMethod[] = [
    {
        value: EmType.Helical,
        viewValue: 'Helical',
        files: [
            DepositionImage, 
            DepositionCoordinates, 
            DepositionMainMap, 
            DepositionMaskMap, 
            DepositionHalfMap1, 
            DepositionHalfMap2, 
            DepositionFSC,
            DepositionLayerLines,
            DepositionAddMap, 
        ],
    },
    {
        value: EmType.SingleParticle,
        viewValue: 'Single Particle',
        files: [
            DepositionImage, 
            DepositionCoordinates, 
            DepositionMainMap, 
            DepositionMaskMap, 
            DepositionHalfMap1, 
            DepositionHalfMap2, 
            DepositionFSC,
            DepositionLayerLines,
            DepositionAddMap, 
        ],
    },
    {
        value: EmType.SubtomogramAveraging,
        viewValue: 'Subtomogram Averaging',
        files:[
            DepositionImage, 
            DepositionCoordinates, 
            DepositionMainMap, 
            DepositionMaskMap, 
            DepositionHalfMap1, 
            DepositionHalfMap2, 
            DepositionFSC,
            DepositionLayerLines,
            DepositionAddMap, 
        ],
    },
    {
        value: EmType.Tomogram,
        viewValue: 'Tomogram',
        files: [
            DepositionImage, 
            DepositionMainMap, 
            DepositionMaskMap, 
            DepositionFSC,
            DepositionLayerLines,
            DepositionAddMap, 
        ],
    },
    {
        value: EmType.ElectronCristallography,
        viewValue: 'Electron Crystallography',
        files: [
            DepositionImage, 
            DepositionCoordinates, 
            DepositionMainMap, 
            DepositionMaskMap, 
            DepositionHalfMap1, 
            DepositionHalfMap2, 
            DepositionStructureFactors,
            DepositionMTZ,
            DepositionFSC,
            DepositionLayerLines,
            DepositionAddMap, 
        ],
    },
];