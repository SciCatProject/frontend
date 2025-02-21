import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RouteTrackerService {
  private currentRoute: string | null = null;
  private previousRoute: string | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.previousRoute = this.currentRoute;
        this.currentRoute = (event as NavigationStart).url;
      });
  }

  getPreviousRoute(): string | null {
    return this.previousRoute;
  }
}
