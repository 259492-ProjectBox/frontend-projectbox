import axios from 'axios';
import { ProjectRole } from '../../models/ProjectRoles';

const API_URL = 'https://project-service.kunmhing.me/api/v1/projectRoles/program/1';

export const getProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project roles:', error);
    throw error;
  }
};
