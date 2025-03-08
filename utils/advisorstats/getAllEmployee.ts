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
    return response.data;
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};

// Function to fetch all employees (advisors) and map them by email
export const getAllEmployeesNew = async (): Promise<Map<string, Advisor[]>> => {
  try {
    const response = await axios.get<Advisor[]>(
      'https://project-service.kunmhing.me/api/v1/staffs/GetAllStaffs',
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    // Create a Map to store advisors by email
    const advisorMap = new Map<string, Advisor[]>();

    response.data.forEach((advisor) => {
      if (advisorMap.has(advisor.email)) {
        advisorMap.get(advisor.email)?.push(advisor);
      } else {
        advisorMap.set(advisor.email, [advisor]);
      }
    });

    return advisorMap;
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};


export default getAllEmployees;
