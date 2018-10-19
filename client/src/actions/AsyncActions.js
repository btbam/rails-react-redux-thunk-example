import * as actions from './Actions'

export const creds = { credentials: 'same-origin' };

export function fetchMe() {
  return dispatch => {
    return fetch('/api/me.json', creds).
      then(response => response.json()).
      then(me => dispatch(actions.receiveMe(me)));
  }
}

export function fetchPeople() {
  return dispatch => {
    dispatch(actions.fetchPeopleBegin());
    return fetch('/api/my_people.json', creds)
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(actions.fetchPeopleSuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(actions.fetchPeopleError(error)));
  };
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function peopleEmailChars(people) {
  var chars = {}
  
  return dispatch => {
    dispatch(actions.peopleEmailCharsBegin());
    people.forEach(function (person) {
      var str = person.attributes['email-address'];
      for(var x = 0, length = str.length; x < length; x++) {
        var l = str.charAt(x).toUpperCase()
        chars[l] = (isNaN(chars[l]) ? 1 : chars[l] + 1);
      }
    });
    dispatch(actions.peopleEmailCharsSuccess(chars));
    return chars
  };
}

export function peopleEmailDups(people) {
  var dups = {}
  
  return dispatch => {
    dispatch(actions.peopleEmailDupsBegin());
    var emails = people.map(person => person.attributes['email-address'])
    people.forEach(function (person) {
      var email = person.attributes['email-address'];
      if(emails.indexOf(email) != emails.lastIndexOf(email)) {
        if(dups[email]){
          dups[email].push(email)
        } else {
          dups[email] = [email]
        }
      }
      for(var i = 0; i < email.length; i++) {
        var possible_dup = email.substring(0, i) + email.substring(i + 1);
        if(emails[possible_dup]) {
          if(dups[email]){
            dups[email].push(possible_dup)
          } else {
            dups[email] = [possible_dup]
          }
        }
      }
    });
    dispatch(actions.peopleEmailDupsSuccess(dups));
    return dups
  };
}