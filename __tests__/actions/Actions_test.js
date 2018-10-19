import * as actions from '../../client/src/actions/Actions'
import * as types from '../../client/src/actions/Constants'

describe('actions', () => {
  it('creates an action to begin fetching people', () => {
    const expectedAction = {
      type: types.FETCH_PEOPLE_BEGIN
    }
    expect(actions.fetchPeopleBegin()).toEqual(expectedAction)
  })

  it('creates an action for fetch people success', () => {
    const people = {}
    const expectedAction = {
      type: types.FETCH_PEOPLE_SUCCESS,
      payload: { people }
    }
    expect(actions.fetchPeopleSuccess(people)).toEqual(expectedAction)
  })

  it('creates an action for fetch people failure', () => {
    const error = {}
    const expectedAction = {
      type: types.FETCH_PEOPLE_FAILURE,
      payload: { error }
    }
    expect(actions.fetchPeopleError(error)).toEqual(expectedAction)
  })
})
