/* tslint:disable */

declare var Object: any;
export interface SynchTimesInterface {
  "myid"?: number;
  "lastSynchTime": string;
  "lastSynchSN": number;
  "affectedUsers"?: Array<any>;
  "affectedGroups"?: Array<any>;
}

export class SynchTimes implements SynchTimesInterface {
  "myid": number;
  "lastSynchTime": string;
  "lastSynchSN": number;
  "affectedUsers": Array<any>;
  "affectedGroups": Array<any>;
  constructor(data?: SynchTimesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SynchTimes`.
   */
  public static getModelName() {
    return "SynchTimes";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SynchTimes for dynamic purposes.
  **/
  public static factory(data: SynchTimesInterface): SynchTimes{
    return new SynchTimes(data);
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
      name: 'SynchTimes',
      plural: 'SynchTimes',
      path: 'SynchTimes',
      idName: 'myid',
      properties: {
        "myid": {
          name: 'myid',
          type: 'number'
        },
        "lastSynchTime": {
          name: 'lastSynchTime',
          type: 'string'
        },
        "lastSynchSN": {
          name: 'lastSynchSN',
          type: 'number'
        },
        "affectedUsers": {
          name: 'affectedUsers',
          type: 'Array&lt;any&gt;'
        },
        "affectedGroups": {
          name: 'affectedGroups',
          type: 'Array&lt;any&gt;'
        },
      },
      relations: {
      }
    }
  }
}
