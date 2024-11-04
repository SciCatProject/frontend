export enum EmType {
    Helical = "helical",
    SingleParticle = "single-particle",
    SubtomogramAveraging = "subtomogram-averaging",
    Tomogram = "tomogram",
    ElectronCristallography = "electron-cristallography"
};
interface EmMethod {
    value: EmType;
    viewValue:string;
}


export const MethodsList: EmMethod[] = [
    {value:EmType.Helical, viewValue: 'Helical'},
    {value:EmType.SingleParticle, viewValue:'Single Particle'},
    {value:EmType.SubtomogramAveraging,viewValue: 'Subtomogram Averaging'},
    {value:EmType.Tomogram, viewValue: 'Tomogram'},
    {value:EmType.ElectronCristallography, viewValue:'Electron Crystallography'},
  ];
interface OneDepExperiment {
    type: string;
    subtype?: string;
}

export const Experiment: { [e in EmType]: OneDepExperiment } = {
    [EmType.Helical]: { type: "em", subtype: "helical" },
    [EmType.SingleParticle]: { type: "em", subtype: "single" },
    [EmType.SubtomogramAveraging]: { type: "em", subtype: "subtomogram" },
    [EmType.Tomogram]: { type: "em", subtype: "tomography" },
    [EmType.ElectronCristallography]: { type: "ec" }
};
export interface OneDepFile{
	name:File,
	type:string,
	pathToFile:string,
	contour?: number, 
	details?: string,
}