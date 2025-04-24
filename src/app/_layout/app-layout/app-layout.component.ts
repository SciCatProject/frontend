import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectIsLoggedIn } from "state-management/selectors/user.selectors";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-app-layout",
  templateUrl: "./app-layout.component.html",
  styleUrls: ["./app-layout.component.scss"],
  standalone: false,
})
export class AppLayoutComponent {
  appConfig = this.appConfigService.getConfig();
  loggedIn$ = this.store.select(selectIsLoggedIn);

  constructor(
    private appConfigService: AppConfigService,
    private store: Store,
  ) {}
}
