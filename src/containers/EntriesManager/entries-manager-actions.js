import ActionConstants from "./entries-manager-action-constants";

const Actions = {
    _addEntry: (data) => {
        return {
            type: ActionConstants.ADD_ENTRY_REQUEST,
            data
        };
    },
    _updateEntry: (data) => {
        return {
            type: ActionConstants.UPDATE_ENTRY_REQUEST,
            data
        };
    },
    _deleteEntry: (id) => {
        return {
            type: ActionConstants.DELETE_ENTRY_REQUEST,
            id
        };
    },
    _fetchEntries:() => {
        return {
            type:ActionConstants.FETCH_ENTRY_REQUEST
        };
    },
    _fetchEntryInfo:(entryId) => {
        return {
            type:ActionConstants.FETCH_ENTRY_INFO_REQUEST,
            id:entryId
        };
    },
    _openAddEntryModal:() => {
        return{
            type:ActionConstants.OPEN_ADD_ENTRY_MODAL
        };
    },
    _closeAddEntryModal:() => {
        return{
            type:ActionConstants.CLOSE_ADD_ENTRY_MODAL
        };
    }
};

export default Actions;
