/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface OrigDatablockInterface {
  "id"?: any;
  "size": any;
  "dataFileList": any;
  "ownerGroup": any;
  "accessGroups"?: any;
  "datasetId"?: any;
  "rawDatasetId"?: any;
  "derivedDatasetId"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
  dataset?: Dataset;
}

export class OrigDatablock implements OrigDatablockInterface {
  "id": any;
  "size": any;
  "dataFileList": any;
  "ownerGroup": any;
  "accessGroups": any;
  "datasetId": any;
  "rawDatasetId": any;
  "derivedDatasetId": any;
  "createdAt": any;
  "updatedAt": any;
  dataset: Dataset;
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
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "size": {
          name: 'size',
          type: 'any'
        },
        "dataFileList": {
          name: 'dataFileList',
          type: 'any'
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'any'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'any'
        },
        "datasetId": {
          name: 'datasetId',
          type: 'any'
        },
        "rawDatasetId": {
          name: 'rawDatasetId',
          type: 'any'
        },
        "derivedDatasetId": {
          name: 'derivedDatasetId',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'any'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'any'
        },
      },
      relations: {
        dataset: {
          name: 'dataset',
          type: 'Dataset',
          model: 'Dataset'
        },
      }
    }
  }
}
