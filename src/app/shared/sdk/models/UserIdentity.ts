/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface UserIdentityInterface {
  "provider"?: any;
  "authScheme"?: any;
  "externalId"?: any;
  "profile"?: any;
  "credentials"?: any;
  "created"?: any;
  "modified"?: any;
  "id"?: any;
  "userId"?: any;
  user?: User;
}

export class UserIdentity implements UserIdentityInterface {
  "provider": any;
  "authScheme": any;
  "externalId": any;
  "profile": any;
  "credentials": any;
  "created": any;
  "modified": any;
  "id": any;
  "userId": any;
  user: User;
  constructor(data?: UserIdentityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserIdentity`.
   */
  public static getModelName() {
    return "UserIdentity";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UserIdentity for dynamic purposes.
  **/
  public static factory(data: UserIdentityInterface): UserIdentity{
    return new UserIdentity(data);
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
      name: 'UserIdentity',
      plural: 'UserIdentities',
      properties: {
        "provider": {
          name: 'provider',
          type: 'any'
        },
        "authScheme": {
          name: 'authScheme',
          type: 'any'
        },
        "externalId": {
          name: 'externalId',
          type: 'any'
        },
        "profile": {
          name: 'profile',
          type: 'any'
        },
        "credentials": {
          name: 'credentials',
          type: 'any'
        },
        "created": {
          name: 'created',
          type: 'any'
        },
        "modified": {
          name: 'modified',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "userId": {
          name: 'userId',
          type: 'any'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'User',
          model: 'User'
        },
      }
    }
  }
}
