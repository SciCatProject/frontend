import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';

import {BreadcrumbComponent} from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports : [ RouterTestingModule, HttpModule ],
          declarations : [ BreadcrumbComponent ]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
