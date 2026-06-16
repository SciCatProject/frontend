import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  DatasetClass,
  UsersService,
} from "@scicatproject/scicat-sdk-ts-angular";
import {
  ActionButtonStyle,
  ActionConfig,
  ActionItemDataset,
  ActionItems,
  ActionType,
  DialogField,
} from "./configurable-action.interfaces";
import { AuthService } from "shared/services/auth/auth.service";
import { v4 as uuidv4 } from "uuid";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";
import { DialogComponent, DynamicDialogData } from "../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import _ from "lodash";

@Component({
  selector: "configurable-action",
  templateUrl: "./configurable-action.component.html",
  styleUrls: ["./configurable-action.component.scss"],
  standalone: false,
})
export class ConfigurableActionComponent
  implements OnInit, OnChanges, OnDestroy
{
  private authorizationTokens = {
    "#jwt": () => this.jwt,
    "#token": () => this.authService.getToken()?.id,
    "#tokenSimple": () => this.authService.getToken()?.id,
    "#tokenBearer": () => `Bearer ${this.authService.getToken()?.id}`,
    "#uuid": () => uuidv4(),
  };

  @Input({ required: true }) actionConfig: ActionConfig;
  @Input({ required: true }) actionItems: ActionItems;
  @Input({ required: false }) buttonStyle: ActionButtonStyle = {
    raised: true,
    color: "accent",
  };
  @Output() actionFinished = new EventEmitter<{
    success: boolean;
    result?: unknown;
    error?: Error;
  }>();

  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);

  jwt = "";
  useMatIcon = false;
  useIcon = false;

  variables: Record<string, unknown> = {};
  userProfile: Record<string, unknown> = {};
  isAdmin = false;
  subscriptions: Subscription[] = [];
  form: HTMLFormElement | null = null;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private configService: AppConfigService,
    private snackBar: MatSnackBar,
    private store: Store,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.usersService.usersControllerGetUserJWTV3().subscribe((jwt) => {
      this.jwt = jwt.jwt;
    });
  }

  private interpolateCrossReferences(selector: string): string {
    if (!selector.includes("@")) return selector;

    // Matches @variableName or @variableName[0] or @variableName.path
    return selector.replace(/@([\w.[\]]+)/g, (__, path) => {
      const value = _.get(this.variables, path);
      return value !== undefined ? String(value) : "";
    });
  }

  private variableHandler(selector: unknown): unknown {
    if (typeof selector !== "string") return selector;

    let processedSelector = this.interpolateCrossReferences(selector);
    processedSelector = this.parseVariableTokens(processedSelector);
    const dynamicKey = Object.keys(this.actionItems).find((key) =>
      processedSelector.startsWith(`#${key}`),
    );

    if (dynamicKey)
      return this.dynamicVariableHandler(processedSelector, dynamicKey);

    const staticMap = this.buildDatasetStaticMap();
    if (processedSelector in staticMap) return staticMap[processedSelector]();

    if (processedSelector.includes("Field["))
      return this.fieldMatch(processedSelector);

    return processedSelector;
  }

  private dynamicVariableHandler(
    selector: string,
    dynamicKey: string,
  ): unknown {
    if (selector === `#${dynamicKey}`) return this.actionItems[dynamicKey];
    const path = selector.slice(dynamicKey.length + 2);
    return _.get(this.actionItems[dynamicKey], path);
  }

  private parseVariableTokens(selector: string): string {
    if (!selector.includes("#date_format")) return selector;

    return selector.replace(
      /#date_format\(([^,]+),\s*([^)]+)\)/g,
      (_, dateInput, format) => {
        const date = new Date(dateInput.trim());
        if (isNaN(date.getTime())) return "";
        return this.datePipe.transform(date, format.trim()) || "";
      },
    );
  }

  private fieldMatch(selector: string): unknown {
    const datasets = _.get(
      this.actionItems,
      "datasets",
      [],
    ) as ActionItemDataset[];
    const allFieldMatch = selector.match(/^#DatasetsField\[(\w+)\]$/);
    if (allFieldMatch) return _.map(datasets, allFieldMatch[1]);
    const datasetFieldMatch = selector.match(
      /^#Dataset\[(\d+)\]Field\[(\w+)\]$/,
    );
    if (datasetFieldMatch) {
      const index = Number(datasetFieldMatch[1]);
      const field = datasetFieldMatch[2];
      return _.get(datasets, `[${index}].${field}`);
    }

    const instrumentFieldMatch = selector.match(
      /^#Instruments\[(\d+)\]Field\[(\w+)\]$/,
    );
    if (instrumentFieldMatch) {
      const index = Number(instrumentFieldMatch[1]);
      const field = instrumentFieldMatch[2];
      return _.get(this.actionItems, `instruments[${index}].${field}`);
    }

    return undefined;
  }

  private buildDatasetStaticMap() {
    const datasets = _.get(
      this.actionItems,
      "datasets",
      [],
    ) as ActionItemDataset[];
    const ds0 = _.get(datasets, "[0]");

    const staticMap: Record<string, () => unknown> = {
      "#Dataset0Pid": () => ds0?.pid,
      "#Dataset0SourceFolder": () => ds0?.sourceFolder,
      "#Dataset0FilesPath": () => _.map(ds0?.files, "path"),
      "#Dataset0FilesTotalSize": () =>
        _.sumBy(ds0?.files, (f) => Number(f.size || 0)),
      "#Dataset0SelectedFilesPath": () =>
        _(ds0?.files).filter("selected").map("path").value(),
      "#Dataset0SelectedFilesCount": () =>
        _(ds0?.files).filter("selected").size(),
      "#Dataset0SelectedFilesTotalSize": () =>
        _(ds0?.files)
          .filter("selected")
          .sumBy((f) => Number(f.size || 0)),
      "#DatasetsPid": () => _.map(datasets, "pid"),
      "#DatasetsSourceFolder": () => _.map(datasets, "sourceFolder"),
      "#DatasetsFilesPath": () =>
        _(datasets).flatMap("files").map("path").value(),
      "#DatasetsFilesTotalSize": () =>
        _(datasets)
          .flatMap("files")
          .sumBy((f) => Number(f.size || 0)),
      "#DatasetsSelectedFilesPath": () =>
        _(datasets).flatMap("files").filter("selected").map("path").value(),
      "#DatasetsSelectedFilesCount": () =>
        _(datasets).flatMap("files").filter("selected").size(),
      "#DatasetsSelectedFilesTotalSize": () =>
        _(datasets)
          .flatMap("files")
          .filter("selected")
          .sumBy((f) => Number(f.size || 0)),
    };
    return staticMap;
  }

  private viewHandlers(condition: string): string {
    let expr = condition;
    const symbols: Record<string, string> = {
      "#datasetOwner": "context.isOwner",
      "#userIsAdmin": "context.isAdmin",
      "#isPublished": String(
        this.actionItems.datasets?.[0]?.isPublished === true,
      ),
      "#!isPublished": String(
        this.actionItems.datasets?.[0]?.isPublished === false,
      ),
    };

    Object.entries(symbols).forEach(([k, v]) => (expr = expr.replaceAll(k, v)));
    expr = expr.replace(/@([\w.]+)/g, "variables.$1");
    expr = expr.replace(/#Length\((.*?)\)/g, "($1?.length ?? 0)");
    expr = expr.replace(
      /#MaxDownloadableSize\((.*?)\)/g,
      "$1 <= context.maxSize",
    );

    return expr;
  }

  private authorizationHandlers(definition: string): string {
    return this.authorizationTokens[definition]?.() ?? definition;
  }

  private resolve(definition: string): unknown {
    if (definition.startsWith("@"))
      return _.get(this.variables, definition.slice(1));
    if (definition in this.authorizationTokens)
      return this.authorizationHandlers(definition);
    return definition;
  }

  private interpolate(template: string): string {
    if (!template) return "";
    return template.replace(
      /\{\{\s*([@#][\w.]+(\[\])?)\s*\}\}/g,
      (fullMatch, match) => {
        const isArray = match.endsWith("[]");
        const clean = match.replace("[]", "");

        const value = this.resolve(clean);
        return isArray
          ? JSON.stringify(_.castArray(value ?? []))
          : String(value ?? "");
      },
    );
  }

  private evaluate(expr: string): boolean {
    try {
      const context = {
        variables: this.variables,
        context: {
          isAdmin: this.isAdmin,
          isOwner: this.isDatasetOwner,
          maxSize: this.configService.getConfig().maxDirectDownloadSize,
        },
      };
      const fn = new Function("ctx", `with(ctx){ return ${expr}; }`);
      return fn(context);
    } catch (e) {
      console.error("Evaluation error:", expr, e);
      return false;
    }
  }

  private get isDatasetOwner(): boolean {
    const datasets = _.get(this.actionItems, "datasets", []) as DatasetClass[];
    const userGroups = _.get(this.userProfile, "accessGroups", []) as string[];
    return _.some(datasets, (d) => userGroups.includes(d.ownerGroup));
  }

  private buildDependenciesGraph(
    variables: Record<string, unknown>,
  ): Record<string, Set<string>> {
    /**
     * Builds a dependency graph for configured variables.
     *
     * Each graph entry maps a variable name to the set of other variables it
     * references with `@variableName` syntax. The graph is later used to resolve
     * variables in dependency order.
     */
    const graph: Record<string, Set<string>> = {};
    Object.entries(variables).forEach(([key, value]) => {
      const deps: string[] = [];
      if (typeof value === "string") {
        const matches = value.matchAll(/@(\w+)/g);
        for (const match of matches) {
          deps.push(match[1]);
        }
      }
      graph[key] = new Set(deps);
    });
    return graph;
  }

  private resolveVariableContext(): void {
    /**
     * Resolves all variables declared in the action configuration.
     *
     * Variable definitions can reference other variables with `@name` and can
     * read array entries with `@name[index]`. Dependencies are resolved first,
     * then the final value is passed through variableHandler so configured
     * selectors are converted cleanly.
     */
    const variablesConfig = this.actionConfig.variables ?? {};
    const depsGraph = this.buildDependenciesGraph(variablesConfig);
    const visited: Set<string> = new Set();

    const resolveVariable = (varKey: string): unknown => {
      const deps = depsGraph[varKey] ?? new Set<string>();

      for (const dep of deps) {
        if (!(dep in this.variables)) {
          if (visited.has(dep)) {
            console.error(`Cyclic dependency detected in variable ${dep}`);
            continue;
          }
          visited.add(dep);
          this.variables[dep] = resolveVariable(dep);
        }
      }

      const varDef = variablesConfig[varKey];
      return this.variableHandler(varDef);
    };

    Object.keys(variablesConfig).forEach((key) => {
      if (!(key in this.variables)) {
        this.variables[key] = resolveVariable(key);
      }
    });
  }

  private typeXhr() {
    const url = this.interpolate(this.actionConfig.url);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    Object.entries(this.actionConfig.headers || {}).forEach(([k, v]) => {
      headers[k] = String(this.resolve(v));
    });

    fetch(url, {
      method: this.actionConfig.method || "POST",
      headers,
      body: this.preparePayload(),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json().catch(() => ({}));

        this.actionFinishedEmit(true, data);
      })
      .catch((err: Error) => {
        this.snackBar.open("Action failed", "Close", { duration: 2000 });
        this.actionFinishedEmit(false, err);
      });
    return true;
  }

  private typeForm() {
    if (this.form) document.body.removeChild(this.form);
    this.form = document.createElement("form");
    this.form.target = this.actionConfig.target || "_self";
    this.form.method = this.actionConfig.method || "POST";
    this.form.action = this.actionConfig.url;
    this.form.style.display = "none";

    Object.entries(this.actionConfig.inputs || {}).forEach(([input, def]) => {
      const value = this.resolve(def);

      if (input.endsWith("[]")) {
        const name = input.slice(0, -2);
        _.castArray(value).forEach((v, i) =>
          this.form!.appendChild(
            this.addInputElement(`${name}[${i}]`, String(v)),
          ),
        );
      } else {
        this.form!.appendChild(this.addInputElement(input, String(value)));
      }
    });

    document.body.appendChild(this.form);
    this.form.submit();
    return true;
  }

  private preparePayload(): string {
    const { payload } = this.actionConfig;
    if (payload === "#dump") return JSON.stringify(this.variables);
    if (!payload || payload === "#empty") return "{}";
    return this.interpolate(payload);
  }

  private typeJsonToDownload() {
    const filename = this.interpolate(
      this.actionConfig.filename || "download.json",
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    Object.entries(this.actionConfig.headers || {}).forEach(([k, v]) => {
      headers[k] = String(this.resolve(v));
    });

    fetch(this.actionConfig.url, {
      method: this.actionConfig.method || "POST",
      headers,
      body: this.preparePayload(),
    })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() =>
        this.snackBar.open("Download failed", "Close", { duration: 2000 }),
      );
    return true;
  }

  private typeLink() {
    window.open(this.actionConfig.url, this.actionConfig.target || "_self");
  }

  private typeDialog() {
    const dialogData = this.prepareDialogData();
    if (!dialogData) return;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.actionConfig.dialog?.width || "450px",
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: Record<string, unknown> | undefined) => {
        if (!result) return;
        const dialogRes: Record<string, unknown> = {};
        this.actionConfig.dialog?.fields?.forEach((f) => {
          const v = result[f.key];
          dialogRes[f.key] =
            v && typeof v === "object" && "option" in v
              ? (v as Record<string, unknown>).option
              : v;
        });
        this.variables["dialog"] = dialogRes;
        if (this.actionConfig.onSuccess)
          try {
            this.executeNextStep(this.actionConfig.onSuccess);
          } catch (error) {
            console.error("Configurable action error on dialog success", error);
          }
      });
  }

  private executeNextStep(nextStep: ActionType) {
    try {
      if (nextStep === "xhr") this.typeXhr();
      if (nextStep === "form") this.typeForm();
      if (nextStep === "json-download") this.typeJsonToDownload();
      else console.warn("Unsupported onSuccess action type:", nextStep);
    } catch (error) {
      console.error("Configurable action error on execute next step", error);
    }
  }

  private addInputElement(name: string, value: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  private prepareDialogData(): DynamicDialogData | null {
    const conf = this.actionConfig.dialog;
    if (!conf) return null;
    const data: DynamicDialogData = {
      title: conf.title || "Confirm",
      question: conf.description || "",
      additionalFields: {},
    };

    conf.fields?.forEach((f: DialogField) => {
      data.additionalFields![f.key] = {
        label: f.label,
        type: f.type,
        required: f.required,
        options: f.options?.map((opt) => {
          if (typeof opt === "string") return { option: opt };
          return {
            option: opt.option,
            tooltip: opt.tooltip,
          };
        }),
      };
    });

    return data;
  }

  private actionFinishedEmit(success: boolean, payload?: unknown) {
    this.actionFinished.emit({
      success,
      result: success ? payload : undefined,
      error: !success ? (payload as Error) : undefined,
    });
  }

  get visible(): boolean {
    try {
      this.resolveVariableContext();
      if (!this.actionConfig.hidden) return true;
      return !this.evaluate(this.viewHandlers(this.actionConfig.hidden));
    } catch (error) {
      console.error("Configurable action error on get visible", error);
      return false;
    }
  }

  get disabled(): boolean {
    try {
      this.resolveVariableContext();
      const raw = this.actionConfig.enabled
        ? `!(${this.actionConfig.enabled})`
        : this.actionConfig.disabled || "false";
      return this.evaluate(this.viewHandlers(raw));
    } catch (error) {
      console.error("Configurable action error on get disabled", error);
      return true;
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userProfile$.subscribe(
        (up) => up && (this.userProfile = up as Record<string, unknown>),
      ),
    );
    this.subscriptions.push(
      this.isAdmin$.subscribe((ia) => (this.isAdmin = ia)),
    );
    this.useMatIcon = !!this.actionConfig.mat_icon;
    this.useIcon = this.actionConfig.icon !== undefined;
    try {
      this.resolveVariableContext();
    } catch (error) {
      console.error("Configurable action error on init", error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["actionItems"]) {
      try {
        this.resolveVariableContext();
      } catch (error) {
        console.error("Configurable action error on changes", error);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  performAction() {
    this.resolveVariableContext();
    const type = this.actionConfig.type || "form";
    switch (type) {
      case "json-download":
        return this.typeJsonToDownload();
      case "xhr":
        return this.typeXhr();
      case "link":
        return this.typeLink();
      case "dialog":
        return this.typeDialog();
      case "form":
      default:
        return this.typeForm();
    }
  }
}
