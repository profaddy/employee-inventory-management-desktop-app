import Actions from "./inventory-manager-action-constants";
import { all, put, takeEvery, call } from "redux-saga/effects";
import { fetchInventories, addInventory } from "./inventory-manager-api.js";
import { createNotification } from "../../utils/notificationHelper";


export function* fetchInventoriesSaga(action) {
    try {
        const { data } = yield call(fetchInventories);
        const inventories  = data.products;
        const inventoriesList = inventories.reduce((acc, item) => {
            const inventory = { name: item.name, value: item._id };
            acc.push(inventory);
            return acc;
        }, []);
        yield put({ type: Actions.FETCH_INVENTORIES_SUCCESS, data: inventoriesList });
    } catch (error) {
        console.error(error);
        yield put({ type: Actions.FETCH_INVENTORIES_FAILURE });
    }
}

export function* addInventorySaga(action) {
    try {
        yield call(addInventory, action.inventory);
        yield put(createNotification("Product added successfully", "success"));
        yield put({ type: Actions.ADD_INVENTORY_SUCCESS });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        yield put({ type: Actions.CLOSE_ADD_INVENTORY_MODAL });
    } catch (error) {
        yield put(createNotification(`error while adding product: ${error && error.response.data.message}`, "error"));
        yield put({ type: Actions.ADD_INVENTORY_FAILURE });
    }
}

export default function* inventoryrManagerSagas() {
    yield all([
        takeEvery(Actions.ADD_INVENTORY_REQUEST, addInventorySaga),
        takeEvery(Actions.FETCH_INVENTORIES_REQUEST, fetchInventoriesSaga)
    ]);
}

