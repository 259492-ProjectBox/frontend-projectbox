const getProjectConfig = async (majorId: number): Promise<any[]> => {
  try {
    const response = await fetch(`https://project-service.kunmhing.me/projectConfig/GetByMajorId/${majorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch project config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project config:', error);
    throw error;
  }
};

export default getProjectConfig;
