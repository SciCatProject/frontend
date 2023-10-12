import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SampleDialogComponent } from "./sample-dialog.component";

import { FormBuilder, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";

describe("SampleDialogComponent", () => {
  let component: SampleDialogComponent;
  let fixture: ComponentFixture<SampleDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
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
