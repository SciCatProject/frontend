/* tslint:disable */

declare var Object: any;
export interface AccessGroupInterface {
  "sAMAccountName": any;
  "description"?: any;
  "member"?: any;
  "memberOf"?: any;
}

export class AccessGroup implements AccessGroupInterface {
  "sAMAccountName": any;
  "description": any;
  "member": any;
  "memberOf": any;
  constructor(data?: AccessGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccessGroup`.
   */
  public static getModelName() {
    return "AccessGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccessGroup for dynamic purposes.
  **/
  public static factory(data: AccessGroupInterface): AccessGroup{
    return new AccessGroup(data);
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
      name: 'AccessGroup',
      plural: 'AccessGroups',
      properties: {
        "sAMAccountName": {
          name: 'sAMAccountName',
          type: 'any'
        },
        "description": {
          name: 'description',
          type: 'any'
        },
        "member": {
          name: 'member',
          type: 'any'
        },
        "memberOf": {
          name: 'memberOf',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
