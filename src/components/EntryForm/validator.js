import { customValidator } from "../../utils/validators";

export const validator = (values,entryMode) => {
    const errors = {};
    if(values.entry_mode === "add"){
        errors["entry_value"] = customValidator.isPositiveNumber(values["entry_value"]);
    }
    if(values.entry_mode === "edit"){
        errors["taken"] = customValidator.isPositiveNumber(values["taken"]);
        errors["consumed"] = customValidator.isPositiveNumber(values["consumed"]);
        errors["returned"] = customValidator.isPositiveNumber(values["returned"]);
    }
    errors["user_id"] = customValidator.required(values["user_id"]);
    errors["product_id"] = customValidator.required(values["product_id"]);
    return errors;
};
