import axios from "axios";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

const airtableInstance = axios.create({
  baseURL: `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const fetchConfigForm = async () => {
  try {
    const response = await airtableInstance.get("/ConfigForm?view=Grid%20view");
    return response.data.records[0]?.fields || {};
  } catch (error) {
    console.error("Error fetching ConfigForm data:", error);
    throw error;
  }
};
