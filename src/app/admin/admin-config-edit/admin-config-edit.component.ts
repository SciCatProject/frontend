import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { updateConfiguration } from "state-management/actions/runtime-config.action";
import { selectConfig } from "state-management/selectors/runtime-config.selectors";
import schema from "../schema/frontend.config.jsonforms.json";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import {
  accordionArrayLayoutRendererTester,
  AccordionArrayLayoutRendererComponent,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";
import { map, Subscription, take } from "rxjs";
import {
  expandGroupTester,
  ExpandGroupRendererComponent,
} from "shared/modules/jsonforms-custom-renderers/expand-group-renderer/expand-group-renderer";
import {
  ArrayLayoutRendererCustom,
  arrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/ingestor-renderer/array-renderer";
import { MatDialog } from "@angular/material/dialog";
import { JsonPreviewDialogComponent } from "shared/modules/json-preview-dialog/json-preview-dialog.component";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { AppConfigInterface } from "app-config.service";

@Component({
  selector: "admin-config-edit",
  templateUrl: "./admin-config-edit.component.html",
  styleUrls: ["./admin-config-edit.component.scss"],
  standalone: false,
})
export class AdminConfigEditComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  config$ = this.store.select(selectConfig);
  data$ = this.config$.pipe(
    map((cfg) => (cfg.data ? this.toFormData(cfg.data) : null)),
  );

  currentData: AppConfigInterface;
  schema: JsonSchema = schema.schema || {};
  uiSchema: UISchemaElement = schema.uiSchema;
  renderers = [
    ...angularMaterialRenderers,
    {
      tester: accordionArrayLayoutRendererTester,
      renderer: AccordionArrayLayoutRendererComponent,
    },
    {
      tester: expandGroupTester,
      renderer: ExpandGroupRendererComponent,
    },
    {
      tester: arrayLayoutRendererTester,
      renderer: ArrayLayoutRendererCustom,
    },
  ];
  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.data$.pipe(take(1)).subscribe((d) => (this.currentData = d)),
    );
  }

  onChange(event: any) {
    this.currentData = event;
  }

  save() {
    const apiData = this.toApiData(this.currentData);

    this.store.dispatch(
      updateConfiguration({ id: "frontendConfig", config: apiData }),
    );
  }

  jsonPreview() {
    const apiData = this.toApiData(this.currentData);

    this.dialog.open(JsonPreviewDialogComponent, {
      width: "90vw",
      maxHeight: "90vh",
      data: apiData,
    });
  }

  export() {
    const apiData = this.toApiData(this.currentData);
    const json = JSON.stringify(apiData, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `frontend-config-${new Date().toLocaleString("sv-SE")}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  // TODO: temp conversion functions, to be removed later
  toArray(obj: any) {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
  // TODO: temp conversion functions, to be removed later
  toObject(arr: any) {
    if (!arr?.length) return {};

    return Object.fromEntries(arr.map((i) => [i.key, i.value]));
  }

  // TODO: temp conversion functions, to be removed later
  private toFormData(data: any) {
    const d = structuredClone(data);

    // Convert dynamic object to array with key and value properties

    if (d.labelsLocalization.dataset) {
      d.labelsLocalization.dataset = this.toArray(d.labelsLocalization.dataset);
    }
    if (d.labelsLocalization.proposal) {
      d.labelsLocalization.proposal = this.toArray(
        d.labelsLocalization.proposal,
      );
    }
    if (d.datafilesActions) {
      d.datafilesActions = d.datafilesActions.map((a: any) => ({
        ...a,
        variables:
          a.variables && !Array.isArray(a.variables)
            ? this.toArray(a.variables)
            : a.variables,
        inputs:
          a.inputs && !Array.isArray(a.inputs)
            ? this.toArray(a.inputs)
            : a.inputs,
      }));
    }

    return d;
  }

  // TODO: temp conversion functions, to be removed later
  private toApiData(data: any) {
    const d = structuredClone(data);

    // Convert array with key and value properties to dynamic object
    d.labelsLocalization = d.labelsLocalization ?? {
      dataset: {},
      proposal: {},
    };
    if (Array.isArray(d.labelsLocalization.dataset)) {
      d.labelsLocalization.dataset = this.toObject(
        d.labelsLocalization.dataset,
      );
    }
    if (Array.isArray(d.labelsLocalization.proposal)) {
      d.labelsLocalization.proposal = this.toObject(
        d.labelsLocalization.proposal,
      );
    }
    if (Array.isArray(d.datafilesActions)) {
      d.datafilesActions = d.datafilesActions.map((a: any) => ({
        ...a,
        variables: Array.isArray(a.variables)
          ? this.toObject(a.variables)
          : a.variables,
        inputs: Array.isArray(a.inputs) ? this.toObject(a.inputs) : a.inputs,
      }));
    }

    return d;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
