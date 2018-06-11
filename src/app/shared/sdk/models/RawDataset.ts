/* tslint:disable */
import {
  Sample,
  Proposal,
  DatasetLifecycle,
  Datablock,
  DatasetAttachment,
  OrigDatablock
} from '../index';

declare var Object: any;
export interface RawDatasetInterface {
  "principalInvestigator": string;
  "endTime"?: Date;
  "creationLocation": string;
  "dataFormat"?: string;
  "scientificMetadata"?: any;
  "pid"?: string;
  "owner": string;
  "ownerEmail"?: string;
  "orcidOfOwner"?: string;
  "contactEmail": string;
  "sourceFolder": string;
  "size"?: number;
  "packedSize"?: number;
  "creationTime": Date;
  "type": string;
  "validationStatus"?: string;
  "keywords"?: Array<any>;
  "description"?: string;
  "userTargetLocation"?: string;
  "classification"?: string;
  "license"?: string;
  "version"?: string;
  "doi"?: string;
  "isPublished"?: boolean;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  "sampleId"?: string;
  "proposalId"?: string;
  sample?: Sample;
  proposal?: Proposal;
  datasetlifecycle?: DatasetLifecycle;
  datablocks?: Datablock[];
  datasetattachments?: DatasetAttachment[];
  origdatablocks?: OrigDatablock[];
}

export class RawDataset implements RawDatasetInterface {
  "principalInvestigator": string;
  "endTime": Date;
  "creationLocation": string;
  "dataFormat": string;
  "scientificMetadata": any;
  "pid": string;
  "owner": string;
  "ownerEmail": string;
  "orcidOfOwner": string;
  "contactEmail": string;
  "sourceFolder": string;
  "size": number;
  "packedSize": number;
  "creationTime": Date;
  "type": string;
  "validationStatus": string;
  "keywords": Array<any>;
  "description": string;
  "userTargetLocation": string;
  "classification": string;
  "license": string;
  "version": string;
  "doi": string;
  "isPublished": boolean;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "createdAt": Date;
  "updatedAt": Date;
  "sampleId": string;
  "proposalId": string;
  sample: Sample;
  proposal: Proposal;
  datasetlifecycle: DatasetLifecycle;
  datablocks: Datablock[];
  datasetattachments: DatasetAttachment[];
  origdatablocks: OrigDatablock[];
  constructor(data?: RawDatasetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RawDataset`.
   */
  public static getModelName() {
    return "RawDataset";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RawDataset for dynamic purposes.
  **/
  public static factory(data: RawDatasetInterface): RawDataset{
    return new RawDataset(data);
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
      name: 'RawDataset',
      plural: 'RawDatasets',
      path: 'RawDatasets',
      idName: 'pid',
      properties: {
        "principalInvestigator": {
          name: 'principalInvestigator',
          type: 'string'
        },
        "endTime": {
          name: 'endTime',
          type: 'Date'
        },
        "creationLocation": {
          name: 'creationLocation',
          type: 'string'
        },
        "dataFormat": {
          name: 'dataFormat',
          type: 'string'
        },
        "scientificMetadata": {
          name: 'scientificMetadata',
          type: 'any'
        },
        "pid": {
          name: 'pid',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "ownerEmail": {
          name: 'ownerEmail',
          type: 'string'
        },
        "orcidOfOwner": {
          name: 'orcidOfOwner',
          type: 'string'
        },
        "contactEmail": {
          name: 'contactEmail',
          type: 'string'
        },
        "sourceFolder": {
          name: 'sourceFolder',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "packedSize": {
          name: 'packedSize',
          type: 'number'
        },
        "creationTime": {
          name: 'creationTime',
          type: 'Date'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "validationStatus": {
          name: 'validationStatus',
          type: 'string'
        },
        "keywords": {
          name: 'keywords',
          type: 'Array&lt;any&gt;'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "userTargetLocation": {
          name: 'userTargetLocation',
          type: 'string'
        },
        "classification": {
          name: 'classification',
          type: 'string'
        },
        "license": {
          name: 'license',
          type: 'string'
        },
        "version": {
          name: 'version',
          type: 'string'
        },
        "doi": {
          name: 'doi',
          type: 'string'
        },
        "isPublished": {
          name: 'isPublished',
          type: 'boolean'
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
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
        "sampleId": {
          name: 'sampleId',
          type: 'string'
        },
        "proposalId": {
          name: 'proposalId',
          type: 'string'
        },
      },
      relations: {
        sample: {
          name: 'sample',
          type: 'Sample',
          model: 'Sample',
          relationType: 'belongsTo',
                  keyFrom: 'sampleId',
          keyTo: 'samplelId'
        },
        proposal: {
          name: 'proposal',
          type: 'Proposal',
          model: 'Proposal',
          relationType: 'belongsTo',
                  keyFrom: 'proposalId',
          keyTo: 'proposalId'
        },
        datasetlifecycle: {
          name: 'datasetlifecycle',
          type: 'DatasetLifecycle',
          model: 'DatasetLifecycle',
          relationType: 'hasOne',
                  keyFrom: 'pid',
          keyTo: 'rawDatasetId'
        },
        datablocks: {
          name: 'datablocks',
          type: 'Datablock[]',
          model: 'Datablock',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'rawDatasetId'
        },
        datasetattachments: {
          name: 'datasetattachments',
          type: 'DatasetAttachment[]',
          model: 'DatasetAttachment',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'rawDatasetId'
        },
        origdatablocks: {
          name: 'origdatablocks',
          type: 'OrigDatablock[]',
          model: 'OrigDatablock',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'rawDatasetId'
        },
      }
    }
  }
}
