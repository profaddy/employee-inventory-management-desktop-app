import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Notifications from "./HOC/notifications/index";
import { SnackbarProvider } from "notistack";
import routes from "./routes";
import theme from "./utils/theme";
import { store, history } from "./mystore";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider>
            <ConnectedRouter history={history}>
                {/* <PersistGate  persistor={persistor}> */}
                <MuiThemeProvider theme={theme}>
                    <Notifications />
                    {routes}
                </MuiThemeProvider>

                {/* </PersistGate> */}
            </ConnectedRouter>
        </SnackbarProvider>
    </Provider>,
    rootElement
);
