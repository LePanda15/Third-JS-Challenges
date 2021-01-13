/* 
  In order to find a pattern in a string you will mostly want to use regex and string.match method.
  You can create a new regex with a custom string by using the RegExp constructor and apply to it the g an i flags,
  g for global and i in order to ignore case. 
  Example :
    const string = '#$)($#)(hey)#$)(@02)';
    const patternToFind = new RegExp('hey','gi');
    return string.match(patternToFine) // true;
*/
var ApiController = (function() 
{
	const api = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

	const cities = [];
	fetch(api)
		.then(blob => blob.json())
		.then(data => cities.push(...data));
	
	return {
		getCities: function() {
			return cities;
		}
	};
})();

var UIController = (function()
{
	var DOMStrings = 
	{
		classSearchForm: ".search-form",
		classInputSearch: ".search",
		classSuggestion:".suggestions"
	};
	
	return {
		getDOMStrings: function() {
			return DOMStrings;
		},

		addSuggenstions: function(suggestions) {
			for (let i = 0; i < suggestions.length; i++)
			{
				// addElement(suggestions[i]);
				document.querySelector(DOMStrings.classSuggestion).insertAdjacentHTML('beforeend', suggestions[i]);
			}
		},

		orignalState: function() {
			document.querySelector(DOMStrings.classSuggestion).innerHTML = '<li>Filter for a city</li><li>or a state</li>';
		}
	};
})();

var SuggestionController = (function()
{
	var searchCities = function(cities, regex)
	{
		var matches = [];

		// Gets the pattern part of the regex object
		var pattern = regex ? regex.toString().substring(1, regex.toString().length - 3) : "";

		for(let i = 0; i < cities.length; i++)
		{
			if (cities[i].city.match(regex) || cities[i].state.match(regex))
			{
				let match, html;
				match = `${cities[i].city}, ${cities[i].state}`;
				html = htmlFormation(match, pattern);
				matches.push(html);
			}
		}

		return matches;
	};

	// Creates list items elements.
	var htmlFormation = function(match, pattern)
	{
		let html;
		html = `<li>${match.replace(new RegExp(pattern,'gi'), '<span class="hl">' + pattern + '</span>')}</li>`;
		return html;
	}

	return {
		getSuggestions: function(cities, pattern) {
			var regex = new RegExp(pattern, 'gi');
			return searchCities(cities, regex);
		}
	};
})();

var Controller = (function(ApiCtrl, UICtrl, SuggestionCtrl)
{
	var setupEventListeners = function()
	{
		var dom, suggestionList, searchContent, cities, matches;

		dom = UICtrl.getDOMStrings();
		cities = ApiCtrl.getCities();

		suggestionList = document.querySelector(dom.classSuggestion);
		input = document.querySelector(dom.classInputSearch);

		input.addEventListener('input', function()
		{
			// Get currnt content of input
			searchContent = input.value;

			// Retrive matches from city list
			if (searchContent)
			{
				matches = SuggestionCtrl.getSuggestions(cities, searchContent);

				// Remove current items from list
				suggestionList.innerHTML = '';

				// Display matches in list
				UICtrl.addSuggenstions(matches);
			}
			else
			{
				UICtrl.orignalState();
			}	
		});	
	};

	return{
		init: function()
		{
			console.log("started");
			setupEventListeners();
		}
	};
})(ApiController, UIController, SuggestionController);

Controller.init();