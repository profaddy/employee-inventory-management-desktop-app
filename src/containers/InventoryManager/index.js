import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InventoryManager from "./inventory-manager";
import Actions from "./inventory-manager-actions";


const mapStateToProps = (state) => {
    return {
        inventories:state.InventoryManager.inventories
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        _fetchInventories: bindActionCreators(Actions._fetchInventories, dispatch),
        _addInventory:bindActionCreators(Actions._addInventory, dispatch)
    };};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryManager);
