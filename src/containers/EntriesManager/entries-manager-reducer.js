import ActionTypes from "./entries-manager-action-constants";


const INITIAL_STATE = {
    entries:[],
    filteredEntries:[],
    selectedEntry:null,
    addEntryModalShowing:false,
    adminPassword:"5575",
    authenticated:false
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
        case ActionTypes.FILTER_ENTRY_SUCCESS:
            let filteredEntries = [
                ...state.filteredEntries
            ];
            filteredEntries = filteredEntries.concat(action.data);
            return{
                ...state,
                filteredEntries:action.data
            };
    case ActionTypes.FETCH_ENTRY_INFO_SUCCESS:
        return {
            ...state,
            selectedEntry: action.data
        };
    case ActionTypes.DO_AUTHENTICATE_EDIT:
        return {
            ...state,
            authenticated:action.value
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

