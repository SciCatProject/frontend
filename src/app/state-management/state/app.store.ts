import {
  DatasetState,
  initialDatasetState,
} from "state-management/state/datasets.store";
import { initialUserState, UserState } from "state-management/state/user.store";
import { initialJobsState, JobsState } from "state-management/state/jobs.store";
import {
  initialPolicyState,
  PolicyState,
} from "state-management/state/policies.store";
import {
  initialSampleState,
  SampleState,
} from "state-management/state/samples.store";
import {
  PublishedDataState,
  initialPublishedDataState,
} from "./published-data.store";
import { InstrumentState, initialInstrumentState } from "./instruments.store";

export interface AppState {
  datasets: DatasetState;
  user: UserState;
  jobs: JobsState;
  policies: PolicyState;
  samples: SampleState;
  publishedData: PublishedDataState;
  instruments: InstrumentState;
}

export const initialState: AppState = {
  datasets: initialDatasetState,
  user: initialUserState,
  jobs: initialJobsState,
  policies: initialPolicyState,
  samples: initialSampleState,
  publishedData: initialPublishedDataState,
  instruments: initialInstrumentState,
};
