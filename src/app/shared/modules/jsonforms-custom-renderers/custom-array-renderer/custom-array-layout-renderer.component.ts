import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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

// TODO: This component is a copy of the original ArrayLayoutRenderer and fix for the known issue with the error count in the icon badge.
// It can be removed once the issue is fixed in the original library. https://github.com/eclipsesource/jsonforms/issues/2473
// The issue is closed and the fix is merged, but not yet released in the npm package. Once a new version is released, we can remove this component and use the original one.
// And also the type in the configuration file should be changed from "CustomArrayLayout" to "Control".
// Follow up here: https://github.com/eclipsesource/jsonforms/releases
@Component({
  selector: "app-array-layout-renderer",
  templateUrl: "./custom-array-layout-renderer.component.html",
  styleUrls: ["./custom-array-layout-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ArrayLayoutRendererComponent
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
  up(index: number): void {
    this.moveItemUp(this.propsPath, index)();
  }
  down(index: number): void {
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
  trackByFn(index: number) {
    return index;
  }
}

export const arrayLayoutRendererTester: RankedTester = rankWith(
  4,
  uiTypeIs("CustomArrayLayout"),
);
