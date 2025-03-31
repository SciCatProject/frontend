import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { ActionConfig, ActionDataset } from "./datafiles-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AuthService } from "shared/services/auth/auth.service";
import { v4 } from "uuid";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "datafiles-action",
  //standalone: true,
  //imports: [],
  templateUrl: "./datafiles-action.component.html",
  styleUrls: ["./datafiles-action.component.scss"],
})
export class DatafilesActionComponent implements OnInit, OnChanges {
  @Input({ required: true }) actionConfig: ActionConfig;
  @Input({ required: true }) actionDataset: ActionDataset;
  @Input({ required: true }) files: DataFiles_File[];
  @Input({ required: true }) maxFileSize: number;

  jwt = "";
  visible = true;
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
  ) {
    this.usersService.usersControllerGetUserJWT().subscribe((jwt) => {
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

  ngOnInit() {
    this.use_mat_icon = this.actionConfig.mat_icon !== undefined;
    this.use_icon = this.actionConfig.icon !== undefined;
    this.prepare_disabled_condition();
    this.update_status();
    //this.compute_disabled();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["files"]) {
      this.update_status();
      //this.compute_disabled();
    }
  }

  update_status() {
    this.selectedTotalFileSize = this.files
      .filter((item) => item.selected || this.actionConfig.files === "all")
      .reduce((sum, item) => sum + item.size, 0);
    this.numberOfFileSelected = this.files.filter(
      (item) => item.selected,
    ).length;
  }

  get disabled() {
    this.update_status();
    this.prepare_disabled_condition();
    return eval(this.disabled_condition);
  }

  add_input(name, value) {
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

    this.form.appendChild(this.add_input("dataset", this.actionDataset.pid));

    this.form.appendChild(
      this.add_input("directory", this.actionDataset.sourceFolder),
    );

    let index = 0;
    for (const item of this.files) {
      if (
        this.actionConfig.files === "all" ||
        (this.actionConfig.files === "selected" && item.selected)
      ) {
        this.form.appendChild(
          this.add_input("files[" + index + "]", item.path),
        );
        index = index + 1;
      }
    }

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
        .replace(/{{ datasetPid }}/, this.actionDataset.pid)
        .replace(/{{ sourceFolder }}/, this.actionDataset.sourceFolder)
        .replace(
          /{{ filesPath }}/,
          JSON.stringify(
            this.files
              .filter(
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
        dataset: this.actionDataset.pid,
        directory: this.actionDataset.sourceFolder,
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
          console.log(`HTTP Error code: ${response.status}`);
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
}
