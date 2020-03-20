import { connect } from "react-redux";
import { push } from "connected-react-router";
import { bindActionCreators } from "redux";
import LoggedIn from "../components/LoggedIn";
import userActions from "../actions/user";

const mapStateToProps = (state) => {
    return {
        username:state.UserManager.username
    };
};

const mapDispatchToProps = (dispatch) => {
    console.log(dispatch);
    return{
        onLogout: bindActionCreators(userActions.logout, dispatch)
    };

    // const user = bindActionCreators(userActions, dispatch);
    // return {
    //   onLogout: (data) => {
    //     user.logout(data);
    //     dispatch(push('/'));
    //   },
    // };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoggedIn);
