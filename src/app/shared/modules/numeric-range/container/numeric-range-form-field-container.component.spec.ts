import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormControlDirective,
  FormGroup,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NumericRangeFormFieldControlComponent } from "../control/numeric-range-form-field-control.component";
import { INumericRange } from "../form/model/numeric-range-field.model";
import { NumericRangeFormService } from "../form/numeric-range-form.service";
import { NumericRangeFormFieldContainerComponent } from "./numeric-range-form-field-container.component";

@Component({
  template: `
    <ngx-numeric-range-form-field
      (enterPressed)="onNumericRangeEnterPressed()"
      (numericRangeChanged)="onNumericRangeChanged($event)"
      (blurred)="onRangeBlur()"
      [formControl]="numericRangeControl"
      label="Numeric range input field"
    >
    </ngx-numeric-range-form-field>
  `,
  standalone: false,
})
class HostComponent {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      numericRange: new FormControl({ min: 0, max: 10 }, [
        Validators.min(0),
        Validators.max(10),
      ]),
    });
  }

  get numericRangeControl() {
    return this.form.get("numericRange") as FormControl;
  }

  onRangeBlur(): void {
    return;
  }

  onNumericRangeChanged(value: INumericRange): void {
    return;
  }

  onNumericRangeEnterPressed(): void {
    return;
  }

  disableRange(disable: boolean): void {
    disable
      ? this.numericRangeControl.disable()
      : this.numericRangeControl.enable();
  }
}

describe("NumericRangeFormFieldContainerComponent", () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let service: NumericRangeFormService;

  function getMinRangeField(): any {
    return fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .queryAll(By.css("input"))[0].nativeElement;
  }

  function getMaxRangeField(): any {
    return fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .queryAll(By.css("input"))[1].nativeElement;
  }

  function getNumericRangeComponent(): NumericRangeFormFieldContainerComponent {
    return fixture.debugElement.query(
      By.directive(NumericRangeFormFieldContainerComponent),
    ).componentInstance;
  }

  function getNumericRangeControlComponent(): NumericRangeFormFieldControlComponent {
    return fixture.debugElement.query(
      By.directive(NumericRangeFormFieldControlComponent),
    ).componentInstance;
  }

  beforeEach(async () => {
    TestBed.overrideComponent(NumericRangeFormFieldContainerComponent, {
      set: {
        providers: [
          {
            provide: NgControl,
            useValue: new FormControlDirective([], [], null, null),
          },
          NumericRangeFormService,
        ],
      },
    });

    await TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        NumericRangeFormFieldContainerComponent,
        NumericRangeFormFieldControlComponent,
      ],
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .injector.get(NumericRangeFormService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(getMinRangeField()).toBeTruthy();
    expect(getMaxRangeField()).toBeTruthy();
  });

  it("should emit on enter pressed and not emit on errors", () => {
    const enterSpy = spyOn(
      component,
      "onNumericRangeEnterPressed",
    ).and.callThrough();

    const rangeField = getMinRangeField();
    rangeField.dispatchEvent(new KeyboardEvent("keyup", { key: "enter" }));

    expect(enterSpy).toHaveBeenCalledTimes(1);

    component.form.get("numericRange").setValue({ min: 10, max: 9 });

    rangeField.dispatchEvent(new KeyboardEvent("keyup", { key: "enter" }));

    expect(enterSpy).not.toHaveBeenCalledTimes(2);
  });

  it("should emit on blur event", () => {
    const blurSpy = spyOn(component, "onRangeBlur").and.callThrough();
    getMinRangeField().dispatchEvent(new Event("blur"));
    expect(blurSpy).toHaveBeenCalled();
  });

  it("should emit on changed date value", () => {
    const rangeChangeSpy = spyOn(
      component,
      "onNumericRangeChanged",
    ).and.callThrough();

    const numericRangeControlComponent = getNumericRangeControlComponent();

    numericRangeControlComponent.minControl.setValue(8);
    numericRangeControlComponent.minControl.updateValueAndValidity();

    numericRangeControlComponent.onRangeValuesChanged();

    expect(rangeChangeSpy).toHaveBeenCalledOnceWith({
      min: 8,
      max: 10,
    });
    expect(numericRangeControlComponent.errorState).toBeFalse();
  });

  it("should emit null if error happens on changed range values", () => {
    const rangeChangeSpy = spyOn(
      component,
      "onNumericRangeChanged",
    ).and.callThrough();

    const numericRangeControlComponent = getNumericRangeControlComponent();

    numericRangeControlComponent.minControl.setValue(8);
    numericRangeControlComponent.maxControl.setValue(6);
    numericRangeControlComponent.formGroup.updateValueAndValidity();

    numericRangeControlComponent.onRangeValuesChanged();

    expect(rangeChangeSpy).toHaveBeenCalledWith(null);
    expect(numericRangeControlComponent.formGroup.errors).toEqual({
      notValidRange: true,
    });
  });

  it("should reset value", () => {
    expect(component.form.value).toEqual({
      numericRange: { min: 0, max: 10 },
    });

    const resetIcon = fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .query(By.css("mat-icon")).nativeElement;
    resetIcon.click();

    expect(component.form.value).toEqual({
      numericRange: {
        min: null,
        max: null,
      },
    });
  });

  it("should change disabled state of date range component", () => {
    const numericRangeComponent = getNumericRangeComponent();

    component.disableRange(true);

    expect(component.numericRangeControl.disabled).toBeTrue();
    expect(numericRangeComponent.formGroup.disabled).toBeTrue();

    component.disableRange(false);

    expect(component.numericRangeControl.disabled).toBeFalse();
    expect(numericRangeComponent.formGroup.disabled).toBeFalse();
  });

  it("should have valid error state of the form", () => {
    const numericRangeControlComponent = getNumericRangeControlComponent();

    expect(numericRangeControlComponent.errorState).toBeFalse();
  });

  it("should have invalid error state of the form", () => {
    const numericRangeControlComponent = getNumericRangeControlComponent();

    numericRangeControlComponent.minControl.setValue(8);
    numericRangeControlComponent.maxControl.setValue(6);
    numericRangeControlComponent.minControl.markAsTouched();
    numericRangeControlComponent.minControl.markAsDirty();
    numericRangeControlComponent.maxControl.markAsDirty();
    numericRangeControlComponent.formGroup.updateValueAndValidity();

    expect(numericRangeControlComponent.errorState).toBeTrue();
  });
});
