const $ = document;

const countriesParent = $.querySelector(".countries");
const modaleParent = $.querySelector(".modale");
const modaleScreen = $.querySelector(".modale__screen");
const modaleCloser = $.querySelector(".modale__closer");
const searchInput = $.querySelector(".search__input");
const searchResult = $.querySelector(".search__result");
const filterSelector = $.querySelector(".filter");
const modeBtn = $.querySelector(".mode__btn");
const modeList = $.querySelector(".mode__list");
const modeItems = $.querySelectorAll(".mode__item");

let filterCountries = [...countryList];
let filter = "all";
let timeOut;

const appGenerator = () => {
  countryDOMGenerator(countryList);
  setAppTheme();
};

const filterCountry = () => {
  const value = searchInput.value.toLowerCase().trim();
  filterCountries = [...countryList].filter((country) => {
    const {
      name: { common },
      region,
    } = country;

    const checkValue = common.toLowerCase().includes(value);
    const checkRegion = region.toLowerCase() === filter.toLowerCase();

    switch (filter) {
      case "all":
        return checkValue;
        break;

      default:
        return checkValue && checkRegion;
        break;
    }
  });
  return filterCountries;
};
const searchCountry = () => {
  clearTimeout(timeOut);
  filterCountries = filterCountry();

  if (searchInput.value.trim()) {
    searchResult.innerText = filterCountries.length;
    searchResult.classList.add("search__result--active");
  } else {
    searchInput.value = searchInput.value.trim();
    searchResult.classList.remove("search__result--active");
  }

  countryDOMGenerator(filterCountries);

  timeOut = setTimeout(() => {
    searchResult.classList.remove("search__result--active");
  }, 2000);
};
const setFilterCountry = () => {
  filter = filterSelector.value;

  filterCountries = filterCountry();
  countryDOMGenerator(filterCountries);
};
const toggleModeListActivat = () => {
  modeBtn.classList.toggle("mode__btn--active");
  modeList.classList.toggle("mode__list--active");
};

window.showModal = (countryCode) => {
  const regEx = /\B(?=(\d{3})+(?!\d))/g;

  modaleScreen.innerHTML = "";
  const {
    name: { common },
    flag: { alt },
    capital,
    region,
    cca2,
    currencies,
    languages,
    callingCodes,
    government,
    population,
  } = countryList.find(({ cca2 }) => cca2 === countryCode);

  let langs = [];
  let pep = "";

  languages.forEach((lang) => {
    langs.push(lang.name);
  });

  langs = langs.join(" , ");
  pep = String(population).replace(regEx, ",");

  modaleScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modale__cover">
        <img src="https://flags.restcountries.com/v5/w640/${cca2.toLowerCase()}.png" alt="" class="modale__img">
        <h2 class="modal__name">${common}</h2>
    </div>
    ${
      capital[0]
        ? `
        <div class="modale__content">
            <span class="modale__title">capitals:</span>
            <span class="modale__text">${capital[0]}</span>
        </div>
        `
        : ""
    }
    <div class="modale__content">
        <span class="modale__title">rigon:</span>
        <span class="modale__text">${region}</span>
    </div>
    ${
      currencies[0]
        ? `
        <div class="modale__content">
            <span class="modale__title">mony:</span>
            <span class="modale__text">${currencies[0]?.name}(${currencies[0]?.symbol})</span>
        </div>
        `
        : ""
    }
    ${
      langs.length
        ? `
        <div class="modale__content">
            <span class="modale__title">languages:</span>
            <span class="modale__text">${langs}</span>
        </div>
        `
        : ""
    }
    <div class="modale__content">
        <span class="modale__title">calling codes:</span>
        <span class="modale__text">+${callingCodes[0]}</span>
    </div>
    ${
      government
        ? `
    <div class="modale__content">
        <span class="modale__title">leader:</span>
        <span class="modale__text">${government?.leaders[0]?.name}</span>
    </div>
        `
        : ""
    }
    <div class="modale__content">
        <span class="modale__title">population:</span>
        <span class="modale__text">${pep}</span>
    </div>
    `,
  );

  setTimeout(() => {
    modaleParent.classList.remove("modale--hidden");
  }, 100);
};
const hideModal = () => modaleParent.classList.add("modale--hidden");

const countryDOMGenerator = (countryList) => {
  countriesParent.innerHTML = "";
  let population;
  console.log(countryList[0]);

  const regEx = /\B(?=(\d{3})+(?!\d))/g;
  const fragment = $.createDocumentFragment();

  countryList.forEach((country) => {
    const {
      name: { common },
      flag: { alt },
      region,
      cca2,
    } = country;

    modaleParent.classList.add(region);

    population = String(country.population).replace(regEx, ",");
    const article = $.createElement("article");
    article.className = "countries__box";

    article.insertAdjacentHTML(
      "beforeend",
      `
        <div class="countries__flag">
            <img src="https://flags.restcountries.com/v5/w640/${cca2.toLowerCase()}.png" alt="${alt}" class="countries__img">
        </div>

        <div class="countries__content countries__content--first">
            <span class="countries__title">Country Name</span>
            <span class="countries__text">${common}</span>
        </div>

        <div class="countries__wrapper">
            <div class="countries__content">
                <span class="countries__title">Region</span>
                <span class="countries__text">${region}</span>
            </div>

            <div class="countries__content">
                <span class="countries__title">
                    <i class="fas fa-users"></i>
                </span>
                <span class="countries__text countries__text--number">${population}</span>
            </div>
        </div>

        <div class="countries__control">
            <button class="countries__btn" onclick="showModal('${cca2}')">
                <span>More information</span>
                <i class="fas fa-plus"></i>
            </button>
        </div>
        `,
    );
    fragment.append(article);
  });

  countriesParent.append(fragment);
};

const saveLoaclStorageTheme = (e) => {
  $.documentElement.classList.remove("light", "dark", "glass");

  const theme = e.target.dataset.theme;
  localStorage.setItem("theme", theme);

  setAppTheme();
};

const setAppTheme = () => {
  const theme = localStorage.getItem("theme");

  if (theme) {
    $.documentElement.classList.add(theme);

    modeItems.forEach((btn) => {
      btn.classList.remove("mode__item--active");
      const { dataset } = btn;

      if (dataset.theme === theme) {
        btn.classList.add("mode__item--active");
      }
    });
  }
};

window.addEventListener("load", appGenerator);
searchInput.addEventListener("input", searchCountry);
modaleCloser.addEventListener("click", hideModal);
filterSelector.addEventListener("change", setFilterCountry);
modeBtn.addEventListener("click", toggleModeListActivat);
window.addEventListener("click", (e) => {
  if (e.target !== modeBtn) {
    modeBtn.classList.remove("mode__btn--active");
    modeList.classList.remove("mode__list--active");
  }
});
modeItems.forEach((btn) => {
  btn.addEventListener("click", saveLoaclStorageTheme);
});
