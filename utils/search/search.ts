import axios from 'axios';
import { Project } from '../../models/Project';

export async function searchProjects(searchInput: string): Promise<Project[]> {
  try {
    const response = await axios.get(`https://search-service.kunmhing.me/api/v1/projects/fields`, {
      params: {
        searchInput,
        fields: ['title_th', 'title_en', 'abstract_text', 'members.studentId']
      }
    });

    const projects: Project[] = response.data;
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}
