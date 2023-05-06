const auth = "cokbVsNHZiHpogHUJ5LzL73lOnGyTxGCC6UdSOGHtgk7whF7bqBvjNIP";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const moreBtn = document.querySelector(".more");
const form = document.querySelector(".search-form ");
let page = 1;
let fetchLink;
let currentSearch;

let searchValue;
let mouse = document.querySelector(".cursor");

window.addEventListener("mousemove", function (e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
});

function zoomCursor(e) {
  const item = e.target;
  if (item.classList.contains("photo") || item.id === "logo") {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
}

// event listener
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

moreBtn.addEventListener("click", morePhotos);

// functions
function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <div class="gallery-info">
        <p  ><a class="photo"href=${photo.photographer_url} target="blank"> ${photo.photographer}</a></p>
        <a  href=${photo.src.original} target="blank" class="photo" >Download</a>
    </div>
    <img class="img" src=${photo.src.portrait}></img>`;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=10`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function morePhotos() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=10&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }

  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

window.addEventListener("mouseover", zoomCursor);
