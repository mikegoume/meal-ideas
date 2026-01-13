import { supabase } from '@/lib/supabase';

export async function getFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_liked_recipes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn(error.message);
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}
