import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Divider, Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import { validator } from "./validator";
import DatePicker from "react-date-picker";
import moment from "moment";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import InputField from "../../components/InputField/InputField";
import ToggleComponent from "../../components/ToggleComponent/ToggleComponent";

const EntryForm = ({ classes, onCancel, addEntry, users, inventories, entryMode, selectedEntry, updateEntry }) => {
    const [
        initialValues, setCount
    ] = useState({
        entry_type: "taken",
        entry_mode:entryMode
    });
    const [
        date,setDate
    ] = useState(entryMode === "edit" ? selectedEntry.created_at : new Date());
    const onChange = (date) => setDate(date);
    const submitButtonText = entryMode === "edit" ? "Update" : "Create";
    const CombinedInitialValues = entryMode === "add" ? { ...initialValues } : { ...initialValues, ...selectedEntry  };
    return (
        <>
            <div className={classes.container}>
                <div className={classes.flex1}>
                    <Form
                        onSubmit={(values) => {
                            if (entryMode === "edit") {
                                const created_at = moment(date).format("DD-MM-YYYY");
                                updateEntry({...values,entry_mode:"edit",created_at});
                            } else {
                                const created_at = moment(date).format("DD-MM-YYYY");
                                addEntry({...values,created_at,entry_mode:"add"});
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

                                        {entryMode === "add" && 
                                        <>
                                            <div style={{ width: 200 }}>
                                                <Field
                                                    type={"number"}
                                                    label={"Select Quantity"}
                                                    name={"entry_value"}
                                                    component={InputField}
                                                    fullWidth={false}
                                                    parse={(value) => Number(value)}
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
                                        </>}
                                        {entryMode === "edit" && 
                                        <div className={classes.editFieldWrap}>
                                            <div className={classes.editFlexItem}>
                                                <Field
                                                    type={"number"}
                                                    label={"Taken Quantity"}
                                                    name={"taken"}
                                                    component={InputField}
                                                    fullWidth={false}
                                                    parse={(value) => Number(value)}
                                                />
                                            </div>
                                            <div className={classes.editFlexItem}>
                                                <Field
                                                    type={"number"}
                                                    label={"consumed Quantity"}
                                                    name={"consumed"}
                                                    component={InputField}
                                                    fullWidth={false}
                                                    parse={(value) => Number(value)}
                                                />
                                            </div>
                                            <div className={classes.editFlexItem}>
                                                <Field
                                                    type={"number"}
                                                    label={"Returned Quantity"}
                                                    name={"returned"}
                                                    component={InputField}
                                                    fullWidth={false}
                                                    parse={(value) => Number(value)}
                                                />
                                            </div>
                                        </div>}
                                        <div>
                                        </div>
                                    </div>
                                    <div className={classes.flex1}>
                                        <div>
                                            {/* <Field
                                        name={"date"}
                                        value={date}
                                        component={}
                                        > */}
                                            <DatePicker
                                                onChange={onChange}
                                                value={date}
                                            />
                                            {/* </Field> */}
                                        </div>
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
                            {submitButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withStyles(styles)(EntryForm);
