const endpoint =
  "https://graphql.contentful.com/content/v1/spaces/4jwiardffwbu";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipeSlug = urlParams.get("title");

const query = `{
    recipeCollection(order: [publishDate_DESC]) {
        items {
            sys {
                firstPublishedAt
                id
            }
            slug
            title
            description
            ingredients
            instructions
            tags
            heroImage {
                url
                title
                width
                height
                description
            }
        }
    }
}`;

// Here are our options to use with fetch
const fetchOptions = {
  method: "POST",
  headers: {
    Authorization: "Bearer awQEKkQycL_bXtl2eUMyN9dV4cWbySYHBKCpWieQLB8",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
};

// Render the recipe with URL slug
const renderRecipe = (items) => {
  if (recipeSlug) {
    const recipe = items.find(({ slug }) => slug === recipeSlug);
    const recipeIndex = items.findIndex(({ slug }) => slug === recipeSlug);
    let next = "";
    let previous = "";

    if (recipeIndex > 0) {
      previous = items[recipeIndex - 1];
    } else {
      previous = items[items.length - 1];
    }

    if (recipeIndex === items.length - 1) {
      next = items[0];
    } else {
      next = items[recipeIndex + 1];
    }

    buildRecipe(recipe);

    buildRecipeNav(previous, next);
  } else {
    window.location.href = "../";
  }
};

// Fetch the data and handles the promise
fetch(endpoint, fetchOptions)
  .then((response) => response.json())
  .then((data) => renderRecipe(data.data.recipeCollection.items));

// Recipe Architecture
const buildRecipe = (item) => {
  const recipeHolder = document.querySelector("[data-recipe]");

  const recipeClassNames = {
    heading: "recipe__heading row align-items-start",
    titleContainer:
      "recipe__title-container column align-self-center large-4 large-offset-2 large-order-0 medium-12 medium-order-1 medium-offset-0 small-12 small-order-1 small-offset-0",
    imageContainer:
      "recipe__image column large-6 large-order-1 medium-12 medium-order-0 small-12 small-order-0",
    titleClamp: "recipe__title-clamp",
    title: "recipe__title hseading-1",
    tag: "tag",
    details: "recipe__details row align-items-start",
    ingredients: "recipe__ingredients column large-5 small-12",
    instructions:
      "recipe__instructions column large-6 large-offset-1 small-12 small-offset-0",
  };

  const newRecipe = document.createElement("article");
  newRecipe.setAttribute("id", item.sys.id);

  // Create Heading
  const recipeHeading = document.createElement("section");
  recipeHeading.className = recipeClassNames.heading;
  newRecipe.appendChild(recipeHeading);

  // Create Image Container
  const imageContainer = document.createElement("div");
  imageContainer.className = recipeClassNames.imageContainer;
  recipeHeading.appendChild(imageContainer);

  // Recipe Image
  if (item.heroImage) {
    imageContainer.style.backgroundImage = `url('${item.heroImage.url}?w=1000')`;
  }

  // Create Title Container
  const titleContainer = document.createElement("div");
  titleContainer.className = recipeClassNames.titleContainer;
  recipeHeading.appendChild(titleContainer);

  // Create Title Clamp
  const titleClamp = document.createElement("div");
  titleClamp.className = recipeClassNames.titleClamp;
  titleContainer.appendChild(titleClamp);

  // Recipe Date
  const recipeDate = document.createElement("time");
  recipeDate.setAttribute(
    "datetime",
    moment(item.sys.firstPublishedAt).format("YYYY-MM-D")
  );
  recipeDate.innerText = moment(item.sys.firstPublishedAt).calendar();

  titleClamp.appendChild(recipeDate);

  // Recipe Title
  if (item.title) {
    const recipeTitle = document.createElement("h1");
    recipeTitle.innerText = item.title;
    recipeTitle.className = recipeClassNames.title;
    titleClamp.appendChild(recipeTitle);
  }

  // Recipe tags
  if (item.tags) {
    const recipeTags = document.createElement("div");

    item.tags.forEach((tag) => {
      const recipeTag = document.createElement("span");
      recipeTag.innerText = tag;
      recipeTag.className = recipeClassNames.tag;
      recipeTags.appendChild(recipeTag);
    });
    titleClamp.appendChild(recipeTags);
  }

  // Recipe Description
  if (item.description) {
    const recipeDescription = document.createElement("p");
    recipeDescription.innerText = item.description;
    titleClamp.appendChild(recipeDescription);
  }

  // Create Detail Container
  const recipeDetails = document.createElement("section");
  recipeDetails.className = recipeClassNames.details;
  newRecipe.appendChild(recipeDetails);

  // Recipe Ingredients
  if (item.ingredients) {
    const recipeIngredients = document.createElement("div");
    recipeIngredients.innerHTML = marked.parse(item.ingredients);
    recipeIngredients.className = recipeClassNames.ingredients;
    recipeDetails.appendChild(recipeIngredients);
  }

  // Recipe Instructions
  if (item.instructions) {
    const recipeInstructions = document.createElement("div");
    recipeInstructions.innerHTML = marked.parse(item.instructions);
    recipeInstructions.className = recipeClassNames.instructions;
    recipeDetails.appendChild(recipeInstructions);
  }
  // Add Recipe to the DOM
  recipeHolder.appendChild(newRecipe);
};

const buildRecipeNav = (prev, next) => {
  const nextWrapper = document.querySelector("[data-recipe-next]");
  const prevWrapper = document.querySelector("[data-recipe-previous]");

  const nextRecipe = document.createElement("a");
  nextRecipe.href = `?title=${next.slug}`;
  nextRecipe.innerHTML = `<p>Next</p><h4>${next.title}</h4>`;
  nextWrapper.appendChild(nextRecipe);

  const prevRecipe = document.createElement("a");
  prevRecipe.href = `?title=${prev.slug}`;
  prevRecipe.innerHTML = `<p>Previous</p><h4>${prev.title}</h4>`;
  prevWrapper.appendChild(prevRecipe);
};
