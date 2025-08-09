import {
  savedListings,
  userService,
  recoveryPassword,
  changePassword,
  mylistings,
} from "./services";

export const get_saved_listings = (query = {}) => savedListings.find(query);
export const remove_saved_listing = (id) => savedListings.remove(id);
export const remove_users = (id) => userService.remove(id);
export const recovery_password = (params) => recoveryPassword.create(params);
export const change_password = (params) => changePassword.create(params);
export const update_listing = (id, params) => mylistings.patch(id, params);
export const get_listing = (id) => mylistings.get(id);
export * from "./services";
