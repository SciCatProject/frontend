import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { DatafilesComponent } from './datafiles.component';


describe('DatafilesComponent', () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports: [ReactiveFormsModule],
      declarations: [ DatafilesComponent ]
    });
     TestBed.overrideComponent(DatafilesComponent, {
    set: {
      providers: [
      ]
    }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
