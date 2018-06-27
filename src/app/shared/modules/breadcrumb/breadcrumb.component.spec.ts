import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {MockStore} from 'shared/MockStubs';
import {BreadcrumbComponent} from './breadcrumb.component';
import { Store} from '@ngrx/store';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports : [ RouterTestingModule, HttpModule ],
          declarations : [ BreadcrumbComponent ],
          providers : [
            {provide : Store, useClass : MockStore},
          ]
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
