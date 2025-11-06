import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { ActionConfig, ActionItems } from "./configurable-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AuthService } from "shared/services/auth/auth.service";
import { v4 } from "uuid";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { updatePropertyAction } from "state-management/actions/datasets.actions";
import { Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import { selectProfile } from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

function processSelector(
  jsonObject: JSONValue,
  selector: string
): string | string[] | number | number[] {
  console.log("---> processSelector");
  console.log(jsonObject);
  console.log(selector);
  const results: string[] = [];
  const numericResults: number[] = [];
  let sum = 0;

  // Remove leading/trailing whitespace
  selector = selector.trim();

  var coreSelector = null;
  var operationPart = null;

  // Match pattern: [ ... ] | operation  
  // Supports spaces between parts.
  const match = selector.match(/^\[(.+)\]\s*\|\s*(.+)$/);
  if (match) {
    // There is an operation after the brackets
    coreSelector = match[1].trim();
    operationPart = match[2].trim();
  } else {
    // no operation
    coreSelector = selector.trim();
  }

  if (coreSelector.startsWith('[') && coreSelector.endsWith(']')) {
    // Only coreSelector with brackets, no operation
    coreSelector = coreSelector.slice(1, -1).trim();
  }

  const parsePath = (path: string): string[] => {
    const result: string[] = [];
    // Remove starting dot, if any
    if (path.startsWith('.')) {
      path = path.slice(1);
    }
    // Split on dot to extract properties (with possible [index] after them)
    const segments = path.split('.');

    for (const segment of segments) {
      // Match property and possible [index]
      const regex = /([a-zA-Z0-9_]+)|(\[\d+\])/g;
      let match;
      while ((match = regex.exec(segment)) !== null) {
        if (match[1] !== undefined) {
          // Property name
          result.push(match[1].trim());
        } else if (match[2] !== undefined) {
          // Array index
          result.push(match[2].trim());
        }
      }
    }

    return result;
  }

  // extract main field selector and filter
  const [mainSelector, filterSelector] = coreSelector.split('|').map(part => part.trim());
  const mainKeys = parsePath(mainSelector)
//    .replace(/^\./, "") // Remove leading dot
//    .split(".")         // Split into keys
//    .map((key) => key.trim());

  let filterKeys: string[] | null = null;
  if (filterSelector) {
    if (!filterSelector.startsWith("select ")) {
      throw new Error("Invalid syntax: Filter part must start with 'select'.");
    }
    filterKeys = parsePath(filterSelector.slice(7));          // Remove "select " prefix
      //.replace(/^\./, "") // Remove leading dot
      //.split(".")         // Split into keys
      //.map(key => key.trim());
  }

  const traverse = (
    obj: JSONValue,
    keys: string[],
    filterKeys?: string[],
    filterObj?: JSONValue
  ) => {
    if (keys.length === 0) {
      // If no more main keys to process, evaluate the filter (if provided)
      if (filterKeys && filterObj !== undefined) {
        const filterPasses = evaluateFilter(filterObj, filterKeys);
        if (!filterPasses) return;
      }

      // Add the current value to the appropriate collection
      if (typeof obj === "string") {
        results.push(obj);
      } else if (typeof obj === "number") {
        numericResults.push(obj);
        sum += obj;
      }

      return;
    }

    const key = keys[0];

    if (Array.isArray(obj)) {
      // If the current object is an array, process each item
      if (key.startsWith("[") && key.endsWith("]")) {
        const index = parseInt(key.slice(1, -1));
        if (!isNaN(index) && obj[index] !== undefined) {
          traverse(obj[index], keys.slice(1), filterKeys, obj[index]);
        }
      } else {
        obj.forEach((item) => traverse(item, keys, filterKeys, item));
      }
    } else if (typeof obj === "object" && obj !== null) {
      traverse(obj[key], keys.slice(1), filterKeys, obj);
    }
  };

  const evaluateFilter = (obj: JSONValue, filterKeys: string[]): boolean => {
    let current = obj;
    for (const key of filterKeys) {
      if (Array.isArray(current)) {
        // Return false for arrays within a filter (unsupported case)
        return false;
      } else if (typeof current === "object" && current !== null && key in current) {
        current = current[key];
      } else {
        return false;
      }
    }
    return current === true; // Assume filter checks for a `true` value
  };

  // Begin traversing the JSON object
  traverse(jsonObject, mainKeys, filterKeys || undefined, jsonObject);

  // Handle post-processing commands like `count` or others
  let count = 0;
  if (operationPart) {
    switch (operationPart) {
      case "count":
        return (results.length > 0 ? results.length : numericResults.length);
        break;
      case "sum":
        return numericResults.reduce((total, value) => total + value, 0); // Defensive to ensure correct computation
        break;
      default:
        throw new Error(`Unsupported operation: ${operationPart}`);
    }
  } 

  return results;
}

// Example usage
// const jsonExample = {
//   datasets: [
//     { files: { selected: true, path: "/path/to/file1", size: 100 } },
//     { files: { selected: false, path: "/path/to/file2", size: 200 } },
//     { files: { selected: true, path: "/path/to/file3", size: 300 } }
//   ]
// };

// // Example 1: Count all selected items
// const selectorCount = "[.datasets[].files.size | select .datasets[].files.selected] | count";
// const countResult = processSelector(jsonExample, selectorCount);
// console.log(countResult); // Output: 2

// // Example 2: Sum all selected sizes
// const selectorSum = "[.datasets[].files.size | select .datasets[].files.selected] | sum";
// const sumResult = processSelector(jsonExample, selectorSum);
// console.log(sumResult); // Output: 400

// // Example 3: Retrieve all paths
// const selectorPaths = "[.datasets[].files.path | select .datasets[].files.selected] | count";
// const pathsResult = processSelector(jsonExample, selectorPaths);
// console.log(pathsResult); // Output: ["/path/to/file1", "/path/to/file3"]

@Component({
  selector: "configurable-action",
  templateUrl: "./configurable-action.component.html",
  styleUrls: ["./configurable-action.component.scss"],
  standalone: false,
})
export class ConfigurableActionComponent implements OnInit, OnChanges {
  @Input({ required: true }) actionConfig: ActionConfig;
  @Input({ required: true }) actionItems: ActionItems;
  //@Input() files?: DataFiles_File[];
  userProfile$ = this.store.select(selectProfile);

  jwt = "";
  use_mat_icon = false;
  use_icon = false;
  disabled_condition = "false";
  #selectedTotalFileSize = 0;
  #numberOfFileSelected = 0;
  variables: Record<string, any> = {};

  form: HTMLFormElement = null;

  subscriptions: Subscription[] = [];

  userProfile: any = {};

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private configService: AppConfigService,
    private snackBar: MatSnackBar,
    private store: Store,
    private router: Router,
  ) {
    this.usersService.usersControllerGetUserJWTV3().subscribe((jwt) => {
      this.jwt = jwt.jwt;
    });
  }

  private evaluate_hidden_condition(condition: string) {
    return condition
      .replaceAll(
        "#isPublished",
        String(this.actionItems[0].isPublished === true),
      )
      .replaceAll(
        "#!isPublished",
        String(this.actionItems[0].isPublished === false),
      );
  }

  private prepare_action_condition(condition: string) {
    // Define replacements for specific functions and variables
    return condition
      // Handle #Length({{ files }})
      .replace(
        /\#Length\(\s*\@(\w+)\s*\)/g,
        (_, variableName) => `variables.${variableName}.length`)
      // Handle #MaxDownloadableSize({{ totalSize }})
      .replace(
        ///#MaxDownloadableSize\(\{\{\s(\w+)\s\}\}\)/g,
        /\#MaxDownloadableSize\(@*(\w+)\)/g,
        (_, variableName) => `variables.${variableName} <= maxDownloadableSize`)
      .replace(
        /\#datasetOwner/g,
        (_) => `datasetOwner`)        
      .replace(
        /\@(\w+)/g, 
        (_, variableName) => `variables.${variableName}`);
  }

  private prepare_disabled_condition() {
    console.log("---> prepare_disabled_condition");
    if (this.actionConfig.enabled) {
      this.disabled_condition =
        "!(" +
        this.prepare_action_condition(this.actionConfig.enabled) +
        ")";
    } else if (this.actionConfig.disabled) {
      this.disabled_condition = this.prepare_action_condition(
        this.actionConfig.disabled,
      );
    } else {
      this.disabled_condition = "false";
    }
    console.log(this.disabled_condition);
  }

  private prepare_hidden_condition() {
    if (this.actionConfig.hidden) {
      return (
        "!(" + this.evaluate_hidden_condition(this.actionConfig.hidden) + ")"
      );
    } else {
      return "false";
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userProfile$.subscribe((userProfile) => {
        if (userProfile) {
          this.userProfile = userProfile;
        }
      }),
    );
    this.use_mat_icon = !!this.actionConfig.mat_icon;
    this.use_icon = this.actionConfig.icon !== undefined;
    this.prepare_disabled_condition();
    this.update_status();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["actionItems"]) {
      this.update_status();
    }
  }

  update_status() {
    console.log("---> update_status");
    console.log(this.actionConfig);
    console.log(this.actionItems);
    Object.entries(this.actionConfig.variables ?? {}).forEach(([key,selector]) => {
      this.variables[key] = processSelector(
        this.actionItems as unknown as JSONValue,
        selector)
    })
  }

  get context() {
    const user = this.authService.getCurrentUserData();
    return {
      variables: this.variables,
      maxDownloadableSize: this.configService.getConfig().maxDirectDownloadSize,
      datasetOwner: (this.actionItems.datasets.map( (d) : Boolean => {
        return this.userProfile.accessGroups?.includes(d.ownerGroup) || false;
      }) as Array<Boolean>).every(Boolean),
    }
  }

  get disabled() {
    this.update_status();

    const expr = this.disabled_condition;
    console.log(expr);
    const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);

    const res = fn(this.context);
    console.log(res);
    return res;
  }

  get visible() {
    if (!this.actionConfig.hidden) {
      return true;
    } else {
      const expr = this.prepare_hidden_condition();
      const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);

      return fn({
        variables: this.variables,
        maxDownloadableSize: this.configService.getConfig().maxDirectDownloadSize,
      });
    }
  }

  add_input(name: string, value: string) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  perform_action() {
    const action_type = this.actionConfig.type || "form";
    switch (action_type) {
      case "json-to-download":
        return this.type_json_to_download();
      case "xhr":
        return this.type_xhr();
      case "link":
        return this.type_link();
      case "form":
      default:
        return this.type_form();
    }
  }

  get_value_from_definition(definition: string) {
    if (definition == "#token" || definition == "#tokenSimple") {
      return this.authService.getToken().id;
    } else if (definition == "#tokenBearer") {
      return `Bearer ${this.authService.getToken().id}`;
    } else if (definition == "#jwt") {
      return this.jwt;
    } else if (definition == "#uuid") {
      return v4();
    } else if (definition.startsWith("@")) {
      return this.variables[definition.slice(1)];
    }
    return definition;
  }

  type_form() {
    if (this.form !== null) {
      document.body.removeChild(this.form);
    }

    this.form = document.createElement("form");
    this.form.target = this.actionConfig.target || "_self";
    this.form.method = this.actionConfig.method || "POST";
    this.form.action = this.actionConfig.url;
    this.form.style.display = "none";

    // use the configuration under inputs to create the form
    Object.entries(this.actionConfig.inputs).forEach(([input, definition]) => {

      const value = this.get_value_from_definition(definition);

      if (input.endsWith("[]")) {
        const itemInput = input.slice(-2);
        const iteratable = Array.isArray(value)?value:[value];
        iteratable.forEach((itemValue, itemIndex) => {
          this.form.appendChild(
            this.add_input(`${itemInput}[${itemIndex}]`, value)
          );
        })
      } else {
        this.form.appendChild(this.add_input(input, value));
      }
    });

    document.body.appendChild(this.form);
    this.form.submit();

    return true;
  }

  get_payload() {
    let payload = "";
    if (this.actionConfig.payload == "#dump" ) {
      payload = JSON.stringify(this.variables);
    } else if (this.actionConfig.payload != "#empty" && this.actionConfig.payload) {
      payload = this.actionConfig.payload
    }

    return payload.replace(
      /{{\s*(\w+)\s*}}/g,
      (_, variableName) => {
        if (variableName.endsWith("[]")) {
          const variableNameClean = variableName.slice(-2);
          const value = this.get_value_from_definition(variableNameClean);
          const iteratable = Array.isArray(value) ? value : [value];
          return JSON.stringify(iteratable);
        } else {
          return this.get_value_from_definition(variableName);
        }
      }
    );
  }

  type_json_to_download() {

    const filename = this.actionConfig.filename
      .replace(
        /{{\s*(\w+)\s*}}/g,
        (_, variableName) => this.get_value_from_definition(variableName),
      );

    fetch(this.actionConfig.url, {
      method: this.actionConfig.method || "POST",
      headers: {
        ...{
          "Content-Type": "application/json",
        },
        ...(this.actionConfig.headers || {})
      },
      body: this.get_payload(),
    })
    .then((response) => {
      if (response.ok) {
        return response.blob();
      } else {
        // http error
        return Promise.reject(
          new Error(`HTTP Error code: ${response.status}`),
        );
      }
    })
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log("Datafile action error : ", error);
      this.snackBar.open(
        "There has been an error performing the action",
        "Close",
        {
          duration: 2000,
        },
      );
    });

    return true;
  }

  type_xhr() {

    const url = this.actionConfig.url
      .replace(
        /{{\s*(\w+)\s*}}/g,
        (_, variableName) => encodeURIComponent(this.get_value_from_definition(variableName)),
      );

    fetch(url, {
      method: this.actionConfig.method || "POST",
      headers: {
        ...{
          "Content-Type": "application/json",
        },
        ...(this.actionConfig.headers || {})
      },
      body: this.get_payload(),
    })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`HTTP Error code: ${response.status}`),
        );
      }

      // specific only for datasets
      // cannot be used
      // this.store.dispatch(
      //   updatePropertyAction({
      //     method: this.actionConfig.method,
      //     pid: element.pid,
      //     property: JSON.parse(this.actionConfig.payload),
      //   }),
      // );

      return response;
    })
    .catch((error) => {
      console.log("Error: ", error);
      this.snackBar.open(
        "There has been an error performing the action",
        "Close",
        {
          duration: 2000,
        },
      );
    });
  
    return true;
  }

  type_link() {
    this.router.navigateByUrl(this.actionConfig.url);
  }

}
