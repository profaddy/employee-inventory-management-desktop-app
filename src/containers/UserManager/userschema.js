import moment from "moment";
// const user  = {
//     username:"adnan1",
//     name:"Adnan Saify",
//     password:"test",
//     inventories:{
//         "bulb":{bagVlaue:0},
//         "tube":{bagValue:0}
//     }
// }

// export default user;

const getInventories = () => {
    const inventories = [
        {name:"bulb",id:1},{name:"tube",id:2}
    ];
    let inventoryObj = {};
    inventories.forEach((item) => {
        inventoryObj[item.id] = 0;
    });
    return inventoryObj;
};
let mockedRandomName = () => Math.random().toString(36).substring(7);

const createUserSchema = (user = {}) => {
    return {
        username:user.username || mockedRandomName(),
        name:user.name || mockedRandomName(),
        password:user.password || "testpass",
        created_at:moment().format("DD-MM-YYYY hh:mm:ss A"),
        inventories:getInventories()
    };
};

export default createUserSchema;
