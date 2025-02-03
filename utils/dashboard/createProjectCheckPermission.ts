export const createProjectCheckPermission = async (studentId: string) => {
  try {
    const response = await fetch(
      `https://project-service.kunmhing.me/api/v1/students/${studentId}/check`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return data.has_permission;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};
