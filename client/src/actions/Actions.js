import * as actions from './Constants'

export function receiveMe(me) {
  return {
    type: actions.RECEIVE_ME,
    me
  }
}

export const fetchPeopleBegin = () => ({
  type: actions.FETCH_PEOPLE_BEGIN
});

export const fetchPeopleSuccess = people => ({
  type: actions.FETCH_PEOPLE_SUCCESS,
  payload: { people }
});

export const fetchPeopleError = error => ({
  type: actions.FETCH_PEOPLE_FAILURE,
  payload: { error }
});

export const peopleEmailCharsBegin = () => ({
  type: actions.PEOPLE_EMAIL_CHARS_BEGIN
});

export const peopleEmailCharsSuccess = chars => ({
  type: actions.PEOPLE_EMAIL_CHARS_SUCCESS,
  payload: { chars }
});

export const peopleEmailDupsBegin = () => ({
  type: actions.PEOPLE_EMAIL_DUPS_BEGIN
});

export const peopleEmailDupsSuccess = dups => ({
  type: actions.PEOPLE_EMAIL_DUPS_SUCCESS,
  payload: { dups }
});
