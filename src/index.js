import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Normalize } from "styled-normalize";
import { Provider } from "react-redux";
import { store } from "./redux/app"; 
import 'antd/dist/antd.css';

ReactDOM.render(
  <Provider store={store} onUpdate={() => window.scrollTo(0, 0)}>
    <Normalize />
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
