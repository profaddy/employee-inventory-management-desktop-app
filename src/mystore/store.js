import { createStore, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import history from "./history";
import rootReducer from "./rootReducer";
import sagaMiddleware from "./sagamiddleware";
import userManagerSagas from "../containers/UserManager/user-manager-sagas";
import entriesManagerSagas from "../containers/EntriesManager/entries-manager-sagas";
import inventoryrManagerSagas from "../containers/InventoryManager/inventory-manager-sagas";

const initialState = {};
const enhancers = [];
const middleware = [
    routerMiddleware(history),
    sagaMiddleware
];

if (process.env.NODE_ENV === "development") {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === "function") {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composedEnhancers
);
// export const  persistor = persistStore(store)
// sagaMiddleware.run(inventoryManagerSagas);
sagaMiddleware.run(userManagerSagas);
sagaMiddleware.run(entriesManagerSagas);
sagaMiddleware.run(inventoryrManagerSagas);

export default store; 
