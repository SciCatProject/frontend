import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

/**
 * Compoennt to show uneditable user details
 * @export
 * @class UserDetailsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  public user: object;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store.select(state => state.root.user.currentUser).subscribe(user => {
      this.user = user;
    });
  }
}
