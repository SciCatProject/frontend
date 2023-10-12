/* eslint-disable */
import { Dataset } from "../index";

declare var Object: any;
export interface DatablockInterface {
  id?: string;
  archiveId: string;
  size: number;
  packedSize?: number;
  chkAlg?: string;
  version: string;
  dataFileList: Array<any>;
  ownerGroup: string;
  accessGroups?: Array<any>;
  createdBy?: string;
  updatedBy?: string;
  datasetId?: string;
  rawDatasetId?: string;
  derivedDatasetId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dataset?: Dataset;
}

export class Datablock implements DatablockInterface {
  "id": string;
  "archiveId": string;
  "size": number;
  "packedSize": number;
  "chkAlg": string;
  "version": string;
  "dataFileList": Array<any>;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "datasetId": string;
  "rawDatasetId": string;
  "derivedDatasetId": string;
  "createdAt": Date;
  "updatedAt": Date;
  dataset: Dataset;
  constructor(data?: DatablockInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Datablock`.
   */
  public static getModelName() {
    return "Datablock";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of Datablock for dynamic purposes.
   **/
  public static factory(data: DatablockInterface): Datablock {
    return new Datablock(data);
  }
  /**
   * @method getModelDefinition
   * @author Julien Ledun
   * @license MIT
   * This method returns an object that represents some of the model
   * definitions.
   **/
  public static getModelDefinition() {
    return {
      name: "Datablock",
      plural: "Datablocks",
      path: "Datablocks",
      idName: "id",
      properties: {
        id: {
          name: "id",
          type: "string",
        },
        archiveId: {
          name: "archiveId",
          type: "string",
        },
        size: {
          name: "size",
          type: "number",
        },
        packedSize: {
          name: "packedSize",
          type: "number",
        },
        chkAlg: {
          name: "chkAlg",
          type: "string",
        },
        version: {
          name: "version",
          type: "string",
        },
        dataFileList: {
          name: "dataFileList",
          type: "Array&lt;any&gt;",
        },
        ownerGroup: {
          name: "ownerGroup",
          type: "string",
        },
        accessGroups: {
          name: "accessGroups",
          type: "Array&lt;any&gt;",
        },
        createdBy: {
          name: "createdBy",
          type: "string",
        },
        updatedBy: {
          name: "updatedBy",
          type: "string",
        },
        datasetId: {
          name: "datasetId",
          type: "string",
        },
        rawDatasetId: {
          name: "rawDatasetId",
          type: "string",
        },
        derivedDatasetId: {
          name: "derivedDatasetId",
          type: "string",
        },
        createdAt: {
          name: "createdAt",
          type: "Date",
        },
        updatedAt: {
          name: "updatedAt",
          type: "Date",
        },
      },
      relations: {
        dataset: {
          name: "dataset",
          type: "Dataset",
          model: "Dataset",
          relationType: "belongsTo",
          keyFrom: "datasetId",
          keyTo: "pid",
        },
      },
    };
  }
}
