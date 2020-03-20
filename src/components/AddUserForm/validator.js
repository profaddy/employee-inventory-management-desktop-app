import { customValidator } from "../../utils/validators";

export const validator = values => {
    const errors = {};
    errors["name"] = customValidator.required(values["name"]);
    return errors;
};
