'use server'
import { apiConfig } from "@/config/apiConfig"
import { Keyword } from "@/dtos/Keyword"
import axios from "axios"

interface UpdateKeywordPayload {
    id: number
    keyword: string
    program_id: number
}

export const editKeyword = async (id :number,keyword: string, programID: number): Promise<Keyword> => {
    try {
        const payload: UpdateKeywordPayload = {
            id: id,
            keyword: keyword,
            program_id: programID
        }

        var result = await axios.put(apiConfig.ProjectService.UpdateKeyword, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log("editKeyword result", result.data);
        
        return result.data

    } catch (error) {
        console.error("Error creating keyword:", error);
        throw error;
    }
}