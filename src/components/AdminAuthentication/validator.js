import { customValidator } from "../../utils/validators";

export const validator = (values) => {
    const errors = {};
    errors["adminPassword"] = customValidator.required(values["adminPassword"]);
    return errors;
};
