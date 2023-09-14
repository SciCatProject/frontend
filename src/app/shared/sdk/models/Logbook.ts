/* eslint-disable */

declare var Object: any;
export interface LogbookInterface {
  name?: string;
  roomId?: string;
  messages?: Array<any>;
}

export class Logbook implements LogbookInterface {
  "name": string;
  "roomId": string;
  "messages": Array<any>;
  constructor(data?: LogbookInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Logbook`.
   */
  public static getModelName() {
    return "Logbook";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of Logbook for dynamic purposes.
   **/
  public static factory(data: LogbookInterface): Logbook {
    return new Logbook(data);
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
      name: "Logbook",
      plural: "Logbooks",
      path: "Logbooks",
      idName: "id",
      properties: {
        name: {
          name: "name",
          type: "string",
        },
        roomId: {
          name: "roomId",
          type: "string",
        },
        messages: {
          name: "messages",
          type: "Array&lt;any&gt;",
        },
      },
      relations: {},
    };
  }
}
