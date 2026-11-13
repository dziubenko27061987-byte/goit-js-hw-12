import axios from 'axios';

const API_KEY = '58548400-5aaa26a2e6e3814b8c4a13947'; 
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15, 
    },
  });
  return response.data; 
}