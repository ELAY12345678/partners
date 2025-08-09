import feathers from "@feathersjs/client";
import { URL_BASE_API, URL_AUTHENTICATION } from "../constants";
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
const socket = io(URL_BASE_API);
const app = feathers();
app.configure(socketio(socket, {
    timeout: 60000
}));
app.configure(
    feathers.authentication({
        path: URL_AUTHENTICATION,
        entity: "user",
        service: "users",
        cookie: "feathers-jwt",
        storageKey: "feathers-jwt",
        storage: window.localStorage
    })
);
app.io.on("connect", () => {
    // alert("???")
    socket.on("tasks patched", (task) => {
        /*  openNotification({
           message: "Nueva Reservación",
           description: `${task.status}`
         }) */
        /* alert('New task updated' + JSON.stringify(task)) */
    });
    /* socket.on("messages created", () => {
        alert("CREATED!")
    }) */

})
app.io.on("close", () => {
    alert("Socket disconnected!");
})

export const LogOut = () => {
    return socket.close();
    /* return app.LogOut(); */
}
export default app;
