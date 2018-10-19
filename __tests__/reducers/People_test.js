import reducer from '../../client/src/reducers/People'
import * as types from '../../client/src/actions/Constants'

describe('People reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        people: [],
        loading: false,
        error: null
      }
    )
  })

  it('handles FETCH_PEOPLE_BEGIN', () => {
    // From an empty initial state
    expect(
      reducer({}, {
        type: types.FETCH_PEOPLE_BEGIN
      })
    ).toEqual(
      {
        loading: true,
        error: null
      }
    )

    // From an existing initial state
    expect(
      reducer(
        {
          people: [ { 'foo': 'bar' } ],
          loading: false,
          error: { 'error': 'bad' }
        }
        ,
        {
          type: types.FETCH_PEOPLE_BEGIN
        }
      )
    ).toEqual(
      {
        people: [ { 'foo': 'bar' } ],
        loading: true,
        error: null
      }
    )
  })

  it('handles FETCH_PEOPLE_SUCCESS', () => {
    // From an empty initial state
    expect(
      reducer({}, {
        type: types.FETCH_PEOPLE_SUCCESS,
        payload: { people: [ { 'foo': 'bar' } ] }
      })
    ).toEqual(
      {
        loading: false,
        people: [ { 'foo': 'bar' } ],
        error: null
      }
    )

    // From an existing initial state
    expect(
      reducer(
        {
          people: [ { 'foo': 'bar' } ],
          loading: false,
          error: { 'error': 'bad' }
        }
        ,
        {
          type: types.FETCH_PEOPLE_SUCCESS,
          payload: { people: [ { 'bar': 'baz' } ] }
        }
      )
    ).toEqual(
      {
        people: [ { 'bar': 'baz' }],
        loading: false,
        error: null
      }
    )
  })

  it('handles FETCH_PEOPLE_FAILURE', () => {
    // From an empty initial state
    expect(
      reducer({}, {
        type: types.FETCH_PEOPLE_FAILURE,
        payload: { error: { 'foo': 'bar' } }
      })
    ).toEqual(
      {
        loading: false,
        people: [],
        error: { 'foo': 'bar' }
      }
    )

    // From an existing initial state
    expect(
      reducer(
        {
          people: [ { 'foo': 'bar' } ],
          loading: true,
          error: { 'error': 'bad' }
        }
        ,
        {
          type: types.FETCH_PEOPLE_FAILURE,
          payload: { error: { 'bar': 'baz' } }
        }
      )
    ).toEqual(
      {
        people: [],
        loading: false,
        error: { 'bar': 'baz' }
      }
    )
  })
})