import { customValidator } from "../../utils/validators";

export const validator = values => {
    const errors = {};
    errors["entry_value"] = customValidator.required(values["entry_value"]);
    errors["user_id"] = customValidator.required(values["user_id"]);
    errors["product_id"] = customValidator.required(values["product_id"]);
    return errors;
};
