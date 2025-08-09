import { combineReducers } from "redux";
import SearchReducer from "./search_reducer";

const rootReducer = combineReducers({
  search: SearchReducer
});

export default rootReducer;
