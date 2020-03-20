import { Component } from "react";
import PropTypes from "prop-types";

export default class Notifier extends Component {
    displayed = [];

    static propTypes = {
        notifications: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            message: PropTypes.string,
            options: PropTypes.object
        })),
        enqueueSnackbar: PropTypes.func.isRequired,
        removeSnackbar: PropTypes.func.isRequired
    }

    storeDisplayed = (id) => {
        this.displayed = [
            ...this.displayed, id
        ];
    };

    shouldComponentUpdate({ notifications: newSnacks = [] }) {
        const { notifications: currentSnacks } = this.props;
        let notExists = false;
        for (let i = 0; i < newSnacks.length; i += 1) {
            if (notExists) continue;
            notExists = notExists || !currentSnacks.filter(({ key }) => newSnacks[i].key === key).length;
        }
        return notExists;
    }

    componentDidUpdate() {
        const { notifications = [] } = this.props;

        notifications.forEach((notification) => {
            // Do nothing if snackbar is already displayed
            if (this.displayed.includes(notification.key)) return;
            // Display snackbar using notistack
            this.props.enqueueSnackbar(notification.message, notification.options);
            // Keep track of snackbars that we've displayed
            this.storeDisplayed(notification.key);
            // Dispatch action to remove snackbar from redux store
            this.props.removeSnackbar(notification.key);
        });
    }

    render() {
        return null;
    }
}
