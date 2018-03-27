/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface DatasetAttachmentInterface {
  "thumbnail": string;
  "creationTime"?: Date;
  "id"?: any;
  "datasetId"?: string;
  "rawDatasetId"?: string;
  "derivedDatasetId"?: string;
  dataset?: Dataset;
}

export class DatasetAttachment implements DatasetAttachmentInterface {
  "thumbnail": string;
  "creationTime": Date;
  "id": any;
  "datasetId": string;
  "rawDatasetId": string;
  "derivedDatasetId": string;
  dataset: Dataset;
  constructor(data?: DatasetAttachmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DatasetAttachment`.
   */
  public static getModelName() {
    return "DatasetAttachment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DatasetAttachment for dynamic purposes.
  **/
  public static factory(data: DatasetAttachmentInterface): DatasetAttachment{
    return new DatasetAttachment(data);
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
      name: 'DatasetAttachment',
      plural: 'DatasetAttachments',
      path: 'DatasetAttachments',
      idName: 'id',
      properties: {
        "thumbnail": {
          name: 'thumbnail',
          type: 'string',
          default: 'retrieve'
        },
        "creationTime": {
          name: 'creationTime',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'any'
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
