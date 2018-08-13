/* tslint:disable */

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
  "authors": Array<any>;
  "doiRegisteredSuccessfullyTime"?: Date;
  "id"?: any;
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
  "authors": Array<any>;
  "doiRegisteredSuccessfullyTime": Date;
  "id": any;
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
          type: 'number'
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
          type: 'Array&lt;any&gt;'
        },
        "authors": {
          name: 'authors',
          type: 'Array&lt;any&gt;'
        },
        "doiRegisteredSuccessfullyTime": {
          name: 'doiRegisteredSuccessfullyTime',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
