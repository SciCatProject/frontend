import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngestorComponent } from './ingestor.component';

describe('IngestorComponent', () => {
  let component: IngestorComponent;
  let fixture: ComponentFixture<IngestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngestorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});