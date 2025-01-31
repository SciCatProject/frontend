import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsAbstractControl,
} from "@jsonforms/angular";
import {
  ArrayLayoutProps,
  ArrayTranslations,
  createDefaultValue,
  findUISchema,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  OwnPropsOfRenderer,
  Paths,
  setReadonly,
  StatePropsOfArrayLayout,
  UISchemaElement,
  UISchemaTester,
  unsetReadonly,
} from "@jsonforms/core";

@Component({
  selector: "app-array-layout-renderer-custom",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <mat-card
      [ngStyle]="{ display: hidden ? 'none' : '' }"
      class="array-layout"
    >
      <mat-card-title class="array-layout-toolbar">
        <h2 class="mat-h2 array-layout-title">{{ label }}</h2>
        <span></span>
        <mat-icon
          *ngIf="this.error?.length"
          color="warn"
          matBadgeColor="warn"
          matTooltip="{{ this.error }}"
          matTooltipClass="error-message-tooltip"
        >
          error_outline
        </mat-icon>
        <span></span>
        <button
          mat-button
          matTooltip="{{ translations.addTooltip }}"
          [disabled]="!isEnabled()"
          (click)="add()"
          attr.aria-label="{{ translations.addAriaLabel }}"
        >
          <mat-icon>add</mat-icon>
        </button>
      </mat-card-title>
      <mat-card-content *ngIf="noData">
        <p>{{ translations.noDataMessage }}</p>
      </mat-card-content>
      <mat-card-content
        *ngFor="
          let item of [].constructor(data);
          let idx = index;
          trackBy: trackByFn;
          last as last;
          first as first
        "
      >
        <mat-card class="array-item" appearance="outlined">
          <mat-card-content>
            <jsonforms-outlet [renderProps]="getProps(idx)"></jsonforms-outlet>
          </mat-card-content>
          <mat-card-actions *ngIf="isEnabled()">
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-up"
              mat-button
              [disabled]="first"
              (click)="up(idx)"
              attr.aria-label="{{ translations.upAriaLabel }}"
              matTooltip="{{ translations.up }}"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_upward</mat-icon>
            </button>
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-down"
              mat-button
              [disabled]="last"
              (click)="down(idx)"
              attr.aria-label="{{ translations.downAriaLabel }}"
              matTooltip="{{ translations.down }}"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_downward</mat-icon>
            </button>
            <button
              mat-button
              color="warn"
              (click)="remove(idx)"
              attr.aria-label="{{ translations.removeAriaLabel }}"
              matTooltip="{{ translations.removeTooltip }}"
              matTooltipPosition="right"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </mat-card-content>
    </mat-card>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ArrayLayoutRendererCustom
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit, OnDestroy
{
  noData: boolean;
  translations: ArrayTranslations;
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
  mapToProps(state: JsonFormsState): StatePropsOfArrayLayout {
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    return { ...props };
  }
  remove(index: number): void {
    this.removeItems(this.propsPath, [index])();
  }
  add(): void {
    this.addItem(
      this.propsPath,
      createDefaultValue(this.scopedSchema, this.rootSchema)
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
  mapAdditionalProps(props: ArrayLayoutProps) {
    this.translations = props.translations;
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
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
