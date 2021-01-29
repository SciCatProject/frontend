/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface OrigDatablockInterface {
  "id"?: string;
  "size": number;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "datasetId"?: string;
  "dataFileList"?: Array<any>;
  "rawDatasetId"?: string;
  "derivedDatasetId"?: string;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  dataset?: Dataset;
  files?: any[];
}

export class OrigDatablock implements OrigDatablockInterface {
  "id": string;
  "size": number;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "datasetId": string;
  "dataFileList": Array<any>;
  "rawDatasetId": string;
  "derivedDatasetId": string;
  "createdAt": Date;
  "updatedAt": Date;
  dataset: Dataset;
  files: any[];
  constructor(data?: OrigDatablockInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OrigDatablock`.
   */
  public static getModelName() {
    return "OrigDatablock";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OrigDatablock for dynamic purposes.
  **/
  public static factory(data: OrigDatablockInterface): OrigDatablock{
    return new OrigDatablock(data);
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
      name: 'OrigDatablock',
      plural: 'OrigDatablocks',
      path: 'OrigDatablocks',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'string'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'Array&lt;any&gt;'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "datasetId": {
          name: 'datasetId',
          type: 'string'
        },
        "dataFileList": {
          name: 'dataFileList',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "rawDatasetId": {
          name: 'rawDatasetId',
          type: 'string'
        },
        "derivedDatasetId": {
          name: 'derivedDatasetId',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        dataset: {
          name: 'dataset',
          type: 'Dataset',
          model: 'Dataset',
          relationType: 'belongsTo',
                  keyFrom: 'datasetId',
          keyTo: 'pid'
        },
        files: {
          name: 'files',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'dataFileList',
          keyTo: 'path'
        },
      }
    }
  }
}
