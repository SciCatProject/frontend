import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { UserApi } from "shared/sdk";
import { ActionConfig, ActionDataset } from "./datafiles-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";

@Component({
  selector: "datafiles-action",
  //standalone: true,
  //imports: [],
  templateUrl: "./datafiles-action.component.html",
  styleUrls: ["./datafiles-action.component.scss"],
})
export class DatafilesActionComponent implements OnInit, OnChanges {
  @Input({ required: true }) actionConfig: ActionConfig;
  @Input({ required: true }) dataset: ActionDataset;
  @Input({ required: true }) files: DataFiles_File[];
  @Input({ required: true }) maxFileSize: number;

  jwt = "";
  visible = true;
  use_mat_icon = false;
  use_icon = false;
  disabled = false;
  disabled_condition = "false";
  selectedTotalFileSize = 0;
  numberOfFileSelected = 0;

  constructor(private userApi: UserApi) {
    this.userApi.jwt().subscribe((jwt) => {
      this.jwt = jwt.jwt;
    });
  }

  ngOnInit() {
    this.use_mat_icon = this.actionConfig.mat_icon !== undefined;
    this.use_icon = this.actionConfig.icon !== undefined;
    this.prepare_disabled_condition();
    this.update_status();
    this.compute_disabled();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes["files"]) {
      this.update_status();
      this.compute_disabled();
    }
  }

  update_status() {
    this.selectedTotalFileSize = this.files
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.size, 0);
    this.numberOfFileSelected = this.files.filter(
      (item) => item.selected,
    ).length;
  }

  prepare_disabled_condition() {
    if (this.actionConfig.enabled) {
      this.disabled_condition =
        "!(" +
        this.actionConfig.enabled
          .replaceAll(
            "#SizeLimit",
            "this.maxFileSize > 0 && this.selectedTotalFileSize <= this.maxFileSize",
          )
          .replaceAll("#Selected", "this.numberOfFileSelected > 0") +
        ")";
    } else if (this.actionConfig.disabled) {
      this.disabled_condition = this.actionConfig.enabled
        .replaceAll(
          "#SizeLimit",
          "this.maxFileSize > 0 && this.selectedTotalFileSize <= this.maxFileSize",
        )
        .replaceAll("#Selected", "this.numberOfFileSelected > 0");
    }
  }

  compute_disabled() {
    this.disabled = eval(this.disabled_condition);
  }

  add_input(name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  perform_action() {
    const form = document.createElement("form");
    form.target = this.actionConfig.target;
    form.method = this.actionConfig.method;
    form.action = this.actionConfig.url;

    form.appendChild(
      this.add_input("auth_token", this.userApi.getCurrentToken().id),
    );

    form.appendChild(this.add_input("jwt", this.jwt));

    form.appendChild(this.add_input("dataset", this.dataset.pid));

    form.appendChild(this.add_input("directory", this.dataset.sourceFolder));

    for (const [index, item] of this.files.entries()) {
      if (
        this.actionConfig.files === "all" ||
        (this.actionConfig.files === "selected" && item.selected)
      ) {
        form.appendChild(this.add_input("files[" + index + "]", item.path));
      }
    }

    document.body.appendChild(form);
    form.submit();
    window.open("", "view");
  }
}
