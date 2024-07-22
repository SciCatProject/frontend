import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatafilesActionsComponent } from './datafiles-actions.component';

describe('DatafilesActionsComponent', () => {
  let component: DatafilesActionsComponent;
  let fixture: ComponentFixture<DatafilesActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatafilesActionsComponent]
    });
    fixture = TestBed.createComponent(DatafilesActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
