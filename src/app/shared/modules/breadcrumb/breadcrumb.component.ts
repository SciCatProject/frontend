import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";

import {
  selectArchiveViewMode,
  selectFilters,
} from "state-management/selectors/datasets.selectors";
import { take, filter } from "rxjs/operators";
import { TitleCasePipe } from "shared/pipes/title-case.pipe";
import { Location } from "@angular/common";
import {
  prefillFiltersAction,
  setArchiveViewModeAction,
} from "state-management/actions/datasets.actions";

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
  selector: "breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["breadcrumb.component.scss"],
  standalone: false,
})
export class BreadcrumbComponent implements OnInit {
  // partially based on: http://brianflove.com/2016/10/23/angular2-breadcrumb-using-router/
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    // Set initial breadcrumb
    this.setBreadcrumbs();
    // Update breadcrumb when navigating to child routes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setBreadcrumbs();
      });
  }

  /**
   * Creates breadcrumbs from route and pushes them to breadcrumbs array
   * @memberof BreadcrumbComponent
   */
  setBreadcrumbs(): void {
    this.breadcrumbs = [];
    const children = this.route.children.reduce<ActivatedRoute[]>(
      (accumulator, child) => {
        accumulator.push(child, ...child.children);
        return accumulator;
      },
      [],
    );
    children.forEach((root) => {
      let param: string;
      Object.keys(root.snapshot.params).forEach((key) => {
        param = root.snapshot.params[key];
      });
      root.snapshot.url.forEach((url) => {
        const crumb: Breadcrumb = {
          label: this.sanitise(url.path, param),
          path: url.path,
          params: url.parameters,
          url: "/" + encodeURIComponent(url.path),
          fallback: "/" + encodeURIComponent(url.path),
        };
        this.breadcrumbs.push(crumb);
      });
    });
  }

  /**
   * Clean text for easy reading
   * of path info (capitalise, strip chars etc)
   * @param {string} path
   * @returns Sanitised path for breadcrumb label
   * @memberof BreadcrumbComponent
   */
  sanitise(path: string, param: string): string {
    path = path.replace(new RegExp("_", "g"), " ");
    if (path !== param) {
      path = new TitleCasePipe().transform(path);
    }
    return path;
  }

  /**
   * Handles navigation for a click on a crumb
   * Fallsback to pluralised version of the page if there is an error
   * @example dataset -> Datasets
   * @param {number} index
   * @param {Breadcrumb} crumb
   * @memberof BreadcrumbComponent
   */
  crumbClick(index: number, crumb: Breadcrumb): void {
    let url = "";
    for (let i = 0; i < index; i++) {
      url += this.breadcrumbs[i].url;
    }
    // this catches errors and redirects to the fallback, this could/should be set in the routing module?
    if (crumb.fallback === "/datasets") {
      combineLatest([
        this.store.select(selectFilters).pipe(take(1)),
        this.store.select(selectArchiveViewMode).pipe(take(1)),
      ]).subscribe(([filters, modeToggle]) => {
        this.store.dispatch(prefillFiltersAction({ values: { ...filters } }));
        this.store.dispatch(setArchiveViewModeAction({ modeToggle }));
        this.location.back();
      });
    } else {
      this.router
        .navigateByUrl(url + crumb.url)
        .catch((error) => this.router.navigateByUrl(url + crumb.fallback));
    }
  }
}
