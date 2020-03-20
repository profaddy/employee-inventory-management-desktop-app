import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Divider, Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import { validator } from "./validator";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import InputField from "../../components/InputField/InputField";
import ToggleComponent from "../../components/ToggleComponent/ToggleComponent";
import pick from "lodash/pick";

const EntryForm = ({ classes, onCancel, addEntry, users, inventories, entryMode, selectedEntry, updateEntry }) => {
    const [
        initialValues, setCount
    ] = useState({
        entry_type: "taken"
    });
    const submitButtonText = entryMode === "edit" ? "Update" : "Create";
    const CombinedInitialValues = entryMode === "add" ? { ...initialValues } : { ...initialValues, ...selectedEntry };
    return (
        <>
            <div className={classes.container}>
                <div className={classes.flex1}>
                    <Form
                        onSubmit={(values) => {
                            if (entryMode === "edit") {
                                const payload = pick(values, "_id", "user_id", "product_id", "entry_type", "entry_value");
                                updateEntry(payload);
                            } else {
                                addEntry(values);
                            }
                        }}
                        initialValues={CombinedInitialValues}
                        validate={validator}
                        render={({ handleSubmit, pristine, invalid, values }) => (
                            <form id="add-new-entry" autoComplete="off" onSubmit={handleSubmit}>
                                {/* <FormSpy onChange={state => this.updateDetails(state.values)} /> */}
                                <div className={classes.formContainer}>
                                    <div className={classes.flex3}>
                                        <div style={{ width: 200 }}>
                                            <Field
                                                name={"user_id"}
                                                options={users}
                                                labelfor={"user"}
                                                labelname={"Select User"}
                                                component={SelectComponent}
                                                fullWidth={true}
                                                labelwidth={120}
                                                disabled={entryMode === "edit"}
                                                helperText={(
                                                    <span style={{ paddingBottom: 10 }}>

                                                    </span>
                                                )} />
                                        </div>
                                        <div style={{ width: 200 }}>
                                            <Field
                                                name={"product_id"}
                                                options={inventories}
                                                labelfor={"inventory"}
                                                labelname={"Select Inventory"}
                                                component={SelectComponent}
                                                disabled={entryMode === "edit"}
                                                fullWidth={true}
                                                labelwidth={120}
                                                helperText={(
                                                    <span style={{ paddingBottom: 10 }}>

                                                    </span>
                                                )} />
                                        </div>
                                        <div style={{ width: 200 }}>
                                            <Field
                                                type={"text"}
                                                label={"Select Quantity"}
                                                name={"entry_value"}
                                                component={InputField}
                                                fullWidth={false}
                                            />
                                        </div>
                                        <div className={classes.installTypeFieldWrap}>
                                            <div className={classes.label}>
                                                Entry Type
                                            </div>
                                            <Field
                                                name="entry_type"
                                                options={[
                                                    {
                                                        name: "Taken",
                                                        value: "taken"
                                                    }, {
                                                        name: "Consumed",
                                                        value: "consumed"
                                                    }, {
                                                        name: "Returned",
                                                        value: "returned"
                                                    }
                                                ]}
                                                width={150}
                                                component={ToggleComponent}
                                            />
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                    <div className={classes.flex1}></div>
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
                            {submitButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withStyles(styles)(EntryForm);
