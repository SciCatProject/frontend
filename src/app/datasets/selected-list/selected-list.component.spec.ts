import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedListComponent } from './selected-list.component';

describe('SelectedListComponent', () => {
  let component: SelectedListComponent;
  let fixture: ComponentFixture<SelectedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedListComponent ]
    })
    .compileComponents();
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
