import { Component, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { UserIdentity, UserIdentityApi } from "shared/sdk";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.scss"],
})
export class ShareDialogComponent implements OnDestroy {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  emails: string[] = [];
  userIdentitySubsription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    public store: Store<any>,
    public userIdentityApi: UserIdentityApi
  ) {}

  isInvalid = (): boolean =>
    this.emailFormControl.hasError("email") ||
    this.emailFormControl.hasError("required");

  add = (email: string): void => {
    this.userIdentitySubsription = this.userIdentityApi
      .find<UserIdentity>({ where: { "profile.email": email.trim() } })
      .pipe(first())
      .subscribe((userIdentities) => {
        if (userIdentities.length > 0) {
          console.log(userIdentities);
          this.emails.push(email);
          this.emailFormControl.reset();
        } else {
          const message = new Message(
            "The email address is not connected to a SciCat user",
            MessageType.Error,
            5000
          );
          this.store.dispatch(showMessageAction({ message }));
        }
      });
  };

  remove = (email: string): void => {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  };

  isEmpty = (): boolean => this.emails.length === 0;

  share = (): void => this.dialogRef.close({ users: this.emails });

  cancel = (): void => this.dialogRef.close();

  ngOnDestroy() {
    this.userIdentitySubsription.unsubscribe();
  }
}
