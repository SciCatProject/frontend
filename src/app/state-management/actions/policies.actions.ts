import { createAction, props } from "@ngrx/store";
import { Policy } from "state-management/models";

export const fetchPoliciesAction = createAction("[Policy] Fetch Policies");
export const fetchPoliciesCompleteAction = createAction(
  "[Policy] Fetch Policies Complete",
  props<{ policies: Policy[] }>(),
);
export const fetchPoliciesFailedAction = createAction(
  "[Policy] Fetch Policies Failed",
);

export const fetchCountAction = createAction("[Policy] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[Policy] Fetch Count Complete",
  props<{ count: number }>(),
);
export const fetchCountFailedAction = createAction(
  "[Policy] Fetch Count Failed",
);

export const fetchEditablePoliciesAction = createAction(
  "[Policy] Fetch Editable Policies",
);
export const fetchEditablePoliciesCompleteAction = createAction(
  "[Policy] Fetch Editable Policies Complete",
  props<{ policies: Policy[] }>(),
);
export const fetchEditablePoliciesFailedAction = createAction(
  "[Policy] Fetch Editable Policies Failed",
);

export const fetchEditableCountAction = createAction(
  "[Policy] Fetch Editable Policies Count",
);
export const fetchEditableCountCompleteAction = createAction(
  "[Policy] Fetch Editable Policies Count Complete",
  props<{ count: number }>(),
);
export const fetchEditableCountFailedAction = createAction(
  "[Policy] Fetch Editable Policies Count Failed",
);

export const submitPolicyAction = createAction(
  "[Policy] Submit Policy",
  props<{ ownerList: string[]; policy: Policy }>(),
);
export const submitPolicyCompleteAction = createAction(
  "[Policy] Submit Policy Complete",
  props<{ policy: Policy }>(),
);
export const submitPolicyFailedAction = createAction(
  "[Policy] Submit Policy Failed",
);

export const selectPolicyAction = createAction(
  "[Policy] Select Policy",
  props<{ policy: Policy }>(),
);
export const deselectPolicyAction = createAction(
  "[Policy] Deselect Policy",
  props<{ policy: Policy }>(),
);

export const selectAllPoliciesAction = createAction("[Policy] Select all");
export const clearSelectionAction = createAction("[Policy] Clear Selection");

export const changePageAction = createAction(
  "[Policy] Change Page",
  props<{ page: number; limit: number }>(),
);
export const changeEditablePageAction = createAction(
  "[Policy] Change Editable Page",
  props<{ page: number; limit: number }>(),
);

export const sortByColumnAction = createAction(
  "[Policy] Sort By Column",
  props<{ column: string; direction: string }>(),
);
export const sortEditableByColumnAction = createAction(
  "[Policy] Sort Editable By Column",
  props<{ column: string; direction: string }>(),
);

export const clearPoliciesStateAction = createAction("[Policy] Clear State");
