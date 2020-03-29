import ActionTypes from "./inventory-manager-action-constants";


const INITIAL_STATE = {
    inventories:[],
    addInventoryModalShowing:false
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
    case ActionTypes.ADD_INVENTORY_SUCCESS:
        return state;
    case ActionTypes.FETCH_INVENTORIES_SUCCESS:
        return{
            ...state,
            inventories:action.data
        };
    case ActionTypes.OPEN_ADD_INVENTORY_MODAL:
        return{
            ...state,
            addInventoryModalShowing:true
        };
    case ActionTypes.CLOSE_ADD_INVENTORY_MODAL:
        return{
            ...state,
            addInventoryModalShowing:false
        };
    default:
        return state;
    }
};

export default Reducer;

