import React from "react";
import PropTypes from "prop-types";
import DialogWrapper from "../DialogWrapper/DialogWrapper";
import withStyles from "@material-ui/core/styles/withStyles";

import styles from "./styles";


const DeleteDialogWrpper = ({ itemTobeDeleted, itemName, onClose, onSubmit, isOpen, classes }) => {
    return (
        <DialogWrapper
            title={`Are you sure you want to delete ${itemTobeDeleted} ?`}
            content={<>
                You have selected 
                {" "}
                {itemTobeDeleted}
                {" "}
                <span className={classes.itemName}>
                    {itemName}
                </span>
                {" "}
                to get deleted, Please confirm your selection.This action cannot be reverted.
            </>}
            onClose={onClose}
            onSubmit={onSubmit}
            isOpen={isOpen}
        />
    );
};

DeleteDialogWrpper.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    itemTobeDeleted: PropTypes.string,
    itemName: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
DeleteDialogWrpper.defaultProps = {
    classes: {},
    isOPen: false,
    onClose: () => { },
    onSubmit: () => { }
};

export default withStyles(styles)(DeleteDialogWrpper);
