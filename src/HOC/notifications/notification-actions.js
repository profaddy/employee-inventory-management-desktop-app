import Constants from "./notifier-constants";

export const enqueueSnackbar = notification => ({
    type: Constants.SHOW_NOTIFICATION,
    notification: {
        key: new Date().getTime() + Math.random(),
        ...notification
    }
});

export const removeSnackbar = key => ({
    type: Constants.HIDE_NOTIFICATION,
    key
});
