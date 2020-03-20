import api from "../../utils/api";

export const fetchInventories = () => api.get("/products");
export const addInventory = (data) => api.post("/products",data);


