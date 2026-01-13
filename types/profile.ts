export interface IProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
  weight: number;
  height: number;
  selected_meal_ids: number[];
  goal_id: number;
  sex: string;
  activity_level: string;
  age: number;
}
