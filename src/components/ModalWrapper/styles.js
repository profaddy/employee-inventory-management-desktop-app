const styles = (theme) => ({
    root: {
        [theme.breakpoints.up("sm")]: {
            backgroundColor: "transparent"
        },
        outline: "none",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        backgroundColor: theme.palette.background.paper
    },
    position: "absolute",
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    modalBodyWrap: {
        backgroundColor: theme.backgroundColor,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        outline: "none"
    },
    modalBodyWrapFullHeight: {
        height: "100%"
    },
    modalBodyTitleWrap: {
        display:"flex",
        borderBottom:"1px solid rgba(0, 0, 0, 0.12)",
        padding: 10
    },
    modalBodyTitle: {
        flex:3,
        fontSize: 18,
        lineHeight: 1.33
    },
    modalClose: {
        cursor:"pointer"
    },
    detailPreviewWrapper:{
        marginRight:5
    },
    detailIcon:{
        cursor:"pointer"
    },
    modalResize: {
        cursor:"pointer",
        marginRight:5
    },
    modalBodyChildWrap: {
        flex: 1
    },
    modalBodyBottomToolbar: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});
  
export default styles;
