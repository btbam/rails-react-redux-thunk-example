import { PEOPLE_EMAIL_CHARS_BEGIN,
         PEOPLE_EMAIL_CHARS_SUCCESS
} from '../actions/Constants'

const initialState = {
  chars: new Object,
  loading: false,
};

export default function peopleEmailCharsReducer(state = initialState, action) {
  switch(action.type) {
    case PEOPLE_EMAIL_CHARS_BEGIN:
      return {
        ...state,
        loading: true
      };

    case PEOPLE_EMAIL_CHARS_SUCCESS:
      return {
        ...state,
        loading: false,
        chars: action.payload.chars
      };

    default:
      return state;
  }
}
