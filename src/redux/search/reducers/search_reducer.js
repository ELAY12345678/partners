import * as ActionTypes from "../../../constants/actionTypes";

const Search = (state = {}, action = {}) => {
  switch (action.type) {
    case "SET_SEARCH_PARAM":
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
      break;
    case "CITY_CHANGE":
      return {
        ...state,
        data: action.data
      };
      break;
    case ActionTypes.ADD_TASK:
      return {
        ...state,
        task: action.task
      };
      break;
    case ActionTypes.COLOR_THEME:
      return {
        ...state,
        theme: action.theme
      };
      break;
    case ActionTypes.UPDATE_TASKS:
      console.log("QUE VIENE AQUI!", action);
      return {
        ...state,
        task: action.task
      };
      break;
    case ActionTypes.CHANGE_SEARCH:
      return {
        ...state,
        filter: action.filter
      };
      break;
    case ActionTypes.CHANGE_FILTERS:
      return {
        ...state,
        defaultFilters: action.defaultFilters
      };
      break;
    default:
      return state;
      break;
  }
};

export default Search;
