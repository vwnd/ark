import axios from "axios";

export default defineEventHandler(async (event) => {
  try {
    const response = await axios.get("http://10.120.3.191:3000/documents");
    const documents = response.data;

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
});
