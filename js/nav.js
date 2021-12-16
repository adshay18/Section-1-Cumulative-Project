'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

// Show submit story on click 'submit story'
function submitStoryClick(evt) {
	console.debug('submitStoryClick', evt);
	hidePageComponents();
	$allStoriesList.show();
	$storiesForm.show();
}

$navSubmit.on('click', submitStoryClick);

//show favorites of user when clicking on favorites link
function openFavorites(evt) {
	console.debug('openFavorites', evt);
	hidePageComponents();
	putFavoritesOnPage();
}

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.nav-actions').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
