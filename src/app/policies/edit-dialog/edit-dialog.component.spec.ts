import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditDialogComponent } from "./edit-dialog.component";
import { MockMatDialogRef } from "shared/MockStubs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const data = {
  selectedPolicy: {
    autoArchive: true,
  },
  selectedGroups: []
};

describe("EditDialogComponent", () => {
  let component: EditDialogComponent;
  let fixture: ComponentFixture<EditDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditDialogComponent],
        imports: [
          BrowserAnimationsModule,
          CommonModule,
          FormsModule,
          MatCardModule,
          MatChipsModule,
          MatDialogModule,
          MatExpansionModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatSelectModule,
          ReactiveFormsModule,
        ],
        providers: [
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: data },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
