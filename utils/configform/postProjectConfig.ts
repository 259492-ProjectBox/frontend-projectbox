const postProjectConfig = async (configs: any[]): Promise<void> => {
    try {
      const response = await fetch('https://project-service.kunmhing.me/projectConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configs),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving project config:', errorData);
        throw new Error('Failed to save project config');
      }
    } catch (error) {
      console.error('Error during POST request:', error);
      throw error;
    }
  };
  
  export default postProjectConfig;
  