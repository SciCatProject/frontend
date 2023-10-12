/* eslint-disable */

declare var Object: any;
export interface ApplicationCredentialInterface {
  provider: string;
  authScheme?: string;
  credentials?: any;
  created?: Date;
  modified?: Date;
  id?: any;
}

export class ApplicationCredential implements ApplicationCredentialInterface {
  "provider": string;
  "authScheme": string;
  "credentials": any;
  "created": Date;
  "modified": Date;
  "id": any;
  constructor(data?: ApplicationCredentialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ApplicationCredential`.
   */
  public static getModelName() {
    return "ApplicationCredential";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of ApplicationCredential for dynamic purposes.
   **/
  public static factory(
    data: ApplicationCredentialInterface,
  ): ApplicationCredential {
    return new ApplicationCredential(data);
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
      name: "ApplicationCredential",
      plural: "ApplicationCredentials",
      path: "ApplicationCredentials",
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
      },
      relations: {},
    };
  }
}
