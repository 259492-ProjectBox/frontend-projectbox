export interface FormConfig {
    title_th: boolean;
    title_en: boolean;
    abstract_text: boolean;
    academic_year: boolean;
    semester: boolean;
    section_id: boolean;
    course_id: boolean;
    advisor: boolean;
    committee: boolean;
    student: boolean;
    upload_section: boolean;
    poster_picture: boolean;
    presentation_ppt: boolean;
    presentation_pdf: boolean;
    youtube_link: boolean;
    github_link: boolean;
    autocad_file: boolean;
    sketchup_file: boolean;
    optional_link: boolean;
  }
  
  export interface FormData {
    [key: string]: boolean;
  }
  