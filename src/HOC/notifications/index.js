import Notifier from "./Notifier";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { removeSnackbar } from "./notification-actions";

const mapStateToProps = store => ({
    notifications: store.notification.notifications
});

const mapDispatchToProps = dispatch => bindActionCreators({ removeSnackbar }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withSnackbar(Notifier));
