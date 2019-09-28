import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialogModule,
  MatFormFieldModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogComponent } from "./dialog.component";
import { MockMatDialogRef, MockMatDialogData } from "shared/MockStubs";

describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [MatDialogModule, FormsModule, CommonModule, MatFormFieldModule],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useClass: MockMatDialogData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
