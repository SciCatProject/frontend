import { jobsReducer } from './jobs.reducer';
import { initialJobsState, JobsState} from '../state/jobs.store';
import * as jobsActions from '../actions/jobs.actions';
import {Job } from '../models';
import { JobInterface } from 'shared/sdk';

describe('DatasetsReducer', () => {

    it('should set loading to true after sort update complete', () => {
        const filter = {'skip': 0, 'limit': 50}
        const action = new jobsActions.SortUpdateAction(filter.skip, filter.limit);
        const state = jobsReducer(initialJobsState, action);
        expect(state.loading).toEqual(true);
    })

    it('should set filters', () => {
        const filter = {'skip': 0, 'limit': 50}
        const action = new jobsActions.SortUpdateAction(filter.skip, filter.limit);
        const state = jobsReducer(initialJobsState, action);
        expect(state.filters).toEqual(filter);
    })

    it('should set ui', () => {
        const ui =  [];
        const action = new jobsActions.ChildRetrieveAction(ui);
        const state = jobsReducer(initialJobsState, action);
        expect(state.ui).toEqual(ui);
    })

    it('should set jobSubmission to an empty array', () => {
        const job = new Job()
        const action = new jobsActions.SubmitCompleteAction(job);
        const state = jobsReducer(initialJobsState, action);
        expect(state.jobSubmission.length).toEqual(0);
    })

    it('should set error', () => {
        const error = new Error;
        const action = new jobsActions.FailedAction(error);
        const state = jobsReducer(initialJobsState, action);
        expect(state.error).toEqual(error);
    })

    it('should set loading to false after sort retrieve complete', () => {
        const jobset = new Job;
        const jobsets = [jobset]
        const action = new jobsActions.RetrieveCompleteAction(jobsets);
        const state = jobsReducer(initialJobsState, action);
        expect(state.loading).toEqual(false);
    })

    it('should set current jobs', () => {
        const data = {
            "emailJobInitiator": '',
            "type": '',
            "creationTime": new Date(),
            "executionTime": new Date(),
            "jobParams": '',
            "jobStatusMessage": '',
            "archiveReturnMessage": '',
            "dateOfLastMessage": new Date(),
            "datasetList": '',
            "createdAt": new Date(),
            "updatedAt": new Date(),
        };

        const jobsets = [
            new Job({...data, id: 'job 1'}), 
            new Job({...data, id: "job 2"}),
            new Job({...data, id: "job 3"})
        ];
        const action = new jobsActions.RetrieveCompleteAction(jobsets);
        const state = jobsReducer(initialJobsState, action);
        expect(state.currentJobs.length).toEqual(jobsets.length);
    })

    it('should set loading to false after search id complete', () => {
        const job: Job = {
            "emailJobInitiator": '',
            "type": '',
            "creationTime": new Date(),
            "executionTime": new Date(),
            "jobParams": '',
            "jobStatusMessage": '',
            "archiveReturnMessage": '',
            "dateOfLastMessage": new Date(),
            "datasetList": '',
            "id": '',
            "createdAt": new Date(),
            "updatedAt": new Date(),
        };
        const action = new jobsActions.SearchIDCompleteAction(job);
        const state = jobsReducer(initialJobsState, action);
        expect(state.loading).toEqual(false);
    });
});