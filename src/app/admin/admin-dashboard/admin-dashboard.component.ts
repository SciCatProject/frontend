import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, IsActiveMatchOptions } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import { loadConfiguration } from "state-management/actions/runtime-config.action";
import { loadUsers } from "state-management/actions/users.actions";
enum TAB {
  configuration = "Configuration",
  usersList = "Users List",
}
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit {
  navLinks: {
    location: string;
    label: string;
    icon: string;
    enabled: boolean;
  }[] = [];

  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: "ignored",
    queryParams: "ignored",
    fragment: "ignored",
    paths: "exact",
  };

  fetchDataActions: { [tab: string]: { action: any; loaded: boolean } } = {
    [TAB.configuration]: { action: loadConfiguration, loaded: false },
    [TAB.usersList]: { action: loadUsers, loaded: false },
  };

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store: Store,

    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.navLinks = [
      {
        location: "./configuration",
        label: TAB.configuration,
        icon: "settings",
        enabled: true,
      },
      {
        location: "./usersList",
        label: TAB.usersList,
        icon: "people",
        enabled: true,
      },
    ];

    this.route.firstChild?.url
      .subscribe((childUrl) => {
        const tab = childUrl.length === 1 ? childUrl[0].path : "configuration";
        this.fetchDataForTab(TAB[tab]);
      })
      .unsubscribe();
  }

  onTabSelected(tab: string) {
    this.fetchDataForTab(tab);
  }

  fetchDataForTab(tab: string) {
    if (tab in this.fetchDataActions) {
      switch (tab) {
        case TAB.configuration: {
          const { action, loaded } = this.fetchDataActions[tab];
          if (!loaded) {
            this.fetchDataActions[tab].loaded = true;
            this.store.dispatch(action({ id: "frontendConfig" }));
          }
          break;
        }
        case TAB.usersList: {
          const { action, loaded } = this.fetchDataActions[tab];
          if (!loaded) {
            this.fetchDataActions[tab].loaded = true;
            this.store.dispatch(action());
          }
          break;
        }
        default:
          break;
      }
    }
  }
}
