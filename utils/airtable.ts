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

export const fetchRecords = async (tableName: string) => {
  try {
    const response = await airtableInstance.get(`/${tableName}`);
    return response.data.records;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const createRecords = async (tableName: string, records: any[]) => {
  try {
    const response = await airtableInstance.post(`/${tableName}`, { records });
    return response.data.records;
  } catch (error) {
    console.error("Error creating records:", error);
    throw error;
  }
};

export const updateRecords = async (tableName: string, records: any[]) => {
  try {
    const response = await airtableInstance.patch(`/${tableName}`, { records });
    return response.data.records;
  } catch (error) {
    console.error("Error updating records:", error);
    throw error;
  }
};

export const deleteRecords = async (tableName: string, recordIds: string[]) => {
  try {
    const params = recordIds.map(id => `records[]=${id}`).join("&");
    const response = await airtableInstance.delete(`/${tableName}?${params}`);
    return response.data.records;
  } catch (error) {
    console.error("Error deleting records:", error);
    throw error;
  }
};
