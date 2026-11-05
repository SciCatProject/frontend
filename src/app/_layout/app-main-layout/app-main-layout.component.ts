import { OnDestroy, Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-main-app-layout",
  templateUrl: "./app-main-layout.component.html",
  styleUrls: ["./app-main-layout.component.scss"],
  standalone: false,
})
export class AppMainLayoutComponent implements OnDestroy {
  isDatasetsListRoute = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    this.isDatasetsListRoute = this.isDatasetsListUrl(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.isDatasetsListRoute = this.isDatasetsListUrl(
          event.urlAfterRedirects,
        );
      });
  }

  private isDatasetsListUrl(url: string | undefined): boolean {
    return (url || "").split(/[?#]/)[0] === "/datasets";
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
