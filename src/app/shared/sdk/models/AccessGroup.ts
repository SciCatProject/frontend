/* tslint:disable */

declare var Object: any;
export interface AccessGroupInterface {
  "sAMAccountName": string;
  "description"?: string;
  "member"?: Array<any>;
  "memberOf"?: Array<any>;
}

export class AccessGroup implements AccessGroupInterface {
  "sAMAccountName": string;
  "description": string;
  "member": Array<any>;
  "memberOf": Array<any>;
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
      path: 'AccessGroups',
      idName: 'sAMAccountName',
      properties: {
        "sAMAccountName": {
          name: 'sAMAccountName',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "member": {
          name: 'member',
          type: 'Array&lt;any&gt;'
        },
        "memberOf": {
          name: 'memberOf',
          type: 'Array&lt;any&gt;'
        },
      },
      relations: {
      }
    }
  }
}
