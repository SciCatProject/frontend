/* tslint:disable */

declare var Object: any;
export interface AccessUserInterface {
  "sAMAccountName": any;
  "displayName"?: any;
  "description"?: any;
  "email"?: any;
  "memberOf"?: any;
}

export class AccessUser implements AccessUserInterface {
  "sAMAccountName": any;
  "displayName": any;
  "description": any;
  "email": any;
  "memberOf": any;
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
      properties: {
        "sAMAccountName": {
          name: 'sAMAccountName',
          type: 'any'
        },
        "displayName": {
          name: 'displayName',
          type: 'any'
        },
        "description": {
          name: 'description',
          type: 'any'
        },
        "email": {
          name: 'email',
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
