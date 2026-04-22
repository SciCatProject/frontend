import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
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
export class ConfigurableActionComponent implements OnInit, OnChanges {
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
  userProfile: any = {};
  isAdmin = false;
  subscriptions: Subscription[] = [];
  form: HTMLFormElement | null = null;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private configService: AppConfigService,
    private snackBar: MatSnackBar,
    private store: Store,
    public dialog: MatDialog,
  ) {
    this.usersService.usersControllerGetUserJWTV3().subscribe((jwt) => {
      this.jwt = jwt.jwt;
    });
  }

  private variableHandler(selector: string): unknown {
    const dynamicKey = Object.keys(this.actionItems).find((key) =>
      selector.startsWith(`#${key}`),
    );

    if (dynamicKey) return this.dynamicVariableHandler(selector, dynamicKey);

    const staticMap = this.buildDatasetStaticMap();

    if (selector in staticMap) return staticMap[selector]();

    if (selector.includes("Field[")) return this.fieldMatch(selector);

    return undefined;
  }

  private dynamicVariableHandler(
    selector: string,
    dynamicKey: string,
  ): unknown {
    if (selector === `#${dynamicKey}`) return this.actionItems[dynamicKey];
    const path = selector.slice(dynamicKey.length + 2);
    return _.get(this.actionItems[dynamicKey], path);
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

  private resolveVariableContext() {
    Object.entries(this.actionConfig.variables ?? {}).forEach(
      ([key, selector]) => {
        this.variables[key] = this.variableHandler(selector);
      },
    );
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
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.actionConfig.dialog?.width || "450px",
      data: this.prepareDialogData(),
    });

    dialogRef.afterClosed().subscribe((result: Record<string, any>) => {
      if (!result) return;
      const dialogRes: Record<string, any> = {};
      this.actionConfig.dialog?.fields?.forEach((f) => {
        const v = result[f.key];
        dialogRes[f.key] =
          v && typeof v === "object" && "option" in v ? v.option : v;
      });
      this.variables["dialog"] = dialogRes;
      if (this.actionConfig.onSuccess)
        this.executeNextStep(this.actionConfig.onSuccess);
    });
  }

  private executeNextStep(nextStep: ActionType) {
    if (nextStep === "xhr") this.typeXhr();
    if (nextStep === "form") this.typeForm();
    if (nextStep === "json-download") this.typeJsonToDownload();
  }

  private addInputElement(name: string, value: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  private prepareDialogData(): DynamicDialogData {
    const conf = this.actionConfig.dialog!;
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
            thumbnail: (opt as any).thumbnail || null,
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
    this.resolveVariableContext();
    if (!this.actionConfig.hidden) return true;
    return !this.evaluate(this.viewHandlers(this.actionConfig.hidden));
  }

  get disabled(): boolean {
    this.resolveVariableContext();
    const raw = this.actionConfig.enabled
      ? `!(${this.actionConfig.enabled})`
      : this.actionConfig.disabled || "false";
    return this.evaluate(this.viewHandlers(raw));
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userProfile$.subscribe((up) => up && (this.userProfile = up)),
    );
    this.subscriptions.push(
      this.isAdmin$.subscribe((ia) => (this.isAdmin = ia)),
    );
    this.useMatIcon = !!this.actionConfig.mat_icon;
    this.useIcon = this.actionConfig.icon !== undefined;
    this.resolveVariableContext();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["actionItems"]) this.resolveVariableContext();
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
