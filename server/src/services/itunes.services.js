import { http } from "../utils/http.js";

// search itunes with "query"
export async function searchItunes(params) {
    const { data } = await http.get("/search", { params });
    return data
}