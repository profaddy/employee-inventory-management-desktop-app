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
    _filterEntry: (data) => {
        return {
            type: ActionConstants.FILTER_ENTRY_REQUEST,
            data
        }
    },
    _doAuthenticateEdit: (value) => {
        return{
            type:ActionConstants.DO_AUTHENTICATE_EDIT,
            value
        };
    },
    _deleteEntry: (data) => {
        return {
            type: ActionConstants.DELETE_ENTRY_REQUEST,
            data
        };
    },
    _fetchEntries:() => {
        return {
            type:ActionConstants.FETCH_ENTRY_REQUEST
        };
    },
    _fetchEntryInfo:(entryId,mode) => {
        return {
            type:ActionConstants.FETCH_ENTRY_INFO_REQUEST,
            id:entryId,
            mode
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
