import ActionTypes from "./user-manager-action-constants";
// import {createNotification} from "../../utils/notificationHelper";

const Actions = {
    _addUser: (user) => {
        return {
            type: ActionTypes.ADD_USER_REQUEST,
            user
        };
    },
    _fetchUsers: () => {
        return {
            type: ActionTypes.FETCH_USER_REQUEST
        };
    },
    _openAddUserModal:() => {
        return {
            type: ActionTypes.OPEN_ADD_USER_MODAL
        };
    },
    _closeAddUserModal:() => {
        return {
            type: ActionTypes.CLOSE_ADD_USER_MODAL
        };
    }
};

export default Actions;
