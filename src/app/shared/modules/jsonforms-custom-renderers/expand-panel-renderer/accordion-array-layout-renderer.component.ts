import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsAbstractControl,
} from "@jsonforms/angular";
import {
  arrayDefaultTranslations,
  ArrayLayoutProps,
  ArrayTranslations,
  createDefaultValue,
  defaultJsonFormsI18nState,
  findUISchema,
  getArrayTranslations,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  mapStateToLayoutProps,
  OwnPropsOfRenderer,
  Paths,
  RankedTester,
  rankWith,
  setReadonly,
  StatePropsOfArrayLayout,
  UISchemaElement,
  UISchemaTester,
  uiTypeIs,
  unsetReadonly,
} from "@jsonforms/core";
import { get } from "lodash-es";
import type { ErrorObject } from "ajv";
import { JsonformsAccordionRendererService } from "shared/services/jsonforms-accordion-renderer.service";

@Component({
  selector: "app-accordion-array-layout-renderer",
  templateUrl: "./accordion-array-layout-renderer.component.html",
  styleUrls: ["./accordion-array-layout-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionArrayLayoutRendererComponent
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit
{
  noData: boolean;
  translations: ArrayTranslations = {};
  addItem: (path: string, value: any) => () => void;
  moveItemUp: (path: string, index: number) => () => void;
  moveItemDown: (path: string, index: number) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  uischemas: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];
  stateData: object;
  allErrors: ErrorObject<string, Record<string, any>, unknown>[];
  panelOpenState = {};
  constructor(
    jsonFormsService: JsonFormsAngularService,
    private jsonFormsAccordionRendererService: JsonformsAccordionRendererService,
  ) {
    super(jsonFormsService);
  }
  mapToProps(
    state: JsonFormsState,
  ): StatePropsOfArrayLayout & { translations: ArrayTranslations } {
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    const t =
      state.jsonforms.i18n?.translate ?? defaultJsonFormsI18nState.translate;
    const translations = getArrayTranslations(
      t,
      arrayDefaultTranslations,
      props.i18nKeyPrefix,
      props.label,
    );
    return { ...props, translations };
  }
  remove(index: number): void {
    delete this.panelOpenState[this.getProps(index).path];
    this.jsonFormsAccordionRendererService.removePanelOpenState(
      this.getProps(index).path,
    );

    this.removeItems(this.propsPath, [index])();
  }
  add(index: number): void {
    this.panelOpenState[this.getProps(index).path] = true;

    this.jsonFormsAccordionRendererService.setPanelOpenState(
      this.getProps(index).path,
      true,
    );

    this.addItem(
      this.propsPath,
      createDefaultValue(this.scopedSchema, this.rootSchema),
    )();
  }
  up(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.moveItemUp(this.propsPath, index)();
  }
  down(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.moveItemDown(this.propsPath, index)();
  }
  ngOnInit() {
    super.ngOnInit();
    const { addItem, removeItems, moveUp, moveDown } =
      mapDispatchToArrayControlProps(
        this.jsonFormsService.updateCore.bind(this.jsonFormsService),
      );
    this.addItem = addItem;
    this.moveItemUp = moveUp;
    this.moveItemDown = moveDown;
    this.removeItems = removeItems;

    this.addSubscription(
      this.jsonFormsService.$state.subscribe({
        next: (state: JsonFormsState) => {
          this.stateData = state.jsonforms.core.data;
          this.allErrors = state.jsonforms.core.errors;
        },
      }),
    );

    this.panelOpenState = this.jsonFormsAccordionRendererService.getState();
  }
  mapAdditionalProps(
    props: ArrayLayoutProps & { translations: ArrayTranslations },
  ) {
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
    this.translations = props.translations;
  }
  getProps(index: number): OwnPropsOfRenderer {
    const uischema = findUISchema(
      this.uischemas,
      this.scopedSchema,
      this.uischema.scope,
      this.propsPath,
      undefined,
      this.uischema,
      this.rootSchema,
    );
    if (this.isEnabled()) {
      unsetReadonly(uischema);
    } else {
      setReadonly(uischema);
    }
    return {
      schema: this.scopedSchema,
      path: Paths.compose(this.propsPath, `${index}`),
      uischema,
    };
  }
  getDisplayPropertyData(index: number): string {
    const displayProperty = this.uischema.options?.displayProperty || "name";

    const displayValue = get(this.stateData, this.getProps(index).path);

    if (displayProperty && displayValue?.[displayProperty]) {
      return displayValue?.[displayProperty];
    }
    return this.getProps(index).path;
  }
  trackByFn(index: number) {
    return index;
  }

  getError(index: number): string {
    const path = `/${Paths.compose(this.propsPath, `${index}`).replaceAll(".", "/")}`;
    const error = this.allErrors.find(
      (error) => error.instancePath && error.instancePath.startsWith(path),
    )?.message;

    if (error) {
      return error;
    }
    return "";
  }

  getEpandedState(index: number): boolean {
    return this.jsonFormsAccordionRendererService.getPanelOpenState(
      this.getProps(index).path,
    );
  }

  onPanelOpen(index: number): void {
    this.jsonFormsAccordionRendererService.setPanelOpenState(
      this.getProps(index).path,
      true,
    );
  }

  onPanelClose(index: number): void {
    this.jsonFormsAccordionRendererService.setPanelOpenState(
      this.getProps(index).path,
      false,
    );
  }
}

export const accordionArrayLayoutRendererTester: RankedTester = rankWith(
  4,
  uiTypeIs("AccordionArrayLayout"),
);
