import axios from "axios";

export const uploadCreateProject = async (file: File, programId: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("program_id", programId.toString());

  const response = await axios.post(
    `https://project-service.kunmhing.me/api/v1/uploads/program/${programId}/create-project`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );
  
  return response.data;
};
