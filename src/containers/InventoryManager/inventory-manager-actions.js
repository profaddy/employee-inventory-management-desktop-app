import ActionTypes from "./inventory-manager-action-constants";

const Actions = {
    _addInventory: (inventory) => {
        return {
            type: ActionTypes.ADD_INVENTORY_REQUEST,
            inventory
        };
    },
    _fetchInventories: () => {
        return {
            type: ActionTypes.FETCH_INVENTORIES_REQUEST
        };
    },
    _openAddInventoryModal:() => {
        return {
            type: ActionTypes.OPEN_ADD_INVENTORY_MODAL
        };
    },
    _closeAddInventoryModal:() => {
        return {
            type: ActionTypes.CLOSE_ADD_INVENTORY_MODAL
        };
    }
};

export default Actions;
