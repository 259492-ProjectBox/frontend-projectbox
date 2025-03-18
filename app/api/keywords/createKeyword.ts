'use server'
import { apiConfig } from "@/config/apiConfig"
import axios from "axios"

interface CreateKeywordPayload {
    keyword: string
    program_id: number
}

export const createKeyword = async (keyword: string, programID: number): Promise<void> => {
    try {
        const payload: CreateKeywordPayload = {
            keyword: keyword,
            program_id: programID
        }
        console.log("Payload:", payload);

        await axios.post(apiConfig.ProjectService.CreateKeyword, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error creating keyword:", error);
        throw error;
    }
}