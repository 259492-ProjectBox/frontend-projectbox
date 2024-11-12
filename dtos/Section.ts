import { SectionCourse } from "./SectionCourse";

export interface Section {
	id: number;
	course_id: number;
	section_number: string;
	semester: number;
	course: SectionCourse;
}
