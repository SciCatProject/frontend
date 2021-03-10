import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataInputModalComponent } from './metadata-input-modal.component';

describe('MetadataInputModalComponent', () => {
  let component: MetadataInputModalComponent;
  let fixture: ComponentFixture<MetadataInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataInputModalComponent ]
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
