import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Self,
  SimpleChanges,
  SkipSelf,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
  Validator,
  ValidatorFn,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  INumericRange,
  NumericRangeFormGroup,
} from "../form/model/numeric-range-field.model";
import { NumericRangeFormService } from "../form/numeric-range-form.service";
import { NumericRangeStateMatcher } from "../form/numeric-range-state-matcher";

@Component({
  selector: "ngx-numeric-range-form-field-control",
  templateUrl: "./numeric-range-form-field-control.component.html",
  styleUrls: ["./numeric-range-form-field-control.component.scss"],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NumericRangeFormFieldControlComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: NumericRangeStateMatcher,
    },
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumericRangeFormFieldControlComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    OnDestroy,
    MatFormFieldControl<INumericRange>,
    ControlValueAccessor,
    Validator
{
  static nextId = 0;
  private unsubscribe$ = new Subject<void>();
  private _placeholder: string;

  @Input() minPlaceholder: string;
  @Input() maxPlaceholder: string;
  @Input() readonly = false;
  @Input() minReadonly = false;
  @Input() maxReadonly = false;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() autofilled?: boolean;
  @Input() dynamicSyncValidators: ValidatorFn | ValidatorFn[];

  @Output() blurred = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();
  @Output() numericRangeChanged = new EventEmitter<INumericRange>();

  formGroup: NumericRangeFormGroup = this.formService.formGroup;

  stateChanges = new Subject<void>();

  focused = false;

  controlType = "numeric-range-form-control";

  numericRangeErrorMatcher = new NumericRangeStateMatcher();

  @HostBinding("attr.aria-describedby")
  userAriaDescribedBy = "";

  @HostBinding()
  id =
    `numeric-range-form-control-id-${NumericRangeFormFieldControlComponent.nextId++}`;

  constructor(
    @Self() public ngControl: NgControl,
    @SkipSelf() private formService: NumericRangeFormService,
  ) {
    this.ngControl.valueAccessor = this;
  }

  get value() {
    return this.formGroup.getRawValue();
  }

  @Input()
  set value(value: INumericRange) {
    this.formGroup.patchValue(value);
    this.stateChanges.next();
  }

  get placeholder(): string {
    return this._placeholder;
  }

  @Input() set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @HostBinding("class.floated")
  get shouldLabelFloat(): boolean {
    return true;
  }

  get empty(): boolean {
    return !this.value.min && !this.value.max;
  }

  get errorState() {
    return this.numericRangeErrorMatcher.isErrorState(
      this.ngControl.control as FormControl,
      this.formGroup,
    );
  }

  get minControl(): FormControl<number> {
    return this.formService.minControl;
  }

  get maxControl(): FormControl<number> {
    return this.formService.maxControl;
  }

  onTouched = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dynamicSyncValidators) {
      this.formService.setDynamicValidators(this.dynamicSyncValidators);
    }
  }

  ngOnInit(): void {
    this.formService.setSyncValidators(this.ngControl.control.validator);
    this.formService.setAsyncValidators(this.ngControl.control.asyncValidator);

    this.ngControl.control.setValidators([this.validate.bind(this)]);
    this.ngControl.control.updateValueAndValidity({ emitEvent: false });
  }

  ngDoCheck(): void {
    this.formGroup.markAllAsTouched();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: INumericRange): void {
    if (value === null) {
      this.formGroup.reset();
    } else {
      this.formGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }

    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(" ");
  }

  onContainerClick(event: MouseEvent): void {}

  validate(control: AbstractControl) {
    return control.errors;
  }

  onEnterPressed(): void {
    if (
      !this.formGroup.errors &&
      !this.minControl.errors &&
      !this.maxControl.errors
    ) {
      this.enterPressed.emit();
    }
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  onRangeValuesChanged(): void {
    if (
      this.formGroup.errors ||
      this.minControl.errors ||
      this.maxControl.errors
    ) {
      this.numericRangeChanged.emit(null);
    } else {
      this.numericRangeChanged.emit(this.formGroup.getRawValue());
    }
  }

  onMinValuesChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (
      this.formGroup.errors ||
      this.minControl.errors ||
      this.maxControl.errors
    ) {
      this.numericRangeChanged.emit(null);
    } else {
      this.numericRangeChanged.emit({
        min: value,
        max: this.formGroup.get("max")?.value,
      });
    }
  }

  onMaxValuesChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (
      this.formGroup.errors ||
      this.minControl.errors ||
      this.maxControl.errors
    ) {
      this.numericRangeChanged.emit(null);
    } else {
      this.numericRangeChanged.emit({
        min: this.formGroup.get("min")?.value,
        max: value,
      });
    }
  }
}
