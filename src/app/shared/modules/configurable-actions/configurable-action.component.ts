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
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";
import { result } from "lodash-es";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

function processSelector(
  jsonObject: ActionItems,
  selector: string,
): string | string[] | number | number[] {
  let match: RegExpMatchArray | null;

  // Map of static patterns to processing functions
  const keywordMap: { [pattern: string]: (RegExpMatchArray) => any } = {
    "#Dataset0Pid": (m) => jsonObject.datasets[0]?.pid,
    "#Dataset0FilesPath": (m) =>
      jsonObject.datasets[0]?.files?.map((i) => i.path),
    "#Dataset0FilesTotalSize": (m) =>
      jsonObject.datasets[0]?.files
        ?.map((i) => Number(i.size))
        .reduce((acc, val) => acc + val, 0),
    "#Dataset0SourceFolder": (m) => jsonObject.datasets[0]?.sourceFolder,
    "#Dataset0SelectedFilesPath": (m) =>
      jsonObject.datasets[0]?.files
        ?.filter((i) => i.selected)
        .map((i) => i.path),
    "#Dataset0SelectedFilesCount": (m) =>
      jsonObject.datasets[0]?.files?.filter((i) => i.selected).length,
    "#Dataset0SelectedFilesTotalSize": (m) =>
      jsonObject.datasets[0]?.files
        ?.filter((i) => i.selected)
        .map((i) => Number(i.size))
        .reduce((acc, val) => acc + val, 0),
    // eslint-disable-next-line no-useless-escape
    "#Dataset\\[(\\d+)\\]Field\\[(\\w+)\\]": (m) =>
      jsonObject.datasets[Number(m[1])][m[2]],
    "#DatasetsPid": (m) => jsonObject.datasets?.map((i) => i.pid),
    "#DatasetsFilesPath": (m) =>
      jsonObject.datasets
        ?.map((i) => i.files)
        .flat()
        .map((i) => i.path),
    "#DatasetsFilesTotalSize": (m) =>
      jsonObject.datasets
        ?.map((i) => i.files)
        .flat()
        .map((i) => Number(i.size))
        .reduce((acc, val) => acc + val, 0),
    "#DatasetsSourceFolder": (m) =>
      jsonObject.datasets?.map((i) => i.sourceFolder),
    "#DatasetsSelectedFilesPath": (m) =>
      jsonObject.datasets
        ?.map((i) => i.files)
        .flat()
        .filter((i) => i.selected)
        .map((i) => i.path),
    "#DatasetsSelectedFilesCount": (m) =>
      jsonObject.datasets
        ?.map((i) => i.files)
        .flat()
        .filter((i) => i.selected).length,
    "#DatasetsSelectedFilesTotalSize": (m) =>
      jsonObject.datasets
        ?.map((i) => i.files)
        .flat()
        .filter((i) => i.selected)
        .map((i) => Number(i.size))
        .reduce((acc, val) => acc + val, 0),
    // eslint-disable-next-line no-useless-escape
    "#DatasetsField\\[(\\w+)\\]": (m) =>
      jsonObject.datasets.map((i) => i[m[1]]),
  };

  // Check for direct pattern matches
  for (const [pattern, fn] of Object.entries(keywordMap)) {
    const match = selector.match(new RegExp(pattern));

    if (match) {
      const res = fn(match);

      return res;
    }
  }

  // No pattern matched, return selector itself
  return selector;
}

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
  isAdmin$ = this.store.select(selectIsAdmin);

  jwt = "";
  use_mat_icon = false;
  use_icon = false;
  disabled_condition = "false";
  variables: Record<string, any> = {};

  form: HTMLFormElement = null;

  subscriptions: Subscription[] = [];

  userProfile: any = {};
  isAdmin = false;

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
    return (
      condition
        // Handle #Length({{ files }})
        .replace(
          // eslint-disable-next-line no-useless-escape
          /\#Length\(\s*\@(\w+)\s*\)/g,
          (_, variableName) => `variables.${variableName}.length`,
        )
        // Handle #MaxDownloadableSize({{ totalSize }})
        .replace(
          ///#MaxDownloadableSize\(\{\{\s(\w+)\s\}\}\)/g,
          // eslint-disable-next-line no-useless-escape
          /\#MaxDownloadableSize\(@*(\w+)\)/g,
          (_, variableName) =>
            `variables.${variableName} <= maxDownloadableSize`,
        )
        // eslint-disable-next-line no-useless-escape
        .replace(/\#datasetOwner/g, (_) => `datasetOwner`)
        // eslint-disable-next-line no-useless-escape
        .replace(/\#userIsAdmin/g, (_) => `isAdmin`)
        // eslint-disable-next-line no-useless-escape
        .replace(/\@(\w+)/g, (_, variableName) => `variables.${variableName}`)
    );
  }

  private prepare_disabled_condition() {
    if (this.actionConfig.enabled) {
      this.disabled_condition =
        "!(" + this.prepare_action_condition(this.actionConfig.enabled) + ")";
    } else if (this.actionConfig.disabled) {
      this.disabled_condition = this.prepare_action_condition(
        this.actionConfig.disabled,
      );
    } else {
      this.disabled_condition = "false";
    }
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
    this.subscriptions.push(
      this.isAdmin$.subscribe((isAdmin) => {
        if (isAdmin) {
          this.isAdmin = isAdmin;
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
    Object.entries(this.actionConfig.variables ?? {}).forEach(
      ([key, selector]) => {
        this.variables[key] = processSelector(this.actionItems, selector);
      },
    );
  }

  get context() {
    return {
      variables: this.variables,
      maxDownloadableSize: this.configService.getConfig().maxDirectDownloadSize,
      datasetOwner: (
        this.actionItems.datasets.map((d): boolean => {
          return this.userProfile.accessGroups?.includes(d.ownerGroup) || false;
        }) as Array<boolean>
      ).some(Boolean),
      isAdmin: this.isAdmin,
    };
  }

  get disabled() {
    this.update_status();

    const expr = this.disabled_condition;
    const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);
    const context = this.context;
    const res = fn(context);
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
        maxDownloadableSize:
          this.configService.getConfig().maxDirectDownloadSize,
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
      case "json-download":
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
        const itemInput = input.slice(0, -2);

        const iteratable = Array.isArray(value) ? value : [value];
        iteratable.forEach((itemValue, itemIndex) => {
          this.form.appendChild(
            this.add_input(`${itemInput}[${itemIndex}]`, itemValue),
          );
        });
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
    if (this.actionConfig.payload == "#dump") {
      payload = JSON.stringify(this.variables);
    } else if (
      this.actionConfig.payload != "#empty" &&
      this.actionConfig.payload
    ) {
      payload = this.actionConfig.payload;
    }

    const readyPayload = payload.replace(
      /\{\{\s*([@#]\w+(\[\])?)\s*\}\}/g,
      (_, variableName) => {
        if (variableName.endsWith("[]")) {
          const variableNameClean = variableName.slice(0, -2);
          const value = this.get_value_from_definition(variableNameClean);

          const iteratable = !value
            ? []
            : Array.isArray(value)
              ? value
              : [value];
          return JSON.stringify(iteratable);
        } else {
          return this.get_value_from_definition(variableName);
        }
      },
    );

    return readyPayload;
  }

  type_json_to_download() {
    const filename = this.actionConfig.filename.replace(
      /{{\s*(\w+)\s*}}/g,
      (_, variableName) => this.get_value_from_definition(variableName),
    );

    fetch(this.actionConfig.url, {
      method: this.actionConfig.method || "POST",
      headers: {
        ...{
          "Content-Type": "application/json",
        },
        ...(this.actionConfig.headers || {}),
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
    const url = this.actionConfig.url.replace(
      /{{\s*(\w+)\s*}}/g,
      (_, variableName) =>
        encodeURIComponent(this.get_value_from_definition(variableName)),
    );

    fetch(url, {
      method: this.actionConfig.method || "POST",
      headers: {
        ...{
          "Content-Type": "application/json",
        },
        ...(this.actionConfig.headers || {}),
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
    window.open(this.actionConfig.url, this.actionConfig.target || "_self");
  }
}
