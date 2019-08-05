/* tslint:disable */

declare var Object: any;
export interface ShareGroupInterface {
  "groupID"?: string;
  "members"?: Array<any>;
  "datasets"?: Array<any>;
  "id"?: any;
}

export class ShareGroup implements ShareGroupInterface {
  "groupID": string;
  "members": Array<any>;
  "datasets": Array<any>;
  "id": any;
  constructor(data?: ShareGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ShareGroup`.
   */
  public static getModelName() {
    return "ShareGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ShareGroup for dynamic purposes.
  **/
  public static factory(data: ShareGroupInterface): ShareGroup{
    return new ShareGroup(data);
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
      name: 'ShareGroup',
      plural: 'ShareGroups',
      path: 'ShareGroups',
      idName: 'id',
      properties: {
        "groupID": {
          name: 'groupID',
          type: 'string'
        },
        "members": {
          name: 'members',
          type: 'Array&lt;any&gt;'
        },
        "datasets": {
          name: 'datasets',
          type: 'Array&lt;any&gt;'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
