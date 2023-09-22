const loadingScreen = document.getElementById("loadingScreen");
const welcomeScreen = document.getElementById("welcomeScreen");

const getPokemonNameArray = async () => {
  try {
    const inputNumber = getInputNumber();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${inputNumber}`
    );
    const data = await response.json();
    const pokemonNames = data.results.map((pokemon) => pokemon.name);
    const allPromises = pokemonNames.map((name) => displayPokemonData(name));
    await Promise.all(allPromises);

    loadingScreen.style.animation = "getDown 1s ease-in";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 900);
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};
function getInputNumber() {
  const inputNumber = document.getElementById("wantPokemon").value;
  return inputNumber;
}

function getInputHandler() {
  const inputBtn = document.getElementById("welcome-btn");
  inputBtn.addEventListener("click", () => {
    const inputNumber = getInputNumber();

    if (inputNumber < 1) {
      alert("More Then Zero.");
      return;
    }

    welcomeScreen.style.animation = "getDown 1s linear";
    loadingScreen.style.animation = "getUp 1s linear";

    setTimeout(() => {
      welcomeScreen.style.display = "none";
    }, 900);

    getPokemonNameArray();
  });
}


const getPokemonData = async (pokemonName) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  const data = await response.json();
  return data;
};

const displayPokemonData = async (pokemonName) => {
  try {
    const pokemonData = await getPokemonData(pokemonName);
    const cardTemplate = document.getElementById("poke-card-template");
    const clonecardTemplate = document.importNode(cardTemplate.content, true);

    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__img"
    ).src = pokemonData.sprites.other.home.front_default;
    clonecardTemplate.querySelector(
      ".pokemon-class-filter__class__img-box--img"
    ).src = `img/type/${pokemonData.types[0].type.name}-type.png`;
    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__stats__name"
    ).textContent = pokemonData.name;
    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__stats__healt"
    ).textContent = `Health Point: ${pokemonData.stats[0].base_stat}`;
    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__stats__atack"
    ).textContent = `Attack: ${pokemonData.stats[1].base_stat}`;
    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__stats__defense"
    ).textContent = `Defense: ${pokemonData.stats[2].base_stat}`;
    clonecardTemplate.querySelector(
      ".pokemon-card-container__card__front__stats__speed"
    ).textContent = `Speed: ${pokemonData.stats[2].base_stat}`;

    //Flip efektini uygula
    const card = clonecardTemplate.querySelector(
      ".pokemon-card-container__card"
    );
    card.setAttribute("data-type", pokemonData.types[0].type.name);

    const cardFront = card.children[0];
    const cardBack = card.children[1];

    card.addEventListener("click", () => {
      card.children[0].classList.toggle("active-front");
      card.children[1].classList.toggle("active-back");
    });

    //Arkaplan renklerini ayarla
    const pokemonTypeColors = {
      dark: "#5b5366",
      elektric: "#fbd200",
      fairy: "#fb8aec",
      fighting: "#e12c6a",
      ground: "#e97333",
      ice: "#4bd2c1",
      poison: "#b667cf",
      psychic: "#ff6676",
      rock: "#c9b787",
      steel: "#598fa3",
      water: "#3393dd",
      normal: "#d3d4d3",
      grass: "#63bc5d",
      fire: "#f9a555",
      flying: "#a2bcea",
      dragon: "#176cc5",
      bug: "#93bb3a",
      ghost: "#606fba",
    };

    const pokemonType = pokemonData.types[0].type.name;
    if (pokemonTypeColors[pokemonType]) {
      cardFront.style.backgroundColor = pokemonTypeColors[pokemonType];
      cardBack.style.backgroundColor = pokemonTypeColors[pokemonType];
    }

    const typeInfo = await displayPokemonPower(pokemonData.types[0].type.name);
    const strongSectionForCard = clonecardTemplate.getElementById("strong");
    const powerlessSectionForCard =
      clonecardTemplate.getElementById("powerless");

    typeInfo.strong.forEach((type) => {
      const imgBox = document.createElement("div");
      imgBox.classList.add("pokemon-class-filter__class__img-box");
      const img = document.createElement("img");
      img.classList.add("pokemon-class-filter__class__img-box--img");
      img.src = `img/type/${type}-type.png`;
      img.alt = `${type}Type`;

      imgBox.append(img);
      strongSectionForCard.append(imgBox);
    });

    typeInfo.weak.forEach((type) => {
      const imgBox = document.createElement("div");
      imgBox.classList.add("pokemon-class-filter__class__img-box");
      const img = document.createElement("img");
      img.classList.add("pokemon-class-filter__class__img-box--img");
      img.src = `img/type/${type}-type.png`;
      img.alt = `${type}Type`;

      imgBox.append(img);
      powerlessSectionForCard.append(imgBox);
    });

    const pokeapp = document.getElementById("pokemon-app");
    pokeapp.append(clonecardTemplate);
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

const displayPokemonPower = async (pokemonType) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/type/${pokemonType}`
    );
    const data = await response.json();
    const doubleDamageFrom = data.damage_relations.double_damage_from.map(
      (relation) => relation.name
    );
    const doubleDamageTo = data.damage_relations.double_damage_to.map(
      (relation) => relation.name
    );

    return {
      strong: doubleDamageFrom,
      weak: doubleDamageTo,
    };
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

function filterType() {
  const filterTypeBtns = document.querySelectorAll(
    ".pokemon-class-filter__class"
  );
  let previouslyClickedBtn = null;

  filterTypeBtns.forEach((e) => {
    e.addEventListener("click", (event) => {
      if (event.currentTarget === previouslyClickedBtn) {
        previouslyClickedBtn.style.backgroundColor = "";
        previouslyClickedBtn.querySelector("span").style.color = "";
        previouslyClickedBtn = null;
        showAllPokemons();
        return;
      }

      if (previouslyClickedBtn) {
        previouslyClickedBtn.style.backgroundColor = "";
        previouslyClickedBtn.querySelector("span").style.color = "";
      }

      event.currentTarget.style.backgroundColor = "#777";
      event.currentTarget.querySelector("span").style.color = "white";

      previouslyClickedBtn = event.currentTarget;

      // Pokemonları filtrele
      const selectedType = event.currentTarget.getAttribute("data-type");
      filterPokemonByType(selectedType);
    });
  });

  function filterPokemonByType(type) {
    const allPokemons = document.querySelectorAll(
      ".pokemon-card-container__card"
    );

    allPokemons.forEach((card) => {
      const cardType = card.getAttribute("data-type");
      if (cardType !== type) {
        card.style.display = "none";
      } else {
        card.style.display = "block";
      }
    });
  }
  function showAllPokemons() {
    const allPokemons = document.querySelectorAll(
      ".pokemon-card-container__card"
    );

    allPokemons.forEach((card) => {
      card.style.display = "block";
    });
  }
}

class App {
  static init() {
    filterType();
    getInputHandler();
  }
}

App.init();
