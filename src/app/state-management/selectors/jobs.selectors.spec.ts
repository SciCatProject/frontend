import * as fromJobSelectors from "./jobs.selectors";

import { JobsState} from "../state/jobs.store";

const initialJobsState: JobsState = {
  currentJobs: [],
  jobSubmission: undefined,
  filters: {'skip': 0, 'limit': 50},
  totalJobNumber: 1000,
  ui: [],
  loading: false,
  error: undefined
};


