import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Self,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from "@angular/forms";
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from "@angular/material/form-field";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  INumericRange,
  NumericRangeFormGroup,
} from "../form/model/numeric-range-field.model";
import { NumericRangeFormService } from "../form/numeric-range-form.service";

@Component({
  selector: "ngx-numeric-range-form-field",
  templateUrl: "./numeric-range-form-field-container.component.html",
  styleUrls: ["./numeric-range-form-field-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NumericRangeFormService],
  standalone: false,
})
export class NumericRangeFormFieldContainerComponent
  implements OnChanges, OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() label: string;
  @Input() appearance: MatFormFieldAppearance = "fill";
  @Input() floatLabel: FloatLabelType = "always";

  @Input() minPlaceholder = "From";
  @Input() maxPlaceholder = "To";

  @Input() readonly = false;
  @Input() minReadonly = false;
  @Input() maxReadonly = false;

  @Input() resettable = true;

  @Input() required: boolean;
  @Input() requiredErrorMessage = "Field is required!";

  @Input() minErrorMessage = "min has been reached!";
  @Input() maxErrorMessage = "max has exceeded!";
  @Input() invalidRangeErrorMessage = "Inserted range is not valid!";
  @Input() dynamicSyncValidators: ValidatorFn | ValidatorFn[];

  @Output() blurred = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();
  @Output() numericRangeChanged = new EventEmitter<INumericRange>();

  formGroup: NumericRangeFormGroup = this.formService.formGroup;
  control = new FormControl();

  private unsubscribe$ = new Subject<void>();

  onTouched = () => {};

  get minControl(): FormControl<number> {
    return this.formService.minControl;
  }

  get maxControl(): FormControl<number> {
    return this.formService.maxControl;
  }

  constructor(
    @Self() private controlDirective: NgControl,
    @Host() private formService: NumericRangeFormService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.controlDirective.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dynamicSyncValidators) {
      this.control.setErrors(null);
      this.control.setValidators(this.dynamicSyncValidators);
      this.control.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnInit(): void {
    this.setSyncValidator(this.controlDirective.control.validator);
    this.setAsyncValidator(this.controlDirective.control.asyncValidator);

    this.controlDirective.control.setValidators([this.validate.bind(this)]); // overrides the parent control validators by sending out errors from validate()
    this.controlDirective.control.updateValueAndValidity({ emitEvent: false });

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: INumericRange): void {
    value === null
      ? this.control.reset()
      : this.control.setValue(value, {
          emitEvent: false,
        });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = {
      ...this.minControl.errors,
      ...this.maxControl.errors,
    };

    return Object.keys(errors).length ? errors : null;
  }

  onEnterPressed(): void {
    this.enterPressed.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  onRangeValuesChanged(value: INumericRange): void {
    this.numericRangeChanged.emit(value);
  }

  onReset(): void {
    this.formGroup.reset();
    this.numericRangeChanged.emit({ min: null, max: null });
  }

  private setSyncValidator(validator: ValidatorFn): void {
    if (!validator) {
      return;
    }

    this.control.addValidators(validator); // sets the validators from parent control
    this.control.updateValueAndValidity();
  }

  private setAsyncValidator(asyncValidator: AsyncValidatorFn): void {
    if (!asyncValidator) {
      return;
    }

    this.control.addAsyncValidators(asyncValidator);
    this.control.updateValueAndValidity();
  }
}
