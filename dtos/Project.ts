import { Advisor } from "./Advisor";
import { Committee } from "./Committee";
import { Course } from "./Course";
import { Major } from "./Major";
import { Member } from "./Member";
import { Section } from "./Section";

export interface ProjectDTO {
	id: number;
	old_project_no: string | null;
	project_no: string;
	title_th: string;
	title_en: string;
	abstract: string;
	project_status: string;
	relation_description: string;
	advisor_id: number;
	course_id: number;
	section_id: number;
	academic_year: number;
	semester: number;
	major_id: number;
	created_at: string;
	advisor: Advisor;
	major: Major;
	course: Course;
	section: Section;
	committees: Committee[];
	members: Member[];
}
