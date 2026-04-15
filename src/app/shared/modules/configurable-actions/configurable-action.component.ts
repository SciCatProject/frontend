import {
  Input,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import {
  ActionConfig,
  ActionExecutionContext,
  ActionItems,
  ActionValue,
} from "./configurable-action.interfaces";
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
  variables: Record<string, ActionValue> = {};

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
          (_, variableName) => `(variables.${variableName}?.length ?? 0)`,
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
        .replace(/\#uuid/g, (_) => v4())
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
    try {
      this.prepare_disabled_condition();
      this.update_status();
    } catch (error) {
      console.error("Configurable action error on init", error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["actionItems"]) {
      try {
        this.update_status();
      } catch (error) {
        console.error("Configurable action error on changes", error);
      }
    }
  }

  update_status(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    Object.entries(actionConfig.variables ?? {}).forEach(([key, selector]) => {
      runtimeVariables[key] = this.get_value_from_definition(
        selector,
        runtimeVariables,
      ) as ActionValue;
    });
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
    let res = false;
    try {
      this.update_status();

      const expr = this.disabled_condition;
      const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);
      const { context } = this;
      res = fn(context);
    } catch (error) {
      console.error("Configurable action error on get disabled", error);
    }
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
      case "workflow": {
        const runtimeVariables: Record<string, ActionValue> = {
          ...this.variables,
        };
        return this.type_workflow(this.actionConfig, runtimeVariables).then(
          (success) => {
            this.variables = {
              ...this.variables,
              ...runtimeVariables,
            };
            return success;
          },
        );
      }
      case "local":
        return this.type_local();
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

  get_value_from_definition(
    definition: string,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    if (
      definition?.startsWith("#Dataset") ||
      definition?.startsWith("#Datasets")
    ) {
      return processSelector(this.actionItems, definition);
    }

    if (definition == "#token" || definition == "#tokenSimple") {
      return this.authService.getToken().id;
    } else if (definition == "#tokenBearer") {
      return `Bearer ${this.authService.getToken().id}`;
    } else if (definition == "#jwt") {
      return this.jwt;
    } else if (definition == "#lbBaseURL") {
      return this.configService.getConfig().lbBaseURL;
    } else if (definition == "#uuid") {
      return v4();
    } else if (definition.startsWith("@")) {
      return runtimeVariables[definition.slice(1)];
    }
    return definition;
  }

  private resolve_template(
    template: string,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ): string {
    return (template || "").replace(
      /\{\{\s*([@#]\w+)\s*\}\}/g,
      (_, variableName) =>
        String(
          this.get_value_from_definition(variableName, runtimeVariables) ?? "",
        ),
    );
  }

  get_auth_headers(headers: Record<string, string>) {
    const headerKey = "Authorization";
    if (headerKey in headers) {
      const currentValue = headers[headerKey];
      const updatedValue = this.get_value_from_definition(currentValue);

      headers[headerKey] = updatedValue;
    }
    return headers;
  }

  type_form(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    if (this.form !== null) {
      document.body.removeChild(this.form);
    }

    this.form = document.createElement("form");
    this.form.target = actionConfig.target || "_self";
    this.form.method = actionConfig.method || "POST";
    this.form.action = this.resolve_template(
      actionConfig.url || "",
      runtimeVariables,
    );
    this.form.style.display = "none";

    // use the configuration under inputs to create the form
    Object.entries(actionConfig.inputs || {}).forEach(([input, definition]) => {
      const value = this.get_value_from_definition(
        definition,
        runtimeVariables,
      );

      if (input.endsWith("[]")) {
        const itemInput = input.slice(0, -2);

        const iteratable = Array.isArray(value) ? value : [value];
        iteratable.forEach((itemValue, itemIndex) => {
          this.form.appendChild(
            this.add_input(
              `${itemInput}[${itemIndex}]`,
              String(itemValue ?? ""),
            ),
          );
        });
      } else {
        this.form.appendChild(this.add_input(input, String(value ?? "")));
      }
    });

    document.body.appendChild(this.form);
    this.form.submit();

    return true;
  }

  get_payload(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    let payload = "";
    if (actionConfig.payload == "#dump") {
      payload = JSON.stringify(runtimeVariables);
    } else if (actionConfig.payload != "#empty" && actionConfig.payload) {
      payload = actionConfig.payload;
    }

    const readyPayload = payload.replace(
      /\{\{\s*([@#]\w+(\[\])?)\s*\}\}/g,
      (_, variableName) => {
        if (variableName.endsWith("[]")) {
          const variableNameClean = variableName.slice(0, -2);
          const value = this.get_value_from_definition(
            variableNameClean,
            runtimeVariables,
          );

          const iteratable = !value
            ? []
            : Array.isArray(value)
              ? value
              : [value];
          return JSON.stringify(iteratable);
        } else {
          return this.get_value_from_definition(variableName, runtimeVariables);
        }
      },
    );

    return readyPayload;
  }

  type_json_to_download(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    const filename = (actionConfig.filename || "download").replace(
      /\{\{\s*([@#]\w+)\s*\}\}/g,
      (_, variableName) =>
        String(
          this.get_value_from_definition(variableName, runtimeVariables) ?? "",
        ),
    );

    const method = actionConfig.method || "POST";
    const payload = this.get_payload(actionConfig, runtimeVariables);
    const headers = this.get_auth_headers(actionConfig.headers || {});
    fetch(this.resolve_template(actionConfig.url || "", runtimeVariables), {
      method: method,
      headers: {
        ...{
          "Content-Type": "application/json",
        },
        ...(headers || {}),
      },
      body: payload,
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
    void this.type_xhr_async(this.actionConfig, this.variables);
    return true;
  }

  private async type_xhr_async(
    actionConfig: ActionConfig,
    runtimeVariables: Record<string, ActionValue>,
  ): Promise<boolean> {
    const url = this.resolve_template(actionConfig.url || "", runtimeVariables);
    const headers = this.get_auth_headers(actionConfig.headers || {});

    try {
      const response = await fetch(url, {
        method: actionConfig.method || "POST",
        headers: {
          ...{
            "Content-Type": "application/json",
          },
          ...(headers || {}),
        },
        body: this.get_payload(actionConfig, runtimeVariables),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error code: ${response.status}`);
      }

      return true;
    } catch (error) {
      runtimeVariables.lastErrorMessage =
        error instanceof Error ? error.message : "HTTP request failed";
      if (!actionConfig.onError?.length) {
        this.snackBar.open(
          "There has been an error performing the action",
          "Close",
          {
            duration: 2000,
          },
        );
      }
      return false;
    }
  }

  type_link(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ) {
    window.open(
      this.resolve_template(actionConfig.url || "", runtimeVariables),
      actionConfig.target || "_self",
    );
    return true;
  }

  private is_variable_map(
    value: unknown,
  ): value is Record<string, ActionValue> {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  private merge_handler_result(
    handlerResult: unknown,
    runtimeVariables: Record<string, ActionValue>,
  ): void {
    if (this.is_variable_map(handlerResult)) {
      Object.assign(runtimeVariables, handlerResult);
    }
  }

  private create_execution_context(
    actionConfig: ActionConfig,
    runtimeVariables: Record<string, ActionValue>,
    result?: unknown,
    error?: unknown,
  ): ActionExecutionContext {
    return {
      variables: { ...runtimeVariables },
      actionItems: this.actionItems,
      actionConfig,
      result,
      error,
    };
  }

  private async type_local_async(
    actionConfig: ActionConfig,
    runtimeVariables: Record<string, ActionValue>,
  ): Promise<boolean> {
    const handlerName = actionConfig.handler;
    if (!handlerName) {
      return false;
    }

    const handler = this.actionItems.handlers?.[handlerName];
    if (!handler) {
      return false;
    }

    const context = this.create_execution_context(
      actionConfig,
      runtimeVariables,
    );
    try {
      const handlerResult = await handler(context);
      if (handlerResult === false) {
        return false;
      }
      this.merge_handler_result(handlerResult, runtimeVariables);
      return true;
    } catch (error) {
      runtimeVariables.lastErrorMessage =
        error instanceof Error ? error.message : "Action failed";
      return false;
    }
  }

  type_local() {
    const handlerName = this.actionConfig.handler;
    if (!handlerName) {
      return false;
    }

    const handler = this.actionItems.handlers?.[handlerName];
    if (!handler) {
      return false;
    }

    const context = this.create_execution_context(
      this.actionConfig,
      this.variables,
    );
    try {
      const handlerResult = handler(context);
      if (handlerResult instanceof Promise) {
        void handlerResult.then((resolvedResult) => {
          this.merge_handler_result(resolvedResult, this.variables);
        });
      } else {
        this.merge_handler_result(handlerResult, this.variables);
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  private async execute_actions(
    actions: ActionConfig[],
    runtimeVariables: Record<string, ActionValue>,
  ): Promise<boolean> {
    for (const action of actions) {
      const success = await this.execute_action(action, runtimeVariables);
      if (!success) {
        return false;
      }
    }
    return true;
  }

  private async execute_action(
    actionConfig: ActionConfig,
    runtimeVariables: Record<string, ActionValue>,
  ): Promise<boolean> {
    this.update_status(actionConfig, runtimeVariables);

    let success = true;
    const actionType = actionConfig.type || "form";
    switch (actionType) {
      case "workflow":
        success = await this.type_workflow(actionConfig, runtimeVariables);
        break;
      case "local":
        success = await this.type_local_async(actionConfig, runtimeVariables);
        break;
      case "xhr":
        success = await this.type_xhr_async(actionConfig, runtimeVariables);
        break;
      case "json-download":
        success = this.type_json_to_download(actionConfig, runtimeVariables);
        break;
      case "link":
        success = this.type_link(actionConfig, runtimeVariables);
        break;
      case "form":
      default:
        success = this.type_form(actionConfig, runtimeVariables);
        break;
    }

    if (success && actionConfig.onSuccess?.length) {
      await this.execute_actions(actionConfig.onSuccess, runtimeVariables);
    }

    if (!success && actionConfig.onError?.length) {
      await this.execute_actions(actionConfig.onError, runtimeVariables);
    }

    return success;
  }

  private async type_workflow(
    actionConfig: ActionConfig = this.actionConfig,
    runtimeVariables: Record<string, ActionValue> = this.variables,
  ): Promise<boolean> {
    if (!actionConfig.actions?.length) {
      return false;
    }

    return this.execute_actions(actionConfig.actions, runtimeVariables);
  }
}
