
import {SearchCompleteAction, SEARCH_COMPLETE} from './datasets.actions'
describe('SearchCompleteAction', () => {
  it('should create an action', () => {
    const payload = [{id:1}];
    const action = new SearchCompleteAction(payload);

    expect({ ...action }).toEqual({ type: SEARCH_COMPLETE,  payload });
  });
});
