/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface DatasetLifecycleInterface {
  "id": any;
  "isOnDisk"?: any;
  "isOnTape"?: any;
  "archiveStatusMessage"?: any;
  "retrieveStatusMessage"?: any;
  "dateOfLastMessage"?: any;
  "dateOfDiskPurging"?: any;
  "archiveRetentionTime"?: any;
  "isExported"?: any;
  "exportedTo"?: any;
  "dateOfPublishing"?: any;
  "datasetId"?: any;
  "rawDatasetId"?: any;
  "derivedDatasetId"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
  dataset?: Dataset;
}

export class DatasetLifecycle implements DatasetLifecycleInterface {
  "id": any;
  "isOnDisk": any;
  "isOnTape": any;
  "archiveStatusMessage": any;
  "retrieveStatusMessage": any;
  "dateOfLastMessage": any;
  "dateOfDiskPurging": any;
  "archiveRetentionTime": any;
  "isExported": any;
  "exportedTo": any;
  "dateOfPublishing": any;
  "datasetId": any;
  "rawDatasetId": any;
  "derivedDatasetId": any;
  "createdAt": any;
  "updatedAt": any;
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
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "isOnDisk": {
          name: 'isOnDisk',
          type: 'any'
        },
        "isOnTape": {
          name: 'isOnTape',
          type: 'any'
        },
        "archiveStatusMessage": {
          name: 'archiveStatusMessage',
          type: 'any'
        },
        "retrieveStatusMessage": {
          name: 'retrieveStatusMessage',
          type: 'any'
        },
        "dateOfLastMessage": {
          name: 'dateOfLastMessage',
          type: 'any'
        },
        "dateOfDiskPurging": {
          name: 'dateOfDiskPurging',
          type: 'any'
        },
        "archiveRetentionTime": {
          name: 'archiveRetentionTime',
          type: 'any'
        },
        "isExported": {
          name: 'isExported',
          type: 'any'
        },
        "exportedTo": {
          name: 'exportedTo',
          type: 'any'
        },
        "dateOfPublishing": {
          name: 'dateOfPublishing',
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
