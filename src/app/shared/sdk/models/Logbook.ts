/* tslint:disable */
import {
  Proposal
} from '../index';

declare var Object: any;
export interface LogbookInterface {
  "name": string;
  "members"?: Array<any>;
  "userMessages"?: Array<any>;
  "botMessages"?: Array<any>;
  "images"?: Array<any>;
  "id"?: any;
  "proposalId"?: string;
  proposal?: Proposal;
}

export class Logbook implements LogbookInterface {
  "name": string;
  "members": Array<any>;
  "userMessages": Array<any>;
  "botMessages": Array<any>;
  "images": Array<any>;
  "id": any;
  "proposalId": string;
  proposal: Proposal;
  constructor(data?: LogbookInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Logbook`.
   */
  public static getModelName() {
    return "Logbook";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Logbook for dynamic purposes.
  **/
  public static factory(data: LogbookInterface): Logbook{
    return new Logbook(data);
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
      name: 'Logbook',
      plural: 'Logbooks',
      path: 'Logbooks',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "members": {
          name: 'members',
          type: 'Array&lt;any&gt;'
        },
        "userMessages": {
          name: 'userMessages',
          type: 'Array&lt;any&gt;'
        },
        "botMessages": {
          name: 'botMessages',
          type: 'Array&lt;any&gt;'
        },
        "images": {
          name: 'images',
          type: 'Array&lt;any&gt;'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "proposalId": {
          name: 'proposalId',
          type: 'string'
        },
      },
      relations: {
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
