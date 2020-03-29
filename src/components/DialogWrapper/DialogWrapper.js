import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";import Button from "@material-ui/core/Button";
import styles from "./styles";

const DialogWrapper = ({ title, content, onClose, onSubmit, isOpen, formName }) => {
    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={isOpen}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                {!formName &&
                <Button onClick={onSubmit} color="primary">
                                    Ok
                </Button>
                }
                {!!formName &&
                <Button  type={"submit"} form={formName} color="primary">
                    Ok
                </Button>
                }
            </DialogActions>
        </Dialog>
    );
};

DialogWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
DialogWrapper.defaultProps = {
    classes: {},
    isOPen: false,
    onClose: () => { },
    onSubmit: () => { }
};
export default withStyles(styles)(DialogWrapper);
