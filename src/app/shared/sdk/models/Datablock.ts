/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface DatablockInterface {
  "id"?: any;
  "archiveId": any;
  "size": any;
  "packedSize"?: any;
  "version": any;
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

export class Datablock implements DatablockInterface {
  "id": any;
  "archiveId": any;
  "size": any;
  "packedSize": any;
  "version": any;
  "dataFileList": any;
  "ownerGroup": any;
  "accessGroups": any;
  "datasetId": any;
  "rawDatasetId": any;
  "derivedDatasetId": any;
  "createdAt": any;
  "updatedAt": any;
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
  public static factory(data: DatablockInterface): Datablock{
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
      name: 'Datablock',
      plural: 'Datablocks',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "archiveId": {
          name: 'archiveId',
          type: 'any'
        },
        "size": {
          name: 'size',
          type: 'any'
        },
        "packedSize": {
          name: 'packedSize',
          type: 'any'
        },
        "version": {
          name: 'version',
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
