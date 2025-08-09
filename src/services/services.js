import { feathers as api, socket, LogOut } from "../api";

export const getService = (service) => api.service(service);
export const savedListings = api.service("user-saved-listings");
export const userService = api.service("users");
export const recoveryPassword = api.service("recovery-password");
export const changePassword = api.service("change-password");
export const mylistings = api.service("my-listings");
export const reAuthenticate = api.reAuthenticate;
export const Logout = api.logout;
export const current = () => api.service("current-user").find({});
export const authenticate = ({
  strategy = "local",
  email,
  password,
  ...rest
}) => {
  return api.authenticate({
    strategy,
    email,
    password,
    ...rest,
  });
};
export const tasks = socket.service("tasks");
export const LogActions = socket.service("log-actions");
export const OrderService = socket.service("reservations");
export const payPaymentsService = socket.service("pay-payments");
export const payWithdrawalService = socket.service("pay-withdrawal");
export const getSocket = (service) => socket.service(service);
export const disconnect = LogOut;
