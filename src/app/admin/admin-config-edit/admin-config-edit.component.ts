import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  loadConfiguration,
  updateConfiguration,
} from "state-management/actions/admin.action";
import { selectConfig } from "state-management/selectors/admin.selectors";
import schema from "../schema/frontend.config.jsonforms.json";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import {
  accordionArrayLayoutRendererTester,
  AccordionArrayLayoutRendererComponent,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";
import { map } from "rxjs";
import {
  expandGroupTester,
  ExpandGroupRendererComponent,
} from "shared/modules/jsonforms-custom-renderers/expand-group-renderer/expand-group-renderer";
import {
  ArrayLayoutRendererCustom,
  arrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/ingestor-renderer/array-renderer";

@Component({
  selector: "admin-config-edit",
  templateUrl: "./admin-config-edit.component.html",
  styleUrls: ["./admin-config-edit.component.scss"],
  standalone: false,
})
export class AdminConfigEditComponent implements OnInit {
  config$ = this.store.select(selectConfig);
  data$ = this.config$.pipe(
    map((cfg) => {
      if (!cfg?.data) return null;
      const d = structuredClone(cfg.data);
      d.labelsLocalization.dataset = this.toArray(d.labelsLocalization.dataset);
      d.labelsLocalization.proposal = this.toArray(
        d.labelsLocalization.proposal,
      );
      return d;
    }),
  );

  showJsonPreview = false;
  currentData: any = {};
  schema: any = schema.schema || {};
  uiSchema: any = schema.uiSchema || {};
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
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadConfiguration());
  }

  toArray(obj: any) {
    if (!obj) return [];
    return Array.isArray(obj)
      ? obj
      : Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  toObject(arr: any) {
    if (!arr) return {};
    if (!Array.isArray(arr)) return arr;

    return Object.fromEntries(arr.map((i) => [i.key, i.value]));
  }

  onChange(event: any) {
    this.currentData = event;
  }

  save() {
    const d = structuredClone(this.currentData);

    d.labelsLocalization = {
      dataset: this.toObject(d.labelsLocalization.dataset),
      proposal: this.toObject(d.labelsLocalization.proposal),
    };

    this.store.dispatch(updateConfiguration({ config: d }));
  }
}
