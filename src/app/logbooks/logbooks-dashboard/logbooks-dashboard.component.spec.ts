import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbooksDashboardComponent } from './logbooks-dashboard.component';

describe('DashboardComponent', () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogbooksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
