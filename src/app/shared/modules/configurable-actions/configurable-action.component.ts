import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { ActionConfig, ActionItem } from "./configurable-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AuthService } from "shared/services/auth/auth.service";
import { v4 } from "uuid";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { updatePropertyAction } from "state-management/actions/datasets.actions";

@Component({
  selector: "configurable-action",
  templateUrl: "./configurable-action.component.html",
  styleUrls: ["./configurable-action.component.scss"],
  standalone: false,
})
export class ConfigurableActionComponent implements OnInit, OnChanges {
  @Input({ required: true }) actionConfig: ActionConfig;
  @Input({ required: true }) actionItems: ActionItem[];
  @Input() files?: DataFiles_File[];
  @Input({ required: true }) maxFileSize: number;

  jwt = "";
  use_mat_icon = false;
  use_icon = false;
  disabled_condition = "false";
  selectedTotalFileSize = 0;
  numberOfFileSelected = 0;

  form: HTMLFormElement = null;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {
    this.usersService.usersControllerGetUserJWTV3().subscribe((jwt) => {
      this.jwt = jwt.jwt;
    });
  }

  private evaluate_disabled_condition(condition: string) {
    return condition
      .replaceAll(
        "#SizeLimit",
        String(
          this.maxFileSize > 0 &&
            this.selectedTotalFileSize <= this.maxFileSize,
        ),
      )
      .replaceAll("#Selected", String(this.numberOfFileSelected > 0));
  }

  private evaluate_hidden_condition(condition: string) {
    return condition
      .replaceAll(
        "#isPublished",
        String(this.actionItems[0].isPublished === true),
      )
      .replaceAll(
        "#!isPublished",
        String(this.actionItems[0].isPublished === false),
      );
  }

  private prepare_disabled_condition() {
    if (this.actionConfig.enabled) {
      this.disabled_condition =
        "!(" +
        this.evaluate_disabled_condition(this.actionConfig.enabled) +
        ")";
    } else if (this.actionConfig.disabled) {
      this.disabled_condition = this.evaluate_disabled_condition(
        this.actionConfig.disabled,
      );
    } else {
      this.disabled_condition = "false";
    }
  }

  private prepare_hidden_condition() {
    if (this.actionConfig.hidden) {
      return (
        "!(" + this.evaluate_hidden_condition(this.actionConfig.hidden) + ")"
      );
    } else {
      return "false";
    }
  }

  ngOnInit() {
    this.use_mat_icon = !!this.actionConfig.mat_icon;
    this.use_icon = this.actionConfig.icon !== undefined;
    this.prepare_disabled_condition();
    this.update_status();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["files"]) {
      this.update_status();
    }
  }

  update_status() {
    this.selectedTotalFileSize = this.files
      ?.filter((item) => item.selected || this.actionConfig.files === "all")
      .reduce((sum, item) => sum + item.size, 0);
    this.numberOfFileSelected = this.files?.filter(
      (item) => item.selected,
    ).length;
  }

  get disabled() {
    this.update_status();
    this.prepare_disabled_condition();

    const expr = this.disabled_condition;
    const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);

    return fn({
      maxFileSize: this.maxFileSize,
      selectedTotalFileSize: this.selectedTotalFileSize,
      numberOfFileSelected: this.numberOfFileSelected,
    });
  }

  get visible() {
    if (!this.actionConfig.hidden) {
      return true;
    } else {
      const expr = this.prepare_hidden_condition();
      const fn = new Function("ctx", `with (ctx) { return (${expr}); }`);

      return fn({
        isPublished: this.actionItems[0]?.isPublished === true,
      });
    }
  }

  add_input(name: string, value: string) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  perform_action() {
    const action_type = this.actionConfig.type || "form";
    switch (action_type) {
      case "json-download":
        return this.type_json_download();
      case "xhr":
        return this.type_xhr();
      case "form":
      default:
        return this.type_form();
    }
  }

  type_form() {
    if (this.form !== null) {
      document.body.removeChild(this.form);
    }

    this.form = document.createElement("form");
    this.form.target = this.actionConfig.target || "_self";
    this.form.method = this.actionConfig.method || "POST";
    this.form.action = this.actionConfig.url;
    this.form.style.display = "none";

    this.form.appendChild(
      this.add_input("auth_token", `Bearer ${this.authService.getToken().id}`),
    );

    this.form.appendChild(this.add_input("jwt", this.jwt));

    this.actionItems.forEach((actionItem, index) => {
      this.form.appendChild(this.add_input(`item[${index}]`, actionItem.pid));
      this.form.appendChild(
        this.add_input(`directory[${index}]`, actionItem.sourceFolder),
      );
    });

    this.files?.forEach((item, index) => {
      if (
        this.actionConfig.files === "all" ||
        (this.actionConfig.files === "selected" && item.selected)
      ) {
        this.form.appendChild(this.add_input(`files[${index}]`, item.path));
      }
    });

    document.body.appendChild(this.form);
    this.form.submit();

    return true;
  }

  type_json_download() {
    let payload = "";
    if (this.actionConfig.payload) {
      payload = this.actionConfig.payload
        .replace(/{{ auth_token }}/, `Bearer ${this.authService.getToken().id}`)
        .replace(/{{ jwt }}/, this.jwt)
        .replace(/{{ pid }}/, this.actionItems.map((i) => i.pid).join(","))
        .replace(
          /{{ sourceFolder }}/,
          this.actionItems.map((i) => i.sourceFolder).join(","),
        )
        .replace(
          /{{ filesPath }}/,
          JSON.stringify(
            this.files
              ?.filter(
                (item) =>
                  this.actionConfig.files === "all" ||
                  (this.actionConfig.files === "selected" && item.selected),
              )
              .map((item) => item.path),
          ),
        );
    } else {
      const data = {
        auth_token: `Bearer ${this.authService.getToken().id}`,
        jwt: this.jwt,
        items: this.actionItems.map((i) => i.pid),
        directories: this.actionItems.map((i) => i.sourceFolder),
        files: this.files
          .filter(
            (item) =>
              this.actionConfig.files === "all" ||
              (this.actionConfig.files === "selected" && item.selected),
          )
          .map((item) => item.path),
      };
      payload = JSON.stringify(data);
    }

    const filename = this.actionConfig.filename.replace(/{{ uuid }}/, v4());

    fetch(this.actionConfig.url, {
      method: this.actionConfig.method || "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          // http error
          return Promise.reject(
            new Error(`HTTP Error code: ${response.status}`),
          );
        }
      })
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log("Datafile action error : ", error);
        this.snackBar.open(
          "There has been an error performing the action",
          "Close",
          {
            duration: 2000,
          },
        );
      });

    return true;
  }

  type_xhr() {
    for (const element of this.actionItems) {
      const payload = this.actionConfig.payload || "";
      const url = this.actionConfig.url.replace(
        /{{id}}/,
        encodeURIComponent(element.pid),
      );

      fetch(url, {
        method: this.actionConfig.method || "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authService.getToken().id}`,
        },
        body: payload,
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject(
              new Error(`HTTP Error code: ${response.status}`),
            );
          }

          this.store.dispatch(
            updatePropertyAction({
              pid: element.pid,
              property: JSON.parse(this.actionConfig.payload),
            }),
          );

          return response;
        })
        .catch((error) => {
          console.log("Error: ", error);
          this.snackBar.open(
            "There has been an error performing the action",
            "Close",
            {
              duration: 2000,
            },
          );
        });
    }

    return true;
  }
}
