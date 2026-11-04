import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import {
  selectArchiveViewMode,
  selectFilters,
} from "state-management/selectors/datasets.selectors";
import { take, filter } from "rxjs/operators";
import { TitleCasePipe } from "shared/pipes/title-case.pipe";
import { ArchViewMode } from "state-management/models";
import { Location } from "@angular/common";
import { isEmpty } from "lodash-es";

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
    // The breadcrumb can be rendered from a routed page component as well as
    // from the application shell. Start at the root activated route so both
    // placements see the same route segments.
    let rootRoute = this.route;
    while (rootRoute.parent) {
      rootRoute = rootRoute.parent;
    }

    const children: ActivatedRoute[] = [];
    const collectRoutes = (route: ActivatedRoute): void => {
      route.children.forEach((child) => {
        children.push(child);
        collectRoutes(child);
      });
    };
    collectRoutes(rootRoute);
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

    // When this component is rendered inside a lazy-loaded page, the
    // ActivatedRoute tree may not expose the URL segments immediately. Fall
    // back to the current router URL so the datasets list still shows its
    // breadcrumb on the initial render.
    if (this.breadcrumbs.length === 0) {
      const paths = this.router.url.split(/[?#]/)[0].split("/").filter(Boolean);
      paths.forEach((path) => {
        const encodedPath = encodeURIComponent(path);
        this.breadcrumbs.push({
          label: this.sanitise(path, path),
          path,
          params: {},
          url: "/" + encodedPath,
          fallback: "/" + encodedPath,
        });
      });
    }
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
      this.store
        .select(selectFilters)
        .pipe(take(1))
        .subscribe((filters) => {
          this.store
            .select(selectArchiveViewMode)
            .pipe(take(1))
            .subscribe((currentMode) => {
              const mode = setMode(currentMode);
              if (isEmpty(mode)) {
                this.router.navigateByUrl(url + crumb.fallback);
              } else {
                filters["mode"] = mode;
                this.location.back();
              }
            });
        });
    } else {
      this.router
        .navigateByUrl(url + crumb.url)
        .catch((error) => this.router.navigateByUrl(url + crumb.fallback));
    }
  }
}

const setMode = (modeToggle: ArchViewMode) => {
  switch (modeToggle) {
    case ArchViewMode.all:
      return {};
    case ArchViewMode.archivable:
      return {
        "datasetlifecycle.archivable": true,
        "datasetlifecycle.retrievable": false,
      };
    case ArchViewMode.retrievable:
      return {
        "datasetlifecycle.retrievable": true,
        "datasetlifecycle.archivable": false,
      };
    case ArchViewMode.work_in_progress:
      return {
        $or: [
          {
            "datasetlifecycle.retrievable": false,
            "datasetlifecycle.archivable": false,
            "datasetlifecycle.archiveStatusMessage": {
              $ne: "scheduleArchiveJobFailed",
            },
            "datasetlifecycle.retrieveStatusMessage": {
              $ne: "scheduleRetrieveJobFailed",
            },
          },
        ],
      };
    case ArchViewMode.system_error:
      return {
        $or: [
          {
            "datasetlifecycle.retrievable": true,
            "datasetlifecycle.archivable": true,
          },
          {
            "datasetlifecycle.archiveStatusMessage": "scheduleArchiveJobFailed",
          },
          {
            "datasetlifecycle.retrieveStatusMessage":
              "scheduleRetrieveJobFailed",
          },
        ],
      };
    case ArchViewMode.user_error:
      return {
        $or: [
          {
            "datasetlifecycle.archiveStatusMessage": "missingFilesError",
          },
        ],
      };
    default: {
      return {};
    }
  }
};
