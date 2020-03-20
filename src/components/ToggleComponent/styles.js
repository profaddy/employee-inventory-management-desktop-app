const styles = theme => ({
    toggleButtonGroupRoot: {
        boxShadow: "none",
        borderRadius: 4,
        marginBottom: 10
    },
    toggleButtonLabel: {
        paddingBottom: 10,
        opacity: 0.7,
        fontFamily: "Roboto",
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.33,
        letterSpacing: "normal"
    },
    toggleButtonGroupSelected: {
        backgroundColor: theme.toggleButton.selectedBackgroundColor + " !important",
        color: theme.toggleButton.selectedForegroundColor + " !important",
        textTransform: "initial",
        fontWeight: 400,
        boxShadow: "none"
    },
    toggleButton: {
        textTransform: "initial",
        color: theme.toggleButton.defaultForegroundColor,
        fontWeight: 400,
        padding: 4,
        height: 36
    },
    toggleButtonWrap: {
        width: "max-content"
    },
    label: {
        fontSize: 16,
        paddingBottom: 5,
        fontWeight:"bolder",
        color: "rgba(0, 0, 0, 0.54)"
    }
});

export default styles;
