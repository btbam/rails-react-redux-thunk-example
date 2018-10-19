import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../client/src/actions/AsyncActions'
import * as types from '../../client/src/actions/Constants'
import fetchMock from 'fetch-mock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates FETCH_PEOPLE_SUCCESS when fetching people completes', () => {
    fetchMock
      .getOnce('/api/my_people.json', { body: { data: [ { 'foo': 'bar' }] }, headers: { 'content-type': 'application/json' } })


    const expectedActions = [
      { type: types.FETCH_PEOPLE_BEGIN },
      { type: types.FETCH_PEOPLE_SUCCESS, payload: { people: [ { 'foo': 'bar' } ] } }
    ]
    const store = mockStore({ people: [] })

    return store.dispatch(actions.fetchPeople()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates FETCH_PEOPLE_FAILURE when fetching people errors', () => {
    fetchMock
      .getOnce('/api/my_people.json', () => { throw 'Something went wrong' } )


    const expectedActions = [
      { type: types.FETCH_PEOPLE_BEGIN },
      { type: types.FETCH_PEOPLE_FAILURE, payload: { error: 'Something went wrong' } }
    ]
    const store = mockStore({ people: [] })

    return store.dispatch(actions.fetchPeople()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})


