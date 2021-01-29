/* tslint:disable */
import {
  Dataset,
  Sample,
  Proposal
} from '../index';

declare var Object: any;
export interface AttachmentInterface {
  "id"?: string;
  "thumbnail": string;
  "caption"?: string;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "datasetId"?: string;
  "sampleId"?: string;
  "proposalId"?: string;
  "rawDatasetId"?: string;
  "derivedDatasetId"?: string;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  dataset?: Dataset;
  sample?: Sample;
  proposal?: Proposal;
}

export class Attachment implements AttachmentInterface {
  "id": string;
  "thumbnail": string;
  "caption": string;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "datasetId": string;
  "sampleId": string;
  "proposalId": string;
  "rawDatasetId": string;
  "derivedDatasetId": string;
  "createdAt": Date;
  "updatedAt": Date;
  dataset: Dataset;
  sample: Sample;
  proposal: Proposal;
  constructor(data?: AttachmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Attachment`.
   */
  public static getModelName() {
    return "Attachment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Attachment for dynamic purposes.
  **/
  public static factory(data: AttachmentInterface): Attachment{
    return new Attachment(data);
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
      name: 'Attachment',
      plural: 'Attachments',
      path: 'Attachments',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "thumbnail": {
          name: 'thumbnail',
          type: 'string',
          default: 'retrieve'
        },
        "caption": {
          name: 'caption',
          type: 'string',
          default: ''
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
        "sampleId": {
          name: 'sampleId',
          type: 'string'
        },
        "proposalId": {
          name: 'proposalId',
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
        sample: {
          name: 'sample',
          type: 'Sample',
          model: 'Sample',
          relationType: 'belongsTo',
                  keyFrom: 'sampleId',
          keyTo: 'sampleId'
        },
        proposal: {
          name: 'proposal',
          type: 'Proposal',
          model: 'Proposal',
          relationType: 'belongsTo',
                  keyFrom: 'proposalId',
          keyTo: 'proposalId'
        },
      }
    }
  }
}
