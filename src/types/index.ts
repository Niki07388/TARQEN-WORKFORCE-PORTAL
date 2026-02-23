export type UserRole = 'CTO' | 'Employee';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  status: string;
}

export interface Session {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  work_uploaded: boolean;
}

export interface WorkUpload {
  id: number;
  session_id: number;
  user_id: number;
  project_name: string;
  task_id: string;
  description: string;
  repo_link: string | null;
  created_at: string;
}

export interface SystemSettings {
  min_daily_hours: string;
  max_session_duration: string;
  late_threshold: string;
  auto_checkout: string;
}
