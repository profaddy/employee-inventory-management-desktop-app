import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Divider, Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import { validator } from "./validator";
import InputField from "../InputField/InputField";

const AdminAuthentication = ({ classes , verifyPassword,onDeleteEntry }) => {
    return (
        <>
            <div className={classes.container}>
                <div className={classes.flex1}>
                    <Form
                        onSubmit={(values) => {
                            verifyPassword(values);
                        }}
                        initialValues={{adminPassword:null}}
                        validate={validator}
                        render={({ handleSubmit, pristine, invalid, values }) => (
                            <form id="admin-password" autoComplete="off" onSubmit={handleSubmit}>
                                {/* <FormSpy onChange={state => this.updateDetails(state.values)} /> */}
                                <div className={classes.formContainer}>
                                    <div style={{ width: 200 }}>
                                        <Field
                                            type={"password"}
                                            label={"Password"}
                                            name={"adminPassword"}
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
                </div>
            </div>
        </>
    );
};

export default withStyles(styles)(AdminAuthentication);
