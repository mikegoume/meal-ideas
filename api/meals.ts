import axios from 'axios';

export async function getMeals() {
  try {
    const res = await axios.get('https://devsassemble.ovh/api/v1/meals');
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
