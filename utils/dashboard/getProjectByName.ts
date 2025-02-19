import { Project } from "@/models/Project";

const getProjectByName = async (name: string): Promise<Project[]> => {
  const response = await fetch(`https://search-service.kunmhing.me/api/v1/projects/selected-fields?fields=staffs.firstNameEN%2Cstaffs.lastNameEN&searchInputs=${name}`, {
    method: 'GET',
    headers: {
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching projects for name ${name}: ${response.statusText}`);
  }

  const data = await response.json();
  return data as Project[];
};

export default getProjectByName;
