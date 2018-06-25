import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Params
} from '@angular/router';
import { TitleCasePipe } from '../../pipes/index';
import { Store, select } from '@ngrx/store';
import * as rison from 'rison';
import * as selectors from 'state-management/selectors';

import { getViewMode, getFilters } from 'state-management/selectors/datasets.selectors';
import { AppState } from 'state-management/state/app.store';
import { take, filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  path: string;
  params: Params;
  url: string;
  fallback: string;
}



/**
 * Generates a `breadcrumb` from the URL pattern
 * Does not require a service and only uses activated route
 * @export
 * @class BreadcrumbComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  // partially based on: http://brianflove.com/2016/10/23/angular2-breadcrumb-using-router/
  breadcrumbs = Array<Breadcrumb>();

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    // const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // TODO handle query params
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      // set breadcrumbs
      this.breadcrumbs = [];
      const self = this;
      // let root: ActivatedRoute = this.route.root;
      this.route.children.forEach(function (root) {
        const urls = root.snapshot.url;
        urls.forEach(function (url) {
          if (url.path !== 'datasets') {
            const bc: Breadcrumb = {
              label: self.sanitise(url.path),
              path: url.path,
              params: url.parameters,
              url: '/' + encodeURIComponent(url.path),
              fallback: '/' + encodeURIComponent(url.path + 's')
            };
            self.breadcrumbs.push(bc);
          }
        });
      });
    });
  }


  /**
   * Clean text for easy reading
   * of path info (capitalise, strip chars etc)
   * @param {any} path
   * @returns
   * @memberof BreadcrumbComponent
   */
  sanitise(path) {
    path = path.replace(new RegExp('_', 'g'), ' ');
    path = new TitleCasePipe().transform(path);
    return path;
  }

  /**
   * Handles navigation for a click on a crumb
   * Fallsback to pluralised version of the page if there is an error
   * @example dataset -> Datasets
   * @param {any} index
   * @param {any} crumb
   * @memberof BreadcrumbComponent
   */
  crumbClick(index, crumb) {
    let url = '';
    for (let i = 0; i < index; i++) {
      url += this.breadcrumbs[i].url;
    }
    // this catches errors and redirects to the fallback, this could/should be set in the routing module?
      if (crumb.fallback === '/datasets') {
        this.store.pipe(
          select(getFilters),
          take(1)
        ).subscribe(filters => {
            console.log(filters);
            this.store.pipe(
              select(getViewMode),
              take(1)
            ).subscribe(currentMode => {
              filters['mode'] = currentMode;
              console.log(currentMode);
              this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(filters) } });
            });
          });
      } else {
        this.router.navigateByUrl(url + crumb.url).catch(error => this.router.navigateByUrl(url + crumb.fallback));
      }
    // });
  }

}
