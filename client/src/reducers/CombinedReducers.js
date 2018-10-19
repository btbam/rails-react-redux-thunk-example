import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { me } from './Me'
import people from './People'
import peopleEmailChars from './PeopleEmailChars'
import peopleEmailDups from './PeopleEmailDups'

const Reducers = combineReducers({
  router: routerReducer,
  me,
  people,
  peopleEmailChars,
  peopleEmailDups
});

export default Reducers