/* tslint:disable */

declare var Object: any;
export interface SynchTimesInterface {
  "myid"?: any;
  "lastSynchTime": any;
  "lastSynchSN": any;
  "affectedUsers"?: any;
  "affectedGroups"?: any;
}

export class SynchTimes implements SynchTimesInterface {
  "myid": any;
  "lastSynchTime": any;
  "lastSynchSN": any;
  "affectedUsers": any;
  "affectedGroups": any;
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
      properties: {
        "myid": {
          name: 'myid',
          type: 'any'
        },
        "lastSynchTime": {
          name: 'lastSynchTime',
          type: 'any'
        },
        "lastSynchSN": {
          name: 'lastSynchSN',
          type: 'any'
        },
        "affectedUsers": {
          name: 'affectedUsers',
          type: 'any'
        },
        "affectedGroups": {
          name: 'affectedGroups',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
