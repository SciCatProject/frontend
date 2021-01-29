/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface UserSettingInterface {
  "id"?: string;
  "columns"?: Array<any>;
  "datasetCount"?: number;
  "jobCount"?: number;
  "createdBy"?: string;
  "updatedBy"?: string;
  "userId"?: any;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  user?: User;
}

export class UserSetting implements UserSettingInterface {
  "id": string;
  "columns": Array<any>;
  "datasetCount": number;
  "jobCount": number;
  "createdBy": string;
  "updatedBy": string;
  "userId": any;
  "createdAt": Date;
  "updatedAt": Date;
  user: User;
  constructor(data?: UserSettingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserSetting`.
   */
  public static getModelName() {
    return "UserSetting";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UserSetting for dynamic purposes.
  **/
  public static factory(data: UserSettingInterface): UserSetting{
    return new UserSetting(data);
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
      name: 'UserSetting',
      plural: 'UserSettings',
      path: 'UserSettings',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "columns": {
          name: 'columns',
          type: 'Array&lt;any&gt;'
        },
        "datasetCount": {
          name: 'datasetCount',
          type: 'number',
          default: 25
        },
        "jobCount": {
          name: 'jobCount',
          type: 'number',
          default: 25
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "userId": {
          name: 'userId',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'User',
          model: 'User',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'id'
        },
      }
    }
  }
}
