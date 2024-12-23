import axios from "axios";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID; // Base ID for Airtable
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY; // API Key for Airtable

const airtableInstance = axios.create({
  baseURL: `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await airtableInstance.get("/Project?view=Grid%20view");
    return response.data.records;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Create a new project
export const createProject = async (fields: any) => {
  try {
    const response = await airtableInstance.post("/Project", {
      records: [{ fields }],
    });
    return response.data.records;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
