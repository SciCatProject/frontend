/* tslint:disable */
import {
  DatasetLifecycle,
  Datablock,
  DatasetAttachment,
  OrigDatablock
} from '../index';

declare var Object: any;
export interface DerivedDatasetInterface {
  "investigator": string;
  "inputDatasets": Array<any>;
  "usedSoftware": Array<any>;
  "jobParameters"?: any;
  "jobLogData"?: string;
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
  datasetlifecycle?: DatasetLifecycle;
  datablocks?: Datablock[];
  datasetattachments?: DatasetAttachment[];
  origdatablocks?: OrigDatablock[];
}

export class DerivedDataset implements DerivedDatasetInterface {
  "investigator": string;
  "inputDatasets": Array<any>;
  "usedSoftware": Array<any>;
  "jobParameters": any;
  "jobLogData": string;
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
  datasetlifecycle: DatasetLifecycle;
  datablocks: Datablock[];
  datasetattachments: DatasetAttachment[];
  origdatablocks: OrigDatablock[];
  constructor(data?: DerivedDatasetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DerivedDataset`.
   */
  public static getModelName() {
    return "DerivedDataset";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DerivedDataset for dynamic purposes.
  **/
  public static factory(data: DerivedDatasetInterface): DerivedDataset{
    return new DerivedDataset(data);
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
      name: 'DerivedDataset',
      plural: 'DerivedDatasets',
      path: 'DerivedDatasets',
      idName: 'pid',
      properties: {
        "investigator": {
          name: 'investigator',
          type: 'string'
        },
        "inputDatasets": {
          name: 'inputDatasets',
          type: 'Array&lt;any&gt;'
        },
        "usedSoftware": {
          name: 'usedSoftware',
          type: 'Array&lt;any&gt;'
        },
        "jobParameters": {
          name: 'jobParameters',
          type: 'any'
        },
        "jobLogData": {
          name: 'jobLogData',
          type: 'string'
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
      },
      relations: {
        datasetlifecycle: {
          name: 'datasetlifecycle',
          type: 'DatasetLifecycle',
          model: 'DatasetLifecycle',
          relationType: 'hasOne',
                  keyFrom: 'pid',
          keyTo: 'derivedDatasetId'
        },
        datablocks: {
          name: 'datablocks',
          type: 'Datablock[]',
          model: 'Datablock',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'derivedDatasetId'
        },
        datasetattachments: {
          name: 'datasetattachments',
          type: 'DatasetAttachment[]',
          model: 'DatasetAttachment',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'derivedDatasetId'
        },
        origdatablocks: {
          name: 'origdatablocks',
          type: 'OrigDatablock[]',
          model: 'OrigDatablock',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'derivedDatasetId'
        },
      }
    }
  }
}
