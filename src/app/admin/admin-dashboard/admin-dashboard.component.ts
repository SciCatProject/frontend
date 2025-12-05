import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, IsActiveMatchOptions } from "@angular/router";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
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
  showError = false;
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
    [TAB.configuration]: { action: "", loaded: false },
    [TAB.usersList]: { action: "", loaded: false },
  };

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userService: UsersService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.navLinks = [
      {
        location: "./configuration",
        label: TAB.configuration,
        icon: "menu",
        enabled: true,
      },
      {
        location: "./usersList",
        label: TAB.usersList,
        icon: "data_object",
        enabled: true,
      },
    ];
  }

  onTabSelected(tab: string) {
    this.fetchDataForTab(tab);
  }
  fetchDataForTab(tab: string) {
    if (tab in this.fetchDataActions) {
      switch (tab) {
        case TAB.configuration:
          break;
        case TAB.usersList:
          break;
        default: {
          // const { action, loaded } = this.fetchDataActions[tab];
          // if (!loaded) {
          //   this.fetchDataActions[tab].loaded = true;
          //   this.store.dispatch(action(args));
          // }
        }
      }
    }
  }
}
