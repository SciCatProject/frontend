import { APP_CONFIG, AppConfig } from "./app-config.module";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  AfterViewChecked,
  ChangeDetectorRef,
} from "@angular/core";
import { Store } from "@ngrx/store";
import {
  clearMessageAction,
  fetchCurrentUserAction,
  loadDefaultSettings,
  logoutAction,
} from "state-management/actions/user.actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Meta, Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import {
  selectIsLoading,
  selectUserMessage,
} from "state-management/selectors/user.selectors";
import { MessageType } from "state-management/models";
import { AppConfigService, AppConfig as Config } from "app-config.service";
import { Configuration } from "@scicatproject/scicat-sdk-ts";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy, OnInit, AfterViewChecked {
  loading$ = this.store.select(selectIsLoading);

  config: Config;

  title: string;
  facility: string;
  status: string;
  userMessageSubscription: Subscription = new Subscription();

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private appConfigService: AppConfigService,
    private apiConfigService: Configuration,
    private cdRef: ChangeDetectorRef,
    private metaService: Meta,
    public snackBar: MatSnackBar,
    private titleService: Title,
    private store: Store,
  ) {
    this.config = this.appConfigService.getConfig();
    this.facility = this.config.facility ?? "";
    this.status = this.appConfig.production ? "" : "test";
    this.title = "SciCat " + this.facility + " " + this.status;
    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: "description",
      content: "SciCat metadata catalogue at" + this.facility,
    });
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */
  ngOnInit() {
    this.apiConfigService.basePath = this.config.lbBaseURL;
    console.log(this.apiConfigService.basePath);

    this.store.dispatch(loadDefaultSettings({ config: this.config }));

    this.store.dispatch(fetchCurrentUserAction());
    if (window.location.pathname.indexOf("logout") !== -1) {
      this.logout();
    }

    this.userMessageSubscription = this.store
      .select(selectUserMessage)
      .subscribe((current) => {
        if (current && current.content !== undefined) {
          let panelClass = "";
          switch (current.type) {
            case MessageType.Success: {
              panelClass = "snackbar-success";
              break;
            }
            case MessageType.Error: {
              panelClass = "snackbar-error";
              break;
            }
          }
          this.snackBar.open(current.content, undefined, {
            duration: current.duration,
            panelClass,
          });
          this.store.dispatch(clearMessageAction());
        }
      });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.userMessageSubscription.unsubscribe();
  }

  logout(): void {
    this.store.dispatch(logoutAction());
  }
}
