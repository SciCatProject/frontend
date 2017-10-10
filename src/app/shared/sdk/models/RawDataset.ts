/* tslint:disable */
import {
  Sample,
  Proposal,
  DatasetLifecycle,
  Datablock,
  OrigDatablock
} from '../index';

declare var Object: any;
export interface RawDatasetInterface {
  "principalInvestigator": any;
  "endTime"?: any;
  "creationLocation": any;
  "dataFormat"?: any;
  "scientificMetadata"?: any;
  "pid"?: any;
  "owner": any;
  "ownerEmail"?: any;
  "orcidOfOwner"?: any;
  "contactEmail": any;
  "sourceFolder": any;
  "size"?: any;
  "packedSize"?: any;
  "creationTime": any;
  "type": any;
  "validationStatus"?: any;
  "keywords"?: any;
  "description"?: any;
  "userTargetLocation"?: any;
  "classification"?: any;
  "license"?: any;
  "version"?: any;
  "doi"?: any;
  "isPublished"?: any;
  "ownerGroup": any;
  "accessGroups"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
  "sampleId"?: any;
  "proposalId"?: any;
  sample?: Sample;
  proposal?: Proposal;
  datasetlifecycle?: DatasetLifecycle;
  datablocks?: Datablock[];
  origdatablocks?: OrigDatablock[];
}

export class RawDataset implements RawDatasetInterface {
  "principalInvestigator": any;
  "endTime": any;
  "creationLocation": any;
  "dataFormat": any;
  "scientificMetadata": any;
  "pid": any;
  "owner": any;
  "ownerEmail": any;
  "orcidOfOwner": any;
  "contactEmail": any;
  "sourceFolder": any;
  "size": any;
  "packedSize": any;
  "creationTime": any;
  "type": any;
  "validationStatus": any;
  "keywords": any;
  "description": any;
  "userTargetLocation": any;
  "classification": any;
  "license": any;
  "version": any;
  "doi": any;
  "isPublished": any;
  "ownerGroup": any;
  "accessGroups": any;
  "createdAt": any;
  "updatedAt": any;
  "sampleId": any;
  "proposalId": any;
  sample: Sample;
  proposal: Proposal;
  datasetlifecycle: DatasetLifecycle;
  datablocks: Datablock[];
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
      properties: {
        "principalInvestigator": {
          name: 'principalInvestigator',
          type: 'any'
        },
        "endTime": {
          name: 'endTime',
          type: 'any'
        },
        "creationLocation": {
          name: 'creationLocation',
          type: 'any'
        },
        "dataFormat": {
          name: 'dataFormat',
          type: 'any'
        },
        "scientificMetadata": {
          name: 'scientificMetadata',
          type: 'any'
        },
        "pid": {
          name: 'pid',
          type: 'any'
        },
        "owner": {
          name: 'owner',
          type: 'any'
        },
        "ownerEmail": {
          name: 'ownerEmail',
          type: 'any'
        },
        "orcidOfOwner": {
          name: 'orcidOfOwner',
          type: 'any'
        },
        "contactEmail": {
          name: 'contactEmail',
          type: 'any'
        },
        "sourceFolder": {
          name: 'sourceFolder',
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
        "creationTime": {
          name: 'creationTime',
          type: 'any'
        },
        "type": {
          name: 'type',
          type: 'any'
        },
        "validationStatus": {
          name: 'validationStatus',
          type: 'any'
        },
        "keywords": {
          name: 'keywords',
          type: 'any'
        },
        "description": {
          name: 'description',
          type: 'any'
        },
        "userTargetLocation": {
          name: 'userTargetLocation',
          type: 'any'
        },
        "classification": {
          name: 'classification',
          type: 'any'
        },
        "license": {
          name: 'license',
          type: 'any'
        },
        "version": {
          name: 'version',
          type: 'any'
        },
        "doi": {
          name: 'doi',
          type: 'any'
        },
        "isPublished": {
          name: 'isPublished',
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
        "createdAt": {
          name: 'createdAt',
          type: 'any'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'any'
        },
        "sampleId": {
          name: 'sampleId',
          type: 'any'
        },
        "proposalId": {
          name: 'proposalId',
          type: 'any'
        },
      },
      relations: {
        sample: {
          name: 'sample',
          type: 'Sample',
          model: 'Sample'
        },
        proposal: {
          name: 'proposal',
          type: 'Proposal',
          model: 'Proposal'
        },
        datasetlifecycle: {
          name: 'datasetlifecycle',
          type: 'DatasetLifecycle',
          model: 'DatasetLifecycle'
        },
        datablocks: {
          name: 'datablocks',
          type: 'Datablock[]',
          model: 'Datablock'
        },
        origdatablocks: {
          name: 'origdatablocks',
          type: 'OrigDatablock[]',
          model: 'OrigDatablock'
        },
      }
    }
  }
}
