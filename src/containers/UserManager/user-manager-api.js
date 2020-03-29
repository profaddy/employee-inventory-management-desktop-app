import api from "../../utils/api";

export const fetchUsers = () => api.get("/users");
export const addUser = (data) => api.post("/users", data);

