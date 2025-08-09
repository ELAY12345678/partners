import produce from 'immer';
import * as actionType from "./actions";
import { reAuthenticate } from "../../services/services";
import _ from 'lodash';

const initialState = {
  collapsedMenu: true,
  collapsedNotification: true,
  updated: false,
  dropMenu: false,
  notificationsData: [],
  notificationsDataCount: 0
};

const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case actionType.SET_NOTIFICATION_DATA:
        if (!_.find(draft.notificationsData, ({ id, notificationType }) => action.payload.id === id && action.payload.notificationType === notificationType))
          draft.notificationsData.push(action.payload);
        draft.collapsedNotification = false;
        draft.notificationsDataCount = draft.notificationsData.length;
        break;
      case actionType.REMOVE_NOTIFICATION_DATA:
        _.remove(draft.notificationsData, (element) => {
          return (element.id === action.payload.id && element.notificationType === action.payload.notificationType)
        })
        if (draft.notificationsData.length === 0)
          draft.collapsedNotification = true;
        draft.notificationsDataCount = draft.notificationsData.length;
        break;
      case actionType.AUTHENTICATION:
        draft.user = {
          permissionsv2:[],
          ...action.user,
        };
        break;
      case actionType.COLLAPSE_NOTIFICATION:
        draft.collapsedNotification = !state.collapsedNotification;
        break;
      case actionType.COLLAPSE_MENU:
        draft.collapsedMenu = !state.collapsedMenu;
        break;
      case actionType.DROP_MENU:
        draft.dropMenu = action.dropMenu;
        break;
      case actionType.UPDATE_LIST:
        draft.updated = action.updated;
        break;
      case actionType.CHAGE_PATH:
        draft.pathname = action.pathname;
        break;
      case actionType.CHAGE_PAGE:
        draft.current = action.current;
        break;
      case actionType.NOTIFICATION:
        draft.notify = action.notify;
        break;
      case actionType.ADD_TASK:
        draft.task = action.task;
        break;
      case actionType.UPDATE_TASKS:
        let { data } = action;
        draft.task = data.log;
        break;
      case actionType.COLOR_THEME:
        let { theme } = action;
        draft.theme = theme;
        break;
      case actionType.RE_AUTHENTICATION:
        reAuthenticate()
          .then(response => {
            console.log("Si wuapió!");
          })
          .catch(err => console.log("No wapió!"));
        draft.user = action.user;
        break;
      case actionType.CHANGE_SEARCH:
        draft.filter = action.filter;
        break;
      case actionType.CHANGE_FILTERS:
        draft.defaultFilters = action.defaultFilters;
        break;
      case actionType.LINKED_PRODUCTS:
        draft.slugPath = action.slugPath;
        break;
      default:
        break;
    }
  });

export default reducer;
