import Actions from "./user-manager-action-constants";
import { all, put, select, takeEvery, call } from "redux-saga/effects";
import { fetchUsers, addUser } from "./user-manager-api.js";
import {createNotification} from "../../utils/notificationHelper";

function* fetchUsersSaga(action) {
    try {
        const { data } = yield call(fetchUsers);
        const { users } = data;
        const formattedUsers = users.reduce((acc, item) => {
            const entry = { name: item.name, value: item._id };
            acc.push(entry);
            return acc;
        }, []);
        yield put({ type: Actions.FETCH_USER_SUCCESS, data: formattedUsers });
    } catch (error) {
        yield put({ type: Actions.FETCH_ENTRY_FAILURE });
    }
}

export function* addUserSaga(action) {
    try {
        yield call(addUser, action.user);
        yield put(createNotification("User added successfully", "success"));
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.log(error);
        yield put(createNotification(`error while adding entry: ${error && error.response.data.message}`, "error"));
        yield put({ type: Actions.ADD_USER_FAILURE });

    }
}

export default function* userManagerSagas() {
    yield all([
        takeEvery(Actions.ADD_USER_REQUEST, addUserSaga),
        takeEvery(Actions.FETCH_USER_REQUEST, fetchUsersSaga)
    ]);
}
