import { Project } from "@/models/Project";

const getProjectByEmail = async (email: string): Promise<Project[]> => {
  const response = await fetch(`https://search-service.kunmhing.me/api/v1/projects/selected-fields?fields=staffs.email&searchInputs=${email}`, {
    method: 'GET',
    headers: {
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching projects for email ${email}: ${response.statusText}`);
  }

  const data = await response.json();
  return data as Project[];
};

export default getProjectByEmail;
