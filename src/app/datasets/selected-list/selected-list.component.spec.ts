import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedListComponent } from './selected-list.component';
import { MatCardModule, MatListModule } from '@angular/material';

import {Store, StoreModule} from '@ngrx/store';
import { MockStore} from 'shared/MockStubs';

describe('SelectedListComponent', () => {
  let component: SelectedListComponent;
  let fixture: ComponentFixture<SelectedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedListComponent ],
      imports: [MatCardModule, MatListModule]
    });
    TestBed.overrideComponent(SelectedListComponent, {
      set: {
        providers: [
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
