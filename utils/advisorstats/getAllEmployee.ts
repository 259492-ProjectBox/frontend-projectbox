import axios from 'axios';
import { Advisor } from '@/models/Advisor'; // Assuming the Advisor type is defined correctly

// Function to fetch all employees (advisors)
const getAllEmployees = async (): Promise<Advisor[]> => {
  try {
    const response = await axios.get<Advisor[]>(
      'https://project-service.kunmhing.me/api/v1/staffs/GetAllStaffs',
      {
        headers: {
          accept: 'application/json',
        },
      }
    );
    console.log("Get all Employee :",response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};

export default getAllEmployees;
