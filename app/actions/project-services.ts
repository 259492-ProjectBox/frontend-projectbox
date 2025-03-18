'use server'

import { apiConfig } from "@/config/apiConfig"
import axios from "axios"

export async function PostProject(formDataToSend : FormData){
    axios.post(`${apiConfig.ProjectService.CreateProject}`, formDataToSend)
}