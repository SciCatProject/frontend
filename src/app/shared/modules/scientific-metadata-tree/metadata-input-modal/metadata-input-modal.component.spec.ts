import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataInputModalComponent } from './metadata-input-modal.component';
import { FormBuilder } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MockMatDialogRef } from 'shared/MockStubs';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('MetadataInputModalComponent', () => {
  let component: MetadataInputModalComponent;
  let fixture: ComponentFixture<MetadataInputModalComponent>;

  beforeEach(async(() => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
