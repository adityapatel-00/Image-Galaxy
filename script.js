const apiKey = '5yeHnwRYsNOf6jSA8mpU71lGyJ5Tlua3otjncret9EPN6MsvEr7iPBHg';
const imageContainer = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load_more');
const searchImg = document.querySelector('.search-box input');
const recentSearch = document.querySelector('.recent-search');
const recentSearchContainer = document.querySelector('.recent-search');
const delAll = document.querySelector('.del_all');
let currentPage = Math.random() * 100 + 1;
let userSearch = null;

let recentArr = [];

const setLocalStorage = function () {
  delAll.classList.remove('hidden');
  localStorage.setItem('recent', JSON.stringify(recentArr));
};

const getLocalStorage = function () {
  const localRecent = JSON.parse(localStorage.getItem('recent'));
  if (!localRecent) return;
  recentArr = localRecent;
  if (recentArr.length > 0) {
    delAll.classList.remove('hidden');
    renderRecentArray();
  }
};

const renderImages = function (photos) {
  photos.map(photo => {
    const html = `
        <li class="card">
          <img src="${photo.src.large2x}" alt="" />
          <div class="details hidden">
            <div class="description">
              <i class="fa-solid fa-circle-info"></i>
              <span>${photo.alt}</span>
            </div>
            <button onclick="download('${photo.src.large2x}')"><i class="fa-solid fa-download"></i></button>
          </div>
        </li>
    `;
    imageContainer.insertAdjacentHTML('beforeend', html);
  });
};

const download = imgURL => {
  fetch(imgURL)
    .then(response => response.blob())
    .then(file => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert('Unable to download Image'));
};

const getImages = function (URL) {
  loadMoreBtn.textContent = 'Loading..';
  loadMoreBtn.classList.add('disabled');
  fetch(URL, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      renderImages(data.photos);
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.classList.remove('disabled');
    })
    .catch(() => alert('Failed to load images'));
};

const loadMoreImages = () => {
  currentPage = Math.random() * 100 + 1;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15`;
  apiURL = userSearch
    ? `https://api.pexels.com/v1/search?query=${userSearch}&page=${currentPage}&per_page=15 `
    : apiURL;
  getImages(apiURL);
};

const getURL = function (content) {
  getImages(
    `https://api.pexels.com/v1/search?query=${content}&page=${currentPage}&per_page=15 `
  );
};

const renderRecentArray = () => {
  //   document.querySelector('.search-box i').style.top = 68 + '%';
  recentSearchContainer.innerHTML = '';
  recentArr.forEach(ele => {
    const html = `
        <button class="recent">${ele}</button>
        `;
    recentSearchContainer.insertAdjacentHTML('afterbegin', html);
  });
};

const pushRecent = content => {
  if (recentArr.includes(content)) return;
  if (recentArr.length === 5) {
    recentArr.shift();
  }
  recentArr.push(content);
  setLocalStorage();
  renderRecentArray();
};

const loadSearchImg = function (e) {
  if (e.key === 'Enter') {
    if (e.target.value === '') {
      imageContainer.innerHTML = '';
      userSearch = null;
      return loadMoreImages();
    }
    userSearch = searchImg.value;
    imageContainer.innerHTML = '';
    pushRecent(userSearch);
    getURL(userSearch);
  }
};

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15`);

loadMoreBtn.addEventListener('click', loadMoreImages);

searchImg.addEventListener('keyup', loadSearchImg);

recentSearchContainer.addEventListener('click', function (e) {
  const recSea = e.target.closest('.recent');
  if (!recSea) return;
  imageContainer.innerHTML = '';
  searchImg.value = e.target.textContent;
  userSearch = e.target.textContent;
  getURL(e.target.textContent);
});

getLocalStorage();

const delRecent = function () {
  recentArr = [];
  setLocalStorage();
  renderRecentArray();
  delAll.classList.add('hidden');
};

delAll.addEventListener('click', delRecent);
