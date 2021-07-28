import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogComponent } from "./dialog.component";
import { MockMatDialogRef, MockMatDialogData } from "shared/MockStubs";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogComponent],
        imports: [
          CommonModule,
          FormsModule,
          MatButtonModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
        ],
        providers: [
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: MAT_DIALOG_DATA, useClass: MockMatDialogData },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
