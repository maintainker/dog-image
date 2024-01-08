const imageContainer = document.querySelector(".dog-image-container");
const breedSelect = document.querySelector("#breed");
const subBreedSelect = document.querySelector("#sub-breed");
const responseObj = {
  dogList: {},
  dogImages: {},
};

const getBreedImage = async (breed) => {
  if (!responseObj.dogImages[breed]) {
    const breedImageListRes = await fetch(
      `https://dog.ceo/api/breed/${breed}/images`
    );
    const breedImageListData = await breedImageListRes.json();
    responseObj.dogImages[breed] = breedImageListData.message;
  }
  imageContainer.innerHTML = "";
  responseObj.dogImages[breed].forEach((imageSrc, idx) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "breed-" + breed + idx;
    imageContainer.appendChild(img);
  });
};
const getSubBreedImage = async (breed, subBreed) => {
  if (!responseObj.dogImages[breed]?.[subBreed]) {
    const breedImageListRes = await fetch(
      `https://dog.ceo/api/breed/${breed}/${subBreed}/images`
    );
    const breedImageListData = await breedImageListRes.json();
    responseObj.dogImages[breed][subBreed] = breedImageListData.message;
  }
  imageContainer.innerHTML = "";
  responseObj.dogImages[breed][subBreed].forEach((imageSrc, idx) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "breed-" + breed + subBreed + idx;
    imageContainer.appendChild(img);
  });
};

const handleChangeBreed = async (breed, subBreed) => {
  if (subBreed && subBreed !== "all") {
    getSubBreedImage(breed, subBreed);
    return;
  }
  const subBreedList = ["all", ...(responseObj.dogList?.[breed] || [])];
  subBreedSelect.innerHTML = "";
  subBreedList.forEach((subBreed) => {
    const option = document.createElement("option");
    option.innerHTML = subBreed;
    option.name = subBreed;
    option.value = subBreed;
    subBreedSelect.appendChild(option);
  });
  getBreedImage(breed);
};

const init = async () => {
  const dogListRes = await fetch("https://dog.ceo/api/breeds/list/all");
  const dogListData = await dogListRes.json();
  responseObj.dogList = dogListData?.message || {};
  const breedKeys = Object.keys(responseObj.dogList);

  breedKeys.forEach((breed) => {
    const option = document.createElement("option");
    option.innerHTML = breed;
    option.name = breed;
    option.value = breed;
    breedSelect.appendChild(option);
  });
  handleChangeBreed(breedSelect.value);
};

init();

breedSelect.addEventListener("change", (e) =>
  handleChangeBreed(e.target.value)
);

subBreedSelect.addEventListener("change", (e) =>
  handleChangeBreed(breedSelect.value, e.target.value)
);
