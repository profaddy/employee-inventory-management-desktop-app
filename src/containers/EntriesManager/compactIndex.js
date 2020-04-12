import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createNotification } from "../../utils/notificationHelper";
import CompactEntries from "./CompactEntries";
import Actions from "./entries-manager-actions";
import userActions from "../UserManager/user-actions";
import inventoryActions from "../InventoryManager/inventory-manager-actions";

const mapStateToProps = (state) => {
    return {
        entries: state.EntriesManager.filteredEntries,
        compactEntries: state.EntriesManager.compactEntries,
        addEntryModalShowing: state.EntriesManager.addEntryModalShowing,
        addUserModalShowing: state.UserManager.addUserModalShowing,
        addInventoryModalShowing:state.InventoryManager.addInventoryModalShowing,
        users: state.UserManager.users,
        inventories: state.InventoryManager.inventories,
        selectedEntry: state.EntriesManager.selectedEntry,
        adminPassword: state.EntriesManager.adminPassword,
        authenticated: state.EntriesManager.authenticated,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchEntries: bindActionCreators(Actions._fetchEntries, dispatch),
        _fetchEntryInfo: bindActionCreators(Actions._fetchEntryInfo, dispatch),
        _fetchInventories: bindActionCreators(inventoryActions._fetchInventories, dispatch),
        _fetchUsers: bindActionCreators(userActions._fetchUsers, dispatch),
        _addUser: bindActionCreators(userActions._addUser, dispatch),
        _addInventory: bindActionCreators(inventoryActions._addInventory, dispatch),
        _addEntry: bindActionCreators(Actions._addEntry, dispatch),
        _filterEntry: bindActionCreators(Actions._filterEntry, dispatch),
        _updateEntry: bindActionCreators(Actions._updateEntry, dispatch),
        _deleteEntry: bindActionCreators(Actions._deleteEntry,dispatch),
        _openAddEntryModal: bindActionCreators(Actions._openAddEntryModal, dispatch),
        _closeAddEntryModal: bindActionCreators(Actions._closeAddEntryModal, dispatch),
        _openAddUserModal: bindActionCreators(userActions._openAddUserModal, dispatch),
        _closeAddUserModal: bindActionCreators(userActions._closeAddUserModal, dispatch),
        _openAddInventoryModal: bindActionCreators(inventoryActions._openAddInventoryModal, dispatch),
        _closeAddInventoryModal: bindActionCreators(inventoryActions._closeAddInventoryModal, dispatch),
        createNotification:bindActionCreators(createNotification, dispatch),
        _doAuthenticateEdit:bindActionCreators(Actions._doAuthenticateEdit, dispatch)
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CompactEntries);
