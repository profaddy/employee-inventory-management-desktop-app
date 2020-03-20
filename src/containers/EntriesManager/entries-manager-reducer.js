import ActionTypes from "./entries-manager-action-constants";


const INITIAL_STATE = {
    entries:[],
    selectedEntry:null,
    addEntryModalShowing:false
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
    case ActionTypes.FETCH_ENTRY_SUCCESS:
        let entries = [
            ...state.entries
        ];
        entries = entries.concat(action.data);
        return{
            ...state,
            entries:entries
        };
    case ActionTypes.FETCH_ENTRY_INFO_SUCCESS:
        return {
            ...state,
            selectedEntry: action.data
        };
    case ActionTypes.OPEN_ADD_ENTRY_MODAL:
        return {...state,addEntryModalShowing:true};
    case ActionTypes.CLOSE_ADD_ENTRY_MODAL:
        return {...state,addEntryModalShowing:false};
    case ActionTypes.ADD_ENTRY_SUCCESS:
    case ActionTypes.DELETE_ENTRY_SUCCESS:
    default:
        return state;
    }
};

export default Reducer;

