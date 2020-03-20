import Constants from "./notifier-constants";

const defaultState = {
    notifications: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
    case Constants.SHOW_NOTIFICATION:
        return {
            ...state,
            notifications: [
                ...state.notifications,
                {
                    ...action.notification
                }
            ]
        };

    case Constants.HIDE_NOTIFICATION:
        return {
            ...state,
            notifications: state.notifications.filter(
                notification => notification.key !== action.key
            )
        };
    default:
        return state;
    }
};
