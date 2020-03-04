/* tslint:disable */
import {
  Dataset
} from '../index';

declare var Object: any;
export interface InstrumentInterface {
  "pid"?: string;
  "name": string;
  "customMetadata"?: any;
  datasets?: Dataset[];
}

export class Instrument implements InstrumentInterface {
  "pid": string;
  "name": string;
  "customMetadata": any;
  datasets: Dataset[];
  constructor(data?: InstrumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Instrument`.
   */
  public static getModelName() {
    return "Instrument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Instrument for dynamic purposes.
  **/
  public static factory(data: InstrumentInterface): Instrument{
    return new Instrument(data);
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
      name: 'Instrument',
      plural: 'Instruments',
      path: 'Instruments',
      idName: 'pid',
      properties: {
        "pid": {
          name: 'pid',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "customMetadata": {
          name: 'customMetadata',
          type: 'any'
        },
      },
      relations: {
        datasets: {
          name: 'datasets',
          type: 'Dataset[]',
          model: 'Dataset',
          relationType: 'hasMany',
                  keyFrom: 'pid',
          keyTo: 'instrumentId'
        },
      }
    }
  }
}
