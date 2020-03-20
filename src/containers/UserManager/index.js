import { connect } from "react-redux";
// import { push } from 'connected-react-router';
import { bindActionCreators } from "redux";
import * as ActionTypes from "./user-manager-action-constants";
import UserManager from "./user-manager";
import Actions from "./user-actions";

const mapStateToProps = (state) => {
    return {
        users:state.UserManager.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        _fetchUser: bindActionCreators(Actions._fetchUser, dispatch),
        _addUser:bindActionCreators(Actions._addUser, dispatch)
    };};

export default connect(
    // mapStateToProps,
    null,
    mapDispatchToProps
)(UserManager);
