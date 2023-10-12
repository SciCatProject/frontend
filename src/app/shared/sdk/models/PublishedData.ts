/* eslint-disable */
import { Dataset } from "../index";

declare var Object: any;
export interface PublishedDataInterface {
  doi?: string;
  affiliation?: string;
  creator: Array<any>;
  publisher: string;
  publicationYear: number;
  title: string;
  url?: string;
  abstract: string;
  dataDescription: string;
  resourceType: string;
  numberOfFiles?: number;
  sizeOfArchive?: number;
  pidArray: Array<any>;
  authors?: Array<any>;
  registeredTime?: Date;
  status?: string;
  scicatUser?: string;
  thumbnail?: string;
  relatedPublications?: Array<any>;
  downloadLink?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  datasets?: Dataset[];
}

export class PublishedData implements PublishedDataInterface {
  "doi": string;
  "affiliation": string;
  "creator": Array<any>;
  "publisher": string;
  "publicationYear": number;
  "title": string;
  "url": string;
  "abstract": string;
  "dataDescription": string;
  "resourceType": string;
  "numberOfFiles": number;
  "sizeOfArchive": number;
  "pidArray": Array<any>;
  "authors": Array<any>;
  "registeredTime": Date;
  "status": string;
  "scicatUser": string;
  "thumbnail": string;
  "relatedPublications": Array<any>;
  "downloadLink": string;
  "createdBy": string;
  "updatedBy": string;
  "createdAt": Date;
  "updatedAt": Date;
  datasets: Dataset[];
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
  public static factory(data: PublishedDataInterface): PublishedData {
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
      name: "PublishedData",
      plural: "PublishedData",
      path: "PublishedData",
      idName: "doi",
      properties: {
        doi: {
          name: "doi",
          type: "string",
        },
        affiliation: {
          name: "affiliation",
          type: "string",
        },
        creator: {
          name: "creator",
          type: "Array&lt;any&gt;",
        },
        publisher: {
          name: "publisher",
          type: "string",
        },
        publicationYear: {
          name: "publicationYear",
          type: "number",
        },
        title: {
          name: "title",
          type: "string",
        },
        url: {
          name: "url",
          type: "string",
        },
        abstract: {
          name: "abstract",
          type: "string",
        },
        dataDescription: {
          name: "dataDescription",
          type: "string",
        },
        resourceType: {
          name: "resourceType",
          type: "string",
        },
        numberOfFiles: {
          name: "numberOfFiles",
          type: "number",
        },
        sizeOfArchive: {
          name: "sizeOfArchive",
          type: "number",
        },
        pidArray: {
          name: "pidArray",
          type: "Array&lt;any&gt;",
        },
        authors: {
          name: "authors",
          type: "Array&lt;any&gt;",
        },
        registeredTime: {
          name: "registeredTime",
          type: "Date",
        },
        status: {
          name: "status",
          type: "string",
        },
        scicatUser: {
          name: "scicatUser",
          type: "string",
        },
        thumbnail: {
          name: "thumbnail",
          type: "string",
        },
        relatedPublications: {
          name: "relatedPublications",
          type: "Array&lt;any&gt;",
        },
        downloadLink: {
          name: "downloadLink",
          type: "string",
        },
        createdBy: {
          name: "createdBy",
          type: "string",
        },
        updatedBy: {
          name: "updatedBy",
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
        datasets: {
          name: "datasets",
          type: "Dataset[]",
          model: "Dataset",
          relationType: "hasMany",
          keyFrom: "doi",
          keyTo: "publishedDataId",
        },
      },
    };
  }
}
