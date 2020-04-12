import api from "../../utils/api";

export const fetchEntries = () => api.get("/entries");
export const filterEntries = (user_id,created_at) => api.get(`/entries/${user_id}/${created_at}`);
export const addEntry = (data) => api.post("/entries/", data);
export const fetchEntryInfo = (id) => api.get(`/entries/${id}`);
export const updateEntry = (data) => api.put("/entries/", data);
export const deleteEntry = (data) => api.delete("/entries/",{data:data});

