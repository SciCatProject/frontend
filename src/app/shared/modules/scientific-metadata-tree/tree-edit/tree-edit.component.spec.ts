import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TreeEditComponent } from './tree-edit.component';

fdescribe('TreeEditComponent', () => {
  let component: TreeEditComponent;
  let fixture: ComponentFixture<TreeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeEditComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule
      ],
      providers: [
        MatDialog,
        MatSnackBar
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeEditComponent);
    component = fixture.componentInstance;
    component.metadata = {
      "motors": {
      "sampx": -0.03949844939218141,
      "sampy": 0.003037629787175808,
      "phi": 85.62724999999955,
      "zoom": 35007.46875,
      "focus": -0.2723789062500003,
      "phiz": 0.18436550301217358,
      "phiy": 0.21792454481296603
    },}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
