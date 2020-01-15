/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface UserSettingInterface {
  "columns"?: Array<any>;
  "datasetCount"?: number;
  "jobCount"?: number;
  "id"?: any;
  "userId"?: any;
  user?: User;
}

export class UserSetting implements UserSettingInterface {
  "columns": Array<any>;
  "datasetCount": number;
  "jobCount": number;
  "id": any;
  "userId": any;
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
          model: 'User',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'id'
        },
      }
    }
  }
}
