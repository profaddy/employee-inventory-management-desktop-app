const styles = () => ({
    modalBodyBottomToolbar: {
        // padding: 10, 
        display: "flex", 
        flexDirection: "row", 
        // justifyContent: "flex-end",
        alignItems:"center",
        height:80
    },
    formContainer: {
        display: "flex",
        flexDirection: "row",
        padding: "20px 12px"
    },
    button: {
        marginRight: 5
    },
    calender:{
    zIndex:"999 !important",
    height:40
    },
    container: {
        display: "flex", 
        flexDirection: "row", 
        height: "100%"
    },
    flex1: {
        flex: 1
    },
    flex3: {
        flex: 3
    },
    editFieldWrap:{
        display:"flex"
    },
    editFlexItem:{
        marginRight:10,
        width:200
    },
    label: {
        fontSize: 12,
        paddingBottom: 5,
        color: "rgba(0, 0, 0, 0.54)"
    },
    installTypeFieldWrap: {
        padding: "0px 0px 10px 0px"
    },
    fieldWrap: {
        paddingTop: 10
    },
    licenseFieldWrap: {
        display: "flex",
        flexDirection: "row",
        padding: "0px 12px"
    },
    licenseOptionSubText: {
        paddingLeft: 5,
        fontSize: "small"
    },
    icons:{
        width: 37,
        height: 37
    }
});

export default styles;
