import { ADD_TASK } from "../../constants/";
import * as ActionTypes from "../../constants/ActionTypes";
import { COLOR_THEME } from "../../store/actions";
export const setSearchParam = data => {
  return {
    type: "SET_SEARCH_PARAM",
    payload: data
  };
};
/* Custom Actions */
export const changeSearch = data => {
  return {
    type: "CITY_CHANGE",
    data
  };
};
export const addTask = data => {
  return {
    type: ADD_TASK,
    data
  };
};
export const colorTheme = theme => {
  return {
    type: COLOR_THEME,
    theme
  };
};
export const updateTask = data => {
  return {
    type: ActionTypes.UPDATE_TASKS,
    data
  };
};
export const search = filter => {
  return {
    type: ActionTypes.CHANGE_SEARCH,
    filter
  };
};
export const setFilters = defaultFilters => {
  return {
    type: ActionTypes.CHANGE_FILTERS,
    defaultFilters
  };
};
