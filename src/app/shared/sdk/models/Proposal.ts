/* tslint:disable */

declare var Object: any;
export interface ProposalInterface {
  "proposalId": any;
  "pi_email"?: any;
  "pi_firstname"?: any;
  "pi_lastname"?: any;
  "email": any;
  "firstname"?: any;
  "lastname"?: any;
  "title"?: any;
  "abstract"?: any;
  "attachments"?: any;
  "ownerGroup": any;
  "accessGroups"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
  "MeasurementPeriodList"?: any;
  measurementPeriods?: any[];
}

export class Proposal implements ProposalInterface {
  "proposalId": any;
  "pi_email": any;
  "pi_firstname": any;
  "pi_lastname": any;
  "email": any;
  "firstname": any;
  "lastname": any;
  "title": any;
  "abstract": any;
  "attachments": any;
  "ownerGroup": any;
  "accessGroups": any;
  "createdAt": any;
  "updatedAt": any;
  "MeasurementPeriodList": any;
  measurementPeriods: any[];
  constructor(data?: ProposalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Proposal`.
   */
  public static getModelName() {
    return "Proposal";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Proposal for dynamic purposes.
  **/
  public static factory(data: ProposalInterface): Proposal{
    return new Proposal(data);
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
      name: 'Proposal',
      plural: 'Proposals',
      properties: {
        "proposalId": {
          name: 'proposalId',
          type: 'any'
        },
        "pi_email": {
          name: 'pi_email',
          type: 'any'
        },
        "pi_firstname": {
          name: 'pi_firstname',
          type: 'any'
        },
        "pi_lastname": {
          name: 'pi_lastname',
          type: 'any'
        },
        "email": {
          name: 'email',
          type: 'any'
        },
        "firstname": {
          name: 'firstname',
          type: 'any'
        },
        "lastname": {
          name: 'lastname',
          type: 'any'
        },
        "title": {
          name: 'title',
          type: 'any'
        },
        "abstract": {
          name: 'abstract',
          type: 'any'
        },
        "attachments": {
          name: 'attachments',
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
        "MeasurementPeriodList": {
          name: 'MeasurementPeriodList',
          type: 'any',
          default: <any>[]
        },
      },
      relations: {
        measurementPeriods: {
          name: 'measurementPeriods',
          type: 'any[]',
          model: ''
        },
      }
    }
  }
}
