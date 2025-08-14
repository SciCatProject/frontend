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

@Component({
  selector: "app-accordion-array-layout-renderer",
  templateUrl: "./accordion-array-layout-renderer.component.html",
  styleUrls: ["./accordion-array-layout-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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
  readonly panelOpenState = signal(true);
  constructor(jsonFormsService: JsonFormsAngularService) {
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
    this.removeItems(this.propsPath, [index])();
  }
  add(): void {
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
        },
      }),
    );
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
}

export const accordionArrayLayoutRendererTester: RankedTester = rankWith(
  4,
  uiTypeIs("AccordionArrayLayout"),
);
