import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataInputComponent } from './metadata-input.component';

describe('MetadataInputComponent', () => {
  let component: MetadataInputComponent;
  let fixture: ComponentFixture<MetadataInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
