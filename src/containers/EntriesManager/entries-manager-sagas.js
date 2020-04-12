import Actions from "./entries-manager-action-constants";
import moment from "moment";
import { createNotification } from "../../utils/notificationHelper";
import { all, put, call, takeEvery } from "redux-saga/effects";
import { fetchEntries, addEntry,filterEntries, fetchEntryInfo, updateEntry, deleteEntry } from "./entries-manager-api.js";

function* addEntrySaga(action) {
    try {
        yield call(addEntry, action.data);
        yield put(createNotification("Entry added successfully", "success"));
        yield put({ type: Actions.ADD_ENTRY_SUCCESS });
    } catch (error) {
        yield put(createNotification(`${error.response.data.message}`, "error"));
        yield put({ type: Actions.ADD_ENTRY_FAILURE });
    }
}

function* updateEntrySaga(action) {
    try {
        yield call(updateEntry, action.data);
        yield put(createNotification("Entry updated successfully", "success"));
        yield put({ type: Actions.UPDATE_ENTRY_SUCCESS });
        yield put({ type: Actions.CLOSE_ADD_ENTRY_MODAL });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        yield put(createNotification(`${error.response.data.message}`, "error"));
        yield put({ type: Actions.UPDATE_ENTRY_FAILURE });
    }
}

function* deleteEntrySaga(action) {
    try {
        yield call(deleteEntry, action.data);
        yield put(createNotification("Entry deleted successfully", "success"));
        yield put({ type: Actions.DELETE_ENTRY_SUCCESS });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        yield put(createNotification(`${error.response.data.message}`, "error"));
        yield put({ type: Actions.DELETE_ENTRY_FAILURE });
    }
}
function* fetchEntriesSaga(action) {
    try {
        const { data } = yield call(fetchEntries);
        const { entries } = data;
        const formattedEntries = entries.reduce((acc, item) => {
            const created_at = moment.utc(item.created_at, "YYYY-MM-DDThh:mm:ss.sssZ").local().format("DD-MM-YYYY");
            const entry = [
                created_at,
                item.product_name,
                item.user_name,
                item.taken,
                item.consumed,
                item.returned,
                item.remaining,
                item._id,
                item._id
            ];
            acc.push(entry);
            return acc;
        }, []);
        yield put({ type: Actions.FETCH_ENTRY_SUCCESS, data: formattedEntries });
    } catch (error) {
        yield put(createNotification(`error while fetching entry: ${error.response.data.message}`, "error"));
        yield put({ type: Actions.FETCH_ENTRY_FAILURE });
    }
}

function* fetchEntryInfoSaga(action) {
    try {
        const { id } = action;
        const { data } = yield call(fetchEntryInfo, id);
        let { entry } = data;
        const created_at = moment.utc(entry.created_at, "YYYY-MM-DDThh:mm:ss.sssZ").local().format("DD-MM-YYYY");
        const entryToBeUpdated = {
            ...entry,
            created_at:created_at,
            product_name:entry.product_name,
            user_name:entry.user_name,
            taken:entry.taken,
            consumed:entry.consumed,
            returned:entry.returned,
            remaining:entry.remaining,
            _id:entry._id
        };
        yield put({ type: Actions.FETCH_ENTRY_INFO_SUCCESS, data: entryToBeUpdated });
        if(action.mode === "edit"){
            yield put({ type: Actions.FETCH_ENTRY_INFO_SUCCESS, data: entry });
            yield put({ type: Actions.OPEN_ADD_ENTRY_MODAL });
        }
    } catch (error) {
        yield put(createNotification(`error while fetching entry info: ${error.response.data.message}`, "error"));
        yield put({ type: Actions.FETCH_ENTRY_INFO_FAILURE });
    }
}

function* filterEntrySaga(action){
    try {
        const { user_id, created_at} = action.data;
        const { data } = yield call(filterEntries,user_id, created_at);
        const { filteredEntries } = data;
        const formattedEntries = filteredEntries.reduce((acc, item) => {
            const entry = [
                item.product_name,
                item.taken,
                item.consumed,
                item.returned,
                item.remaining,
            ];
            acc.push(entry);
            return acc;
        }, []);
        yield put({ type: Actions.FILTER_ENTRY_SUCCESS, data: formattedEntries });
    } catch (error) {
        yield put(createNotification(`error while fetching entry: ${error.response.data.message}`, "error"));
        yield put({ type: Actions.FILTER_ENTRY_FAILURE });
    }
}

export default function* entriesMnaagerSagas() {
    yield all([
        takeEvery(Actions.ADD_ENTRY_REQUEST, addEntrySaga),
        takeEvery(Actions.UPDATE_ENTRY_REQUEST, updateEntrySaga),
        takeEvery(Actions.DELETE_ENTRY_REQUEST,deleteEntrySaga),
        takeEvery(Actions.FETCH_ENTRY_REQUEST, fetchEntriesSaga),
        takeEvery(Actions.FETCH_ENTRY_INFO_REQUEST, fetchEntryInfoSaga),
        takeEvery(Actions.FILTER_ENTRY_REQUEST, filterEntrySaga)
    ]);
}
