import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbooksTableComponent } from './logbooks-table.component';

describe('LogbooksTableComponent', () => {
  let component: LogbooksTableComponent;
  let fixture: ComponentFixture<LogbooksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogbooksTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
