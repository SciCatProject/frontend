/* tslint:disable */

declare var Object: any;
export interface DatasetAttachmentInterface {
  "id"?: any;
}

export class DatasetAttachment implements DatasetAttachmentInterface {
  "id": any;
  constructor(data?: DatasetAttachmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DatasetAttachment`.
   */
  public static getModelName() {
    return "DatasetAttachment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DatasetAttachment for dynamic purposes.
  **/
  public static factory(data: DatasetAttachmentInterface): DatasetAttachment{
    return new DatasetAttachment(data);
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
      name: 'DatasetAttachment',
      plural: 'DatasetAttachments',
      path: 'DatasetAttachments',
      idName: 'id',
      properties: {
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
