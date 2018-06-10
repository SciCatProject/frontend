/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface DatasetLifecycleInterface {
  "id": string;
  "isOnDisk"?: boolean;
  "isOnTape"?: boolean;
  "archivable"?: boolean;
  "retrievable"?: boolean;
  "archiveStatusMessage"?: string;
  "retrieveStatusMessage"?: string;
  "lastUpdateMessage"?: string;
  "archiveReturnMessage"?: string;
  "dateOfLastMessage"?: Date;
  "dateOfDiskPurging"?: Date;
  "archiveRetentionTime"?: Date;
  "isExported"?: boolean;
  "exportedTo"?: string;
  "dateOfPublishing"?: Date;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "datasetId"?: string;
  "rawDatasetId"?: string;
  "derivedDatasetId"?: string;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  dataset?: Dataset;
}

export class DatasetLifecycle implements DatasetLifecycleInterface {
  "id": string;
  "isOnDisk": boolean;
  "isOnTape": boolean;
  "archivable": boolean;
  "retrievable": boolean;
  "archiveStatusMessage": string;
  "retrieveStatusMessage": string;
  "lastUpdateMessage": string;
  "archiveReturnMessage": string;
  "dateOfLastMessage": Date;
  "dateOfDiskPurging": Date;
  "archiveRetentionTime": Date;
  "isExported": boolean;
  "exportedTo": string;
  "dateOfPublishing": Date;
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
  constructor(data?: DatasetLifecycleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DatasetLifecycle`.
   */
  public static getModelName() {
    return "DatasetLifecycle";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DatasetLifecycle for dynamic purposes.
  **/
  public static factory(data: DatasetLifecycleInterface): DatasetLifecycle{
    return new DatasetLifecycle(data);
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
      name: 'DatasetLifecycle',
      plural: 'DatasetLifecycles',
      path: 'DatasetLifecycles',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "isOnDisk": {
          name: 'isOnDisk',
          type: 'boolean'
        },
        "isOnTape": {
          name: 'isOnTape',
          type: 'boolean'
        },
        "archivable": {
          name: 'archivable',
          type: 'boolean'
        },
        "retrievable": {
          name: 'retrievable',
          type: 'boolean'
        },
        "archiveStatusMessage": {
          name: 'archiveStatusMessage',
          type: 'string'
        },
        "retrieveStatusMessage": {
          name: 'retrieveStatusMessage',
          type: 'string'
        },
        "lastUpdateMessage": {
          name: 'lastUpdateMessage',
          type: 'string'
        },
        "archiveReturnMessage": {
          name: 'archiveReturnMessage',
          type: 'string'
        },
        "dateOfLastMessage": {
          name: 'dateOfLastMessage',
          type: 'Date'
        },
        "dateOfDiskPurging": {
          name: 'dateOfDiskPurging',
          type: 'Date'
        },
        "archiveRetentionTime": {
          name: 'archiveRetentionTime',
          type: 'Date'
        },
        "isExported": {
          name: 'isExported',
          type: 'boolean'
        },
        "exportedTo": {
          name: 'exportedTo',
          type: 'string'
        },
        "dateOfPublishing": {
          name: 'dateOfPublishing',
          type: 'Date'
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
      }
    }
  }
}
