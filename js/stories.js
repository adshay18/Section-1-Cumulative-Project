'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

//Create HTML Star for favorites
function makeStar(story, user) {
	const favorite = user.checkForFavorite(story);
	const starType = favorite ? 'fas' : 'far';
	return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	const generateStar = Boolean(currentUser);

	return $(`
      <li id="${story.storyId}">
        ${generateStar ? makeStar(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

// add a new story when the add story form is submitted

async function submitStory(evt) {
	console.debug('submitStory', evt);
	evt.preventDefault();

	const title = $('#stories-title').val();
	const author = $('#stories-author').val();
	const url = $('#stories-url').val();
	const username = currentUser.username;
	const data = { title, author, url, username };

	const rawStory = await storyList.addStory(currentUser, data);
	const $generatedStory = generateStoryMarkup(rawStory);

	$allStoriesList.prepend($generatedStory);
	$('#stories-title').val('');
	$('#stories-author').val('');
	$('#stories-url').val('');
	$storiesForm.hide();
}
//add listener for when story is bumitted, or to close the form
$('#submit-story').on('click', submitStory);
$('#close-submit').on('click', function(e) {
	e.preventDefault();
	$('#stories-title').val('');
	$('#stories-author').val('');
	$('#stories-url').val('');
	$storiesForm.hide();
});

//add functionality for showing favorites on page
function putFavoritesOnPage() {
	console.debug('putFavoritesOnPage');
	$favoriteStories.empty();
	if (currentUser.favorites.length !== 0) {
		for (let story of currentUser.favorites) {
			const $generatedStory = generateStoryMarkup(story);
			$favoriteStories.append($generatedStory);
		}
	} else {
		$favoriteStories.append('<p>No favorites yet! Try starring some articles you like.</p>');
	}

	$favoriteStories.show();
}

//run functions to change star and add or remove from favorite list
async function toggleFavorite(evt) {
	console.debug('toggleFavorite');

	const $tgt = $(evt.target);
	const $story = $tgt.closest('li');
	const storyId = $story.attr('id');
	const story = storyList.stories.find((s) => s.storyId === storyId);

	if ($tgt.hasClass('fas')) {
		await currentUser.removeFavorite(story);
		$tgt.closest('i').toggleClass('fas far');
	} else {
		await currentUser.addFavorite(story);
		$tgt.closest('i').toggleClass('fas far');
	}
}

$allStoriesList.on('click', '.star', toggleFavorite);
