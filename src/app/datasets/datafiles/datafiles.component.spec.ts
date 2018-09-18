import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatafilesComponent } from './datafiles.component';
import { MatTableModule} from '@angular/material';
import { Store} from '@ngrx/store';
import { MockStore } from 'shared/MockStubs';
import { AppConfigModule } from 'app-config.module';
import { FileSizePipe } from '../../shared/pipes/filesize.pipe';

describe('DatafilesComponent', () => {
  let component: DatafilesComponent;
  let fixture: ComponentFixture<DatafilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ ReactiveFormsModule, MatTableModule, AppConfigModule ],
      declarations: [ DatafilesComponent, FileSizePipe ]
    });
     TestBed.overrideComponent(DatafilesComponent, {
    set: {
      providers: [
        {provide : Store, useClass : MockStore}
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
