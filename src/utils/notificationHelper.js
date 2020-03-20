import ActionConstant from "../HOC/notifications/notifier-constants";
export function createNotification(message, variant, options = {}) {
    return {
        type: ActionConstant.SHOW_NOTIFICATION,
        notification: {
            key: new Date().getTime() + Math.random(),
            message: message,
            options: {
                variant: variant,
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right"
                }
            },
            ...options
        }
    };
}
