import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsDetailComponent } from './jobs-detail.component';

describe('JobsDetailComponent', () => {
  let component: JobsDetailComponent;
  let fixture: ComponentFixture<JobsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
