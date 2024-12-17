// airtableConfigAdmin.ts

import axios from "axios";

const AIRTABLE_BASE_URL = "https://api.airtable.com/v0/appN89B0ldADji7sR/ConfigAdmin";
const API_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

// Fetch data from Airtable
export const fetchAdminConfig = async () => {
  try {
    const response = await axios.get(AIRTABLE_BASE_URL, { headers });
    return response.data.records.map((record: any) => ({
      id: record.fields.ID,
      email: record.fields["Cmu Account"],
    }));
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
    return [];
  }
};

// Add new CMU Account to Airtable
export const addAdminConfig = async (email: string) => {
  try {
    const data = {
      records: [
        {
          fields: {
            "Cmu Account": email,
          },
        },
      ],
    };

    const response = await axios.post(AIRTABLE_BASE_URL, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error adding new admin config to Airtable:", error);
    throw error;
  }
};