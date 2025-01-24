import axios from 'axios';

// Define the API endpoint
const API_URL = 'https://project-service.kunmhing.me/api/v1/projectResourceConfigs';

// Define the controller function for creating a project resource
const createProjectResource = async (data: {
  icon_name: string;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
}) => {
  try {
    const response = await axios.put(API_URL, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Return the response data from the API call
    return response.data;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error creating project resource:', error);
    throw error;
  }
};

export default createProjectResource;
