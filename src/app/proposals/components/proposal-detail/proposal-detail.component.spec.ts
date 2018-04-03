import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProposalDetailComponent } from './proposal-detail.component';
import {Http} from '@angular/http';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {
  MockActivatedRoute,
  MockConfigService,
  MockHttp,
  MockRouter,
  MockStore,
  MockUserApi
} from 'shared/MockStubs';
import { RouterTestingModule } from '@angular/router/testing';
import {Store, StoreModule} from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material';

describe('ProposalDetailComponent', () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      declarations: [ ProposalDetailComponent ],
      imports: [ StoreModule.forRoot({}), MatTabsModule, RouterTestingModule, BrowserAnimationsModule]
    })
    TestBed.overrideComponent(ProposalDetailComponent, {
      set: {
        providers: [
          {provide: Http, useClass: MockHttp},
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
