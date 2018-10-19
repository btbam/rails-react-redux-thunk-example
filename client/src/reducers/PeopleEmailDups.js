import { PEOPLE_EMAIL_DUPS_BEGIN,
         PEOPLE_EMAIL_DUPS_SUCCESS
} from '../actions/Constants'

const initialState = {
  dups: new Object,
  loading: false,
  attempted: false
};

export default function peopleEmailDupsReducer(state = initialState, action) {
  switch(action.type) {
    case PEOPLE_EMAIL_DUPS_BEGIN:
      return {
        ...state,
        loading: true
      };

    case PEOPLE_EMAIL_DUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        attempted: true,
        dups: action.payload.dups
      };

    default:
      return state;
  }
}
