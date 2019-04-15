import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbooksFilterComponent } from './logbooks-filter.component';

describe('LogbooksFilterComponent', () => {
  let component: LogbooksFilterComponent;
  let fixture: ComponentFixture<LogbooksFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogbooksFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
