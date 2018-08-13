/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface PublishedDataInterface {
  "doi": string;
  "affiliation": string;
  "creator": string;
  "publisher": string;
  "publicationYear": number;
  "title": string;
  "url": string;
  "pidArray": Array<any>;
  "author": Array<any>;
  "doiRegisteredSuccessfullyTime"?: Date;
  "id"?: any;
  "datasetId"?: string;
  dataset?: Dataset;
}

export class PublishedData implements PublishedDataInterface {
  "doi": string;
  "affiliation": string;
  "creator": string;
  "publisher": string;
  "publicationYear": number;
  "title": string;
  "url": string;
  "pidArray": Array<any>;
  "author": Array<any>;
  "doiRegisteredSuccessfullyTime": Date;
  "id": any;
  "datasetId": string;
  dataset: Dataset;
  constructor(data?: PublishedDataInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PublishedData`.
   */
  public static getModelName() {
    return "PublishedData";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PublishedData for dynamic purposes.
  **/
  public static factory(data: PublishedDataInterface): PublishedData{
    return new PublishedData(data);
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
      name: 'PublishedData',
      plural: 'PublishedData',
      path: 'PublishedData',
      idName: 'id',
      properties: {
        "doi": {
          name: 'doi',
          type: 'string'
        },
        "affiliation": {
          name: 'affiliation',
          type: 'string'
        },
        "creator": {
          name: 'creator',
          type: 'string'
        },
        "publisher": {
          name: 'publisher',
          type: 'string'
        },
        "publicationYear": {
          name: 'publicationYear',
          type: 'number',
          default: 2018
        },
        "title": {
          name: 'title',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "pidArray": {
          name: 'pidArray',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "author": {
          name: 'author',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "doiRegisteredSuccessfullyTime": {
          name: 'doiRegisteredSuccessfullyTime',
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
