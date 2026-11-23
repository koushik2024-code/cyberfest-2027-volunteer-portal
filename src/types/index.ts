export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Selected' | 'Rejected';

export type DepartmentName =
  | 'Technical'
  | 'Events'
  | 'Public Relations (PR)'
  | 'Design'
  | 'Video Editing'
  | 'Sponsorship'
  | 'External Affairs'
  | 'Documentation';

export interface Application {
  id: string;
  application_id: string;
  full_name: string;
  roll_number: string;
  areas_of_interest: DepartmentName[];
  application_status: ApplicationStatus;
  created_at: string;
}

export interface ApplicationFormData {
  fullName: string;
  rollNumber: string;
  areasOfInterest: DepartmentName[];
}

export interface SystemSettings {
  is_open: boolean;
  deadline: string; // ISO string with IST timezone
  announcement: string;
  show_live_count: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'coordinator';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
