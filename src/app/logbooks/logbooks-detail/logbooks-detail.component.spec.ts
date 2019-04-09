import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbooksDetailComponent } from './logbooks-detail.component';

describe('LogbooksDetailComponent', () => {
  let component: LogbooksDetailComponent;
  let fixture: ComponentFixture<LogbooksDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogbooksDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
