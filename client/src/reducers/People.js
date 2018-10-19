import { FETCH_PEOPLE_BEGIN,
         FETCH_PEOPLE_SUCCESS,
         FETCH_PEOPLE_FAILURE
} from '../actions/Constants'

const initialState = {
  people: [],
  loading: false,
  error: null
};

export default function peopleReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_PEOPLE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PEOPLE_SUCCESS:
      return {
        ...state,
        loading: false,
        people: action.payload.people
      };

    case FETCH_PEOPLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        // Maybe don't set to blank on error if we already have people?
        people: []
      };

    default:
      return state;
  }
}
