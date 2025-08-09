import { createStore, combineReducers } from "redux";
import appReducer from "./reducer";
import dashboardReducer from "../../views/orders/redux/reducer";

const rootReducer = combineReducers({
    appReducer,
    dashboardReducer
});

export const store = createStore(rootReducer);
