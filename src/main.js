import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import { 
  createGallery, 
  clearGallery, 
  showLoader, 
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

hideLoadMoreButton();

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  currentQuery = searchInput.value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Увага',
      message: 'Будь ласка, заповніть поле пошуку!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  currentPage = 1; 

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        maxWidth: '430px',
      });
      return;
    }

    createGallery(data.hits);

    if (data.hits.length < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

  } catch (error) {
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Щось пішло не так. Спробуйте пізніше.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    
    createGallery(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const loadedImagesCount = currentPage * 15;
    
    if (loadedImagesCount >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

  } catch (error) {
    console.error('Помилка дозавантаження:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити додаткові зображення.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

console.log('Шаблон готовий. Можна писати код 🚀');
