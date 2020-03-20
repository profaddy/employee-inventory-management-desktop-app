import api from "../../utils/api";

export const fetchEntries = () => api.get("/entries");
export const addEntry = (data) => api.post("/entries", data);
export const fetchEntryInfo = (id) => api.get(`/entries/${id}`);
export const updateEntry = (data) => api.put("/entries/", data);
export const deleteEntry = (id) => api.delete(`/entries/${id}`);

