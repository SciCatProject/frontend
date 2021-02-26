import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SampleDialogComponent } from "./sample-dialog.component";

import { FormBuilder, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

describe("SampleDialogComponent", () => {
  let component: SampleDialogComponent;
  let fixture: ComponentFixture<SampleDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
