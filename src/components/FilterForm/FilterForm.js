import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import { validator } from "./validator";
import DatePicker from "react-date-picker";
import moment from "moment";
import SelectComponent from "../SelectComponent/SelectComponent";

const EntryForm = ({ classes, setFilters, filters,filterEntry, users, selectedEntry }) => {
    const [
        initialValues, setCount
    ] = useState({
        date: filters.created_at,
        user_id: filters.user_id
    });
    const [
        date, setDate
    ] = useState(filters.created_at || new Date());
    const onChange = (date) => setDate(date);
    return (
        <>
            <div className={classes.container}>
                <Form
                    onSubmit={(values) => {
                        const created_at = moment(date).format("DD-MM-YYYY");
                        setFilters({ ...values,created_at:date });
                        filterEntry({ ...values, created_at });
                    }}
                    initialValues={initialValues}
                    validate={validator}
                    render={({ handleSubmit, pristine, invalid, values }) => (
                        <form id="add-new-compact-entry" autoComplete="off" onSubmit={handleSubmit}>
                            <div className={classes.formContainer}>
                                <div style={{ width: 200 }}>
                                    <Field
                                        name={"user_id"}
                                        options={users}
                                        labelfor={"user"}
                                        labelname={"Select User"}
                                        component={SelectComponent}
                                        fullWidth={true}
                                        labelwidth={120}
                                        helperText={(
                                            <span style={{ paddingBottom: 10 }}>

                                            </span>
                                        )} />
                                </div>
                                <div style={{ paddingLeft: 20 }}>
                                    <DatePicker
                                        required
                                        onChange={onChange}
                                        value={date}
                                        className={classes.calender}
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                />
                <div className={classes.modalBodyBottomToolbar}>
                    <Button
                        form="add-new-compact-entry"
                        variant="contained"
                        type={"submit"}
                        color="primary"
                        className={classes.button}
                    >
                        Apply
                        </Button>
                </div>
            </div>
        </>
    );
};

export default withStyles(styles)(EntryForm);
