import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import history from "./history";
import notification from "../HOC/notifications/notification-reducer";
import InventoryManager from "../containers/InventoryManager/inventory-manager-reducer";
import EntriesManager from "../containers/EntriesManager/entries-manager-reducer";
import UserManager from "../containers/UserManager/user-manager-reducer";

export default combineReducers({
    notification: notification,
    router: connectRouter(history),
    UserManager: UserManager,
    EntriesManager: EntriesManager,
    InventoryManager: InventoryManager
});
