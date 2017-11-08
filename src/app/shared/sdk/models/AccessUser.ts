/* tslint:disable */

declare var Object: any;
export interface AccessUserInterface {
  "sAMAccountName": string;
  "displayName"?: string;
  "description"?: string;
  "email"?: string;
  "memberOf"?: Array<any>;
}

export class AccessUser implements AccessUserInterface {
  "sAMAccountName": string;
  "displayName": string;
  "description": string;
  "email": string;
  "memberOf": Array<any>;
  constructor(data?: AccessUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccessUser`.
   */
  public static getModelName() {
    return "AccessUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccessUser for dynamic purposes.
  **/
  public static factory(data: AccessUserInterface): AccessUser{
    return new AccessUser(data);
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
      name: 'AccessUser',
      plural: 'AccessUsers',
      path: 'AccessUsers',
      idName: 'sAMAccountName',
      properties: {
        "sAMAccountName": {
          name: 'sAMAccountName',
          type: 'string'
        },
        "displayName": {
          name: 'displayName',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
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
