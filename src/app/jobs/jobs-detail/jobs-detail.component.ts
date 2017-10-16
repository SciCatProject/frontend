import {Component, OnInit} from '@angular/core';
import * as JobActions from 'state-management/actions/jobs.actions';
import {Job} from 'shared/sdk/models';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-jobs-detail',
  templateUrl: './jobs-detail.component.html',
  styleUrls: ['./jobs-detail.component.css']
})
export class JobsDetailComponent implements OnInit {

  job: Job = undefined;

    constructor(private route: ActivatedRoute,
              private store: Store<any>) {
  };



  ngOnInit() {


    this.store.select(state => state.root.job.currentSet)
      .subscribe(job => {
        if (job && Object.keys(job).length > 0) {
          this.job = <Job>job;
          console.log(this.job);
          this.store.dispatch({type: JobActions.SELECT_CURRENT, payload: undefined});
        }
      });

    this.store.select(state => state.root.jobs.currentSet).take(1).subscribe(job_exist => {
      if (!job_exist) {
        this.route.params.subscribe(params => {
          this.store.dispatch({type: JobActions.SEARCH_ID, payload: params.id});
        });
      }
    });
  }
}
