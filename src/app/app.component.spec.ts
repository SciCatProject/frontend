import { async, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { rootReducer } from 'state-management/reducers/root.reducer';

import { AppComponent } from './app.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { MockStore } from './shared/MockStubs';

/* tslint:disable:no-unused-variable */

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, StoreModule.forRoot({rootReducer})],
      declarations: [
        AppComponent,
        BreadcrumbComponent
      ]
    });
    TestBed.overrideComponent(AppComponent, {
    set: {
      providers: [
        // {provide : Router, useClass : MockRouter},
        {provide : Store, useClass : MockStore},
      ]
    }
  });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.get(Store);
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'CATANIE'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.get(Store);
    expect(app.title).toEqual('CATANIE');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a.header').textContent).toContain('CATANIE');
  }));
});
