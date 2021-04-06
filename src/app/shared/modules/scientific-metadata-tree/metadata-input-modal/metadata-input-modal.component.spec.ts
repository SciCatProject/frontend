import { ComponentFixture, TestBed , waitForAsync} from "@angular/core/testing";

import { MetadataInputModalComponent } from "./metadata-input-modal.component";
import { FormBuilder } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MockMatDialogRef } from "shared/MockStubs";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("MetadataInputModalComponent", () => {
  let component: MetadataInputModalComponent;
  let fixture: ComponentFixture<MetadataInputModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataInputModalComponent ],
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatDialogModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialogRef }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("#initilizeFormControl()", () => {
    it("should initialize form control with empty string", () => {
      const formControl = component.initilizeFormControl();
      expect(formControl.get("parent").value).toEqual("");
      expect(formControl.get("type").value).toEqual("");
      expect(formControl.get("child").value).toEqual("");
      expect(formControl.get("value").value).toEqual("");
      expect(formControl.get("unit").value).toEqual("");
    });
  });
});
