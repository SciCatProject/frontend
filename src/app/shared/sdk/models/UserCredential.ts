/* eslint-disable */
import { User } from "../index";

declare var Object: any;
export interface UserCredentialInterface {
  provider?: string;
  authScheme?: string;
  externalId?: string;
  profile?: any;
  credentials?: any;
  created?: Date;
  modified?: Date;
  id?: any;
  userId?: any;
  user?: User;
}

export class UserCredential implements UserCredentialInterface {
  "provider": string;
  "authScheme": string;
  "externalId": string;
  "profile": any;
  "credentials": any;
  "created": Date;
  "modified": Date;
  "id": any;
  "userId": any;
  user: User;
  constructor(data?: UserCredentialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserCredential`.
   */
  public static getModelName() {
    return "UserCredential";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of UserCredential for dynamic purposes.
   **/
  public static factory(data: UserCredentialInterface): UserCredential {
    return new UserCredential(data);
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
      name: "UserCredential",
      plural: "UserCredentials",
      path: "UserCredentials",
      idName: "id",
      properties: {
        provider: {
          name: "provider",
          type: "string",
        },
        authScheme: {
          name: "authScheme",
          type: "string",
        },
        externalId: {
          name: "externalId",
          type: "string",
        },
        profile: {
          name: "profile",
          type: "any",
        },
        credentials: {
          name: "credentials",
          type: "any",
        },
        created: {
          name: "created",
          type: "Date",
        },
        modified: {
          name: "modified",
          type: "Date",
        },
        id: {
          name: "id",
          type: "any",
        },
        userId: {
          name: "userId",
          type: "any",
        },
      },
      relations: {
        user: {
          name: "user",
          type: "User",
          model: "User",
          relationType: "belongsTo",
          keyFrom: "userId",
          keyTo: "id",
        },
      },
    };
  }
}
