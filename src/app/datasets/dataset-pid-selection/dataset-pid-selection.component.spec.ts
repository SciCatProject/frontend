import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetPidSelectionComponent } from './dataset-pid-selection.component';

describe('DatasetPidSelectionComponent', () => {
  let component: DatasetPidSelectionComponent;
  let fixture: ComponentFixture<DatasetPidSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetPidSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPidSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
