import React from "react";
import { Form, Field } from "react-final-form";
import { Divider, Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import InputField from "../InputField/InputField";
import {validator} from "./validator";

const AddInventoryForm = ({ classes, onCancel, addInventory}) => {
    return (
        <>
            <div className={classes.container}>
                <div className={classes.flex1}>
                    <Form
                        onSubmit={(values) => {
                            addInventory(values);
                        }}
                        validate={validator}
                        render={({ handleSubmit, pristine, invalid, values }) => (
                            <form id="add-new-entry" autoComplete="off" onSubmit={handleSubmit}>
                                <div className={classes.formContainer}>
                                    <div style={{ width: 200 }}>
                                        <Field
                                            type={"text"}
                                            label={"Product name"}
                                            name={"name"}
                                            component={InputField}
                                            fullWidth={false}
                                        />
                                    </div>
                                </div>
                            </form>
                        )}
                    />
                </div>
                <div>
                    <Divider />
                    <div className={classes.modalBodyBottomToolbar}>
                        <Button variant="outlined" onClick={onCancel} className={classes.button}>
                            Cancel
                        </Button>
                        <Button
                            form="add-new-entry"
                            variant="contained"
                            type={"submit"}
                            color="primary"
                            className={classes.button}
                        >
                            {"Add Inventory"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withStyles(styles)(AddInventoryForm);
