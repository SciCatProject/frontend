import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  getCurrentUser,
  getCurrentUserId,
  getProfile
} from "state-management/selectors/users.selectors";

/**
 * Component to show uneditable user details
 * @export
 * @class UserDetailsComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"]
})
export class UserDetailsComponent implements OnInit {
  public user: object;
  public userId: object;
  public profile: object;
  public displayName: string;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store.select(getCurrentUser).subscribe(user => {
      this.user = user;
      console.log(user);
    });
    this.store.select(getProfile).subscribe(profile => {
      this.profile = profile;
      console.log(this.profile);
    });
  }
}
