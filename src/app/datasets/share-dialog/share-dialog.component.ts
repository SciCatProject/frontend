import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import {
  UserIdentitiesService,
  UsersService,
} from "@scicatproject/scicat-sdk-ts";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.scss"],
})
export class ShareDialogComponent {
  data: any;
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  users: string[] = [];
  infoMessage = "";

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    public store: Store,
    public userIdentititiesService: UserIdentitiesService,
    @Inject(MAT_DIALOG_DATA)
    data: {
      infoMessage: string;
      disableShareButton: boolean;
      sharedUsersList: string[];
    },
  ) {
    this.data = JSON.parse(JSON.stringify(data));
    this.users = this.data.sharedUsersList;
  }

  isInvalid = (): boolean =>
    this.emailFormControl.hasError("email") ||
    this.emailFormControl.hasError("required");

  add = async (email: string): Promise<void> => {
    try {
      const isValidEmail = await this.userIdentititiesService
        .userIdentitiesControllerIsValidEmail(
          JSON.stringify({
            where: { "profile.email": email.trim() },
          }),
        )
        .toPromise();

      if (!isValidEmail) {
        const message = new Message(
          "The email address is not connected to a SciCat user",
          MessageType.Error,
          5000,
        );
        this.store.dispatch(showMessageAction({ message }));

        return;
      }

      this.users.push(email.trim());
      this.emailFormControl.reset();
    } catch (error) {
      const message = new Message(
        "The email address is not connected to a SciCat user",
        MessageType.Error,
        5000,
      );
      this.store.dispatch(showMessageAction({ message }));
    }
  };

  remove = (email: string): void => {
    const index = this.users.indexOf(email);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  };

  isEmpty = (): boolean =>
    this.users.length === 0 || this.data.disableShareButton;

  share = (): void => this.dialogRef.close({ users: this.users });

  removeAll = (): void => this.dialogRef.close({ users: [] });

  cancel = (): void => this.dialogRef.close();
}
