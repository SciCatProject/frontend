// import { Action } from "@ngrx/store";
// import {
//   initialJobsState,
//   JobsState
// } from "state-management/state/jobs-old.store";
// import {
//   CurrentJobAction,
//   FAILED,
//   FailedAction,
//   RETRIEVE_COMPLETE,
//   RetrieveCompleteAction,
//   SEARCH_ID_COMPLETE,
//   SearchIDCompleteAction,
//   SELECT_CURRENT,
//   SORT_UPDATE,
//   SortUpdateAction,
//   SUBMIT_COMPLETE,
//   GET_COUNT_COMPLETE,
//   GetCountCompleteAction
// } from "state-management/actions/jobs-old.actions";

// export function jobsReducer(
//   state = initialJobsState,
//   action: Action
// ): JobsState {
//   if (action.type.indexOf("[Jobs]") !== -1) {
//     console.log("Action came in! " + action.type);
//   }

//   switch (action.type) {
//     case SORT_UPDATE: {
//       const { skip, limit, mode } = action as SortUpdateAction;
//       const filters = { skip, limit, mode, sortField: "creationTime:desc" };
//       return { ...state, filters, loading: true };
//     }

//     case SUBMIT_COMPLETE: {
//       return { ...state, jobSubmission: [] };
//     }

//     case FAILED: {
//       const error = (action as FailedAction).error;
//       return { ...state, error, jobSubmission: [] };
//     }

//     case RETRIEVE_COMPLETE: {
//       const currentJobs = (action as RetrieveCompleteAction).jobsets;
//       return { ...state, loading: false, currentJobs };
//     }

//     case GET_COUNT_COMPLETE: {
//       const totalJobNumber = (action as GetCountCompleteAction).totalJobNumber;
//       return { ...state, totalJobNumber };
//     }

//     // TODO: There is no field in the store called currentSet
//     case SELECT_CURRENT: {
//       const s = Object.assign({}, state, {
//         currentSet: (action as CurrentJobAction).job
//       });
//       return s;
//     }

//     // TODO: There is no field in the store called currentSet
//     case SEARCH_ID_COMPLETE: {
//       const d = (action as SearchIDCompleteAction).jobset;
//       return Object.assign({}, state, { currentSet: d, loading: false });
//     }

//     default: {
//       return state;
//     }
//   }
// }
