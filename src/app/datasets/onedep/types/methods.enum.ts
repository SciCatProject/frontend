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
};

export const EmFiles: { [f in EmFile]: OneDepFile } = {
    [EmFile.MainMap]: {
        name: "",
        type: "vo-map",
        file: null,
        contour: 0.0,
        details: "",
    },
    [EmFile.HalfMap1]: {
        name: "",
        type: "half-map",
        file: null,
        contour: 0.0,
        details: "",
    },
    [EmFile.HalfMap2]: {
        name: "",
        type: "half-map",
        file: null,
        contour: 0.0,
        details: "",
    },
    [EmFile.MaskMap]: {
        name: "",
        type: "mask-map",
        file: null,
        contour: 0.0,
        details: "",
    },
    [EmFile.AddMap]: {
        name: "",
        type: "add-map",
        file: null,
        contour: 0.0,
        details: "",
    },
    [EmFile.Coordinates]: {
        name: "",
        type: "co-cif",
        file: null,
        details: "",
    },
    [EmFile.Image]: {
        name: "",
        type: "img-emdb",
        file: null,
        details: "",
    },
    [EmFile.FSC]: {
        name: "",
        type: "fsc-xml",
        file: null,
        details: "",
    },
};

interface EmMethod {
    value: EmType;
    viewValue: string;
}


export const MethodsList: EmMethod[] = [
    { value: EmType.Helical, viewValue: 'Helical' },
    { value: EmType.SingleParticle, viewValue: 'Single Particle' },
    { value: EmType.SubtomogramAveraging, viewValue: 'Subtomogram Averaging' },
    { value: EmType.Tomogram, viewValue: 'Tomogram' },
    { value: EmType.ElectronCristallography, viewValue: 'Electron Crystallography' },
];


export interface OneDepExperiment {
    type: string;
    subtype?: string;
}

export const Experiments: { [e in EmType]: OneDepExperiment } = {
    [EmType.Helical]: { type: "em", subtype: "helical" },
    [EmType.SingleParticle]: { type: "em", subtype: "single" },
    [EmType.SubtomogramAveraging]: { type: "em", subtype: "subtomogram" },
    [EmType.Tomogram]: { type: "em", subtype: "tomography" },
    [EmType.ElectronCristallography]: { type: "ec" }
};
export interface OneDepFile {
    name: string,
    type: string,
    file: File,
    contour?: number,
    details?: string,
}

