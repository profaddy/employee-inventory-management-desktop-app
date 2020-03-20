export const customValidator = {
    isNumber: portNumber => {
        if (!portNumber) {
            return "Required!";
        } else if (isNaN(Number(portNumber))) {
            return "Port number should be between 1024 and 65535";
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

