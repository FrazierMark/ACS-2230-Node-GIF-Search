// Require Libraries
const express = require('express');

const Tenor = require('tenorjs').client({
	Key: 'AIzaSyD4cPWx0F4qgiDZc6D6jDrw_N5dxCqhlyY', // https://developers.google.com/tenor/guides/quickstart
	Filter: 'off', // "off", "low", "medium", "high", not case sensitive
	Locale: 'en_US', // Your locale here, case-sensitivity depends on input
	MediaFilter: 'minimal', // either minimal or basic, not case sensitive
	DateFormat: 'D/MM/YYYY - H:mm:ss A', // Change this accordingly
});

// App Setup
const app = express();

app.use(express.static('public'));

// Middleware
// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
	// Specify helpers which are only registered on this instance.
	helpers: {
		foo() {
			return 'FOO!';
		},
		bar() {
			return 'BAR!';
		},
	},
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
	// Handle the home page when we haven't queried yet
	term = 'Tacos';
	if (req.query.term) {
		term = req.query.term;
	}
	// Tenor.search.Query("SEARCH KEYWORD HERE", "LIMIT HERE")
	Tenor.Search.Query(term, '10')
		.then((response) => {
			// store the gifs we get back from the search in a variable called gifs
			const gifs = response;
			// pass the gifs as an object into the home page
			res.render('home', { gifs });
		})
		.catch(console.error);
});

app.get('/greetings/:name', (req, res) => {
	// grab the name from the path provided
	const name = req.params.name;
	// render the greetings view, passing along the name
	res.render('greetings', { name });
});

// Start Server

app.listen(3000, () => {
	console.log('Gif Search listening on port localhost:3000!');
});
