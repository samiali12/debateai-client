export interface EngagementData {
  engagement_over_time: TimePoint[];
  user_activity: UserActivity[];
  role_trend: RoleTrendPoint[];
}

export interface TimePoint {
  timestamp: string;
  count: number;
}

export interface UserActivity {
  user_id: number;
  name: string;
  count: number;
}

export interface RoleTrendPoint {
  timestamp: string;
  for_count: number;
  against_count: number;
  neutral_count: number;
}