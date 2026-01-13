import axios from 'axios';

export async function getMeals() {
  try {
    const res = await axios.get('https://devsassemble.ovh/api/v1/meals');
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecipesFromSpoonacular(params) {
  try {
    const res = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
