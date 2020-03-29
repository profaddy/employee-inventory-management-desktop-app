export const customValidator = {
    isPositiveNumber: value => {
        if (!value && value !== 0) {
            return "Required!";
        } else if (isNaN(value)) {
            return "Value must be a number";
        } else if (!(Number.isInteger(Number(value)))){
            return "value must be non-negative integer";
        }else if(Number(value) < 0){
            return "value cannot be negative";
        }
    },

    maxLength: value => {
        if(!value){
            return "Required!";
        }else if(value.length >1023){
            return "Length must be less than 1024 characters";
        }
    },

    required: value => {
        if (!value) {
            return "Required!";
        }
    },

    match: (value,confirmValue,matchKey) => {
        if(!confirmValue){
            return "Required!";
        }else if(value !== confirmValue){
            return `${matchKey} does not match`;
        }
    }
};

