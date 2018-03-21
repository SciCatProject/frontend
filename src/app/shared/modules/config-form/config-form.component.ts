import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {Store} from '@ngrx/store';
import {BaseLoopBackApi} from 'shared/sdk/services/core/base.service';
import {ConfigService} from 'shared/services/config.service';
import {DatePipe} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector : 'config-form',
  templateUrl : './config-form.component.html',
  styleUrls : [ './config-form.component.css' ]
})
export class ConfigFormComponent implements OnInit {

  @Input() source: object;
  @Input() sourceType;
  @Input() enabled = true;

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  dsFormGroup: FormGroup;
  properties: object;
  formData: object;
  formConfig: object;
  objData: object = {};

  constructor(private formBuilder: FormBuilder,
              private configService: ConfigService, private store: Store<any>) {
  }

  ngOnInit() {
    // TODO check if config exists, do not use if doesn't (i.e. for normal
    // objects)
    let configFile = undefined;
    if (this.sourceType) {
      configFile = this.sourceType;
    } else if (this.source && this.source.constructor.name !== 'Object') {
      configFile = this.source.constructor.name;
    }
    if (configFile) {
      this.configService.getConfigFile(configFile)
          .subscribe(
              res => {
                this.formConfig = res;
                this.loadForm(res);
              },
              error => { console.error(error); });
    } else {
      this.loadForm();
    }
  }

  /**
   * Load the properties of the form
   * based on config.
   * Also handles types when set up in the
   * properties json file
   * @memberof ConfigFormComponent
   */
  loadForm(config = undefined) {
    // create a copy of the provided object in order to maintain original
    // datatypes
    this.formData = Object.assign({}, this.source);
    for (const prop in this.formData) {
      if (prop && this.formData.hasOwnProperty(prop)) {
        if (this.formConfig) {
          config = this.formConfig[prop];
          if (config && config['type'] === 'Date') {
            const date = new Date(this.source[prop]);
            const datePipe = new DatePipe('en-US');
            const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
            this.formData[prop] = formattedDate;
            }
          if (config && config['type'] === 'number' && config['name'] === 'size') {
            this.formData[prop] = (((this.source[prop] / 1024) / 1024) / 1024).toFixed(10);
            }
          if (config && 'visible' in config && config['visible'] === false) {
            delete this.formData[prop];
          }
          }
        if (this.getType(prop, this.source[prop]) === 'object') {
          this.objData[prop] =
              <Object[]>this.getTreeFromObject(this.source[prop]);
        } else if (this.getType(prop, this.source[prop]) === 'array') {
          this.formData[prop] = JSON.stringify(this.source[prop]);
        }
      }
    }
    this.dsFormGroup = this.formBuilder.group(this.formData);
    // disable all elements, this could also be modified to only disabled those
    // specified in a config file
    if (!this.enabled) {
      for (const cName in this.dsFormGroup.controls) {
        if (cName) {
          this.dsFormGroup.controls[cName].disable();
        }
      }
    }
  }

  /**
   * Create a TreeNode structure from an supplied object.
   * @param {any} object
   * @returns
   * @memberof ConfigFormComponent
   */
  getTreeFromObject(object) {
    const paths = [];
    iterate(object, '');
    return paths;

    /**
     * Single object iteration. Accumulates to an outer 'paths' array.
     * @param {any} obj
     * @param {any} path
     * @returns
     */
    function iterate(obj, path) {
      for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] === 'object') {
            const kids = [];
            if (path) {
              path.push(
                  {data : {name : property, value : ''}, children : kids});
            } else {
              paths.push(
                  {data : {name : property, value : ''}, children : kids});
            }
            iterate(obj[property], kids);
          } else if (path !== '') {
            path.push({data : {name : property, value : obj[property]}});
          } else {
            paths.push({data : {name : property, value : obj[property]}});
          }
        }
        }
      return paths;
    }
  }

  /**
   * Run on submission of form
   * Deals with converting back to correct formats
   * @param {any} values
   * @memberof ConfigFormComponent
   */
  updateModel(values) {
    this.onSubmit.emit(values);
  }

  /**
   * Checks type against config and
   * fallback to type if not available
   * @param {any} key
   * @param {any} value
   * @returns
   * @memberof ConfigFormComponent
   */
  getType(key, value) {
    if (this.formConfig && key in this.formConfig &&
        this.formConfig[key]['type']) {
      return this.formConfig[key]['type'];
    } else {
      return typeof(value);
    }
  }
}
