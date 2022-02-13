// GQL Playground: https://graphql.contentful.com/content/v1/spaces/4jwiardffwbu/explore?access_token=awQEKkQycL_bXtl2eUMyN9dV4cWbySYHBKCpWieQLB8

const endpoint = 'https://graphql.contentful.com/content/v1/spaces/4jwiardffwbu';

const query = `{
    recipeCollection(order: [publishDate_DESC], limit: 5) {
        items {
            sys {
                firstPublishedAt
                id
            }
            slug
			publishDate
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
	method: 'POST',
	headers: {
		Authorization: 'Bearer awQEKkQycL_bXtl2eUMyN9dV4cWbySYHBKCpWieQLB8',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ query }),
};

const renderRecipes = (items) => {
	items.slice(1).forEach((item) => {
		buildRecipeCollage(item);
	});

	const featured = items[0];
	buildFeatureRecipe(featured);
};

// Let's fetch the data - check out the browser console!
fetch(endpoint, fetchOptions)
	.then((response) => response.json())
	.then((data) => renderRecipes(data.data.recipeCollection.items));

const buildRecipeCollage = (item) => {
	const recipeHolder = document.querySelector('[data-recipes]');

	const collageClassNames = {
		container: 'collage__container row',
		title: 'collage__title',
		titleContainer: 'collage__title-container column large-12 large-centered align-self-end',
		link: 'link-collage',
	};

	const recipeLink = document.createElement('a');
	recipeLink.href = `recipes/?title=${item.slug}`;
	recipeLink.className = collageClassNames.link;

	// Create Recipe Container
	const recipeContainer = document.createElement('section');
	recipeContainer.setAttribute('id', item.sys.id);
	recipeContainer.className = collageClassNames.container;

	// Give Container a background image
	if (item.heroImage) {
		recipeContainer.style.backgroundImage = `url('${item.heroImage.url}?w=1000')`;
	}

	// Create title container
	const titleContainer = document.createElement('div');
	titleContainer.setAttribute('id', item.sys.id);
	titleContainer.setAttribute('data-slug', item.slug);
	titleContainer.className = collageClassNames.titleContainer;
	recipeContainer.appendChild(titleContainer);

	// Add recipe title to title container
	if (item.title) {
		const recipeTitle = document.createElement('h4');
		recipeTitle.innerText = item.title;
		recipeTitle.className = collageClassNames.title;
		titleContainer.appendChild(recipeTitle);
	}

	// add recipe date to title conatiner
	const recipeDate = document.createElement('time');
	recipeDate.setAttribute('datetime', moment(item.publishDate).format('YYYY-MM-D'));
	recipeDate.innerText = moment(item.publishDate).calendar(null, { sameElse: 'MMMM Do, YYYY' });

	titleContainer.appendChild(recipeDate);

	recipeLink.appendChild(recipeContainer);

	// Add recipe to collage
	recipeHolder.appendChild(recipeLink);
};

const buildFeatureRecipe = (item) => {
	const featuredTarget = document.querySelector('[data-featured]');

	const featuredClassNames = {
		container: 'featured__container',
		image: 'featured__image',
		link: 'link-header',
	};

	// Create Recipe Container
	const recipeContainer = document.createElement('section');
	recipeContainer.setAttribute('id', item.sys.id);
	recipeContainer.className = featuredClassNames.container;
	recipeContainer.setAttribute('data-slug', item.slug);

	// Create Image
	if (item.heroImage) {
		const image = document.createElement('div');
		image.className = featuredClassNames.image;
		image.style.backgroundImage = `url('${item.heroImage.url}?w=1000')`;
		recipeContainer.appendChild(image);
	}

	// add recipe date
	const recipeDate = document.createElement('time');
	recipeDate.setAttribute('datetime', moment(item.publishDate).format('YYYY-MM-D'));
	recipeDate.innerText = moment(item.publishDate).calendar(null, { sameElse: 'MMMM Do, YYYY' });

	recipeContainer.appendChild(recipeDate);

	// Create Recipe Header Link
	if (item.slug) {
		const recipeLink = document.createElement('a');
		recipeLink.href = `recipes/?title=${item.slug}`;
		recipeLink.className = featuredClassNames.link;

		const recipeTitle = document.createElement('h1');
		recipeTitle.innerText = item.title;
		recipeLink.appendChild(recipeTitle);

		recipeContainer.appendChild(recipeLink);
	}

	// Recipe Description
	if (item.description) {
		const recipeDescription = document.createElement('p');
		recipeDescription.innerText = item.description;
		recipeContainer.appendChild(recipeDescription);
	}

	// Add latest recipe
	featuredTarget.appendChild(recipeContainer);
};
