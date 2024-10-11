
"use strict";

/** This object sets up the word search game, as well as button functions (for solving
 * and for refreshing/setting up a new game).
 *
 * @author ...
 *
 * @param {String} gameId ID of the word search game div (where the actual grid of letters goes)
 * @param {String} listId ID of the div where the list of words to find goes
 * @param {String} solveId ID for button to solve the puzzle
 * @param {String} newGameId ID for button to start a new game
 * @param {String} instructionsId ID for the h2 heading (to allow us to update its text with ease)
 * @param {String} themeId ID for part of the h3 heading (to show the theme of the word search)
 */

function WordSearchController(gameId, listId, solveId, newGameId, instructionsId, themeId) {

    // Preload background images
    preloadImages();

    /** Preload background images */
    function preloadImages() {
        var themes = [
            '../images/math_theme.jpg',
            '../images/astronomy_theme.jpg',
            '../images/philosophy_theme.jpg',
            '../images/mythology_theme.jpg',
            '../images/purple_theme.jpg',
            '../images/cats_theme.jpg'
        ];

        themes.forEach(function(src) {
            var img = new Image();
            img.src = src;
        });
    }

    // An object containing various themes/words for the game
    var searchTypes = {
        "Math! (please don't run away)": [["asymptote", "differential", "algorithm", "boolean"],
            ["euclidean", "integral", "logarithm", "matrix"],
            ["riemann", "polyhedron", "theta", "vector"],
            ["binomial", "pythagoras", "eccentricity", "unit circle"],
            ["derivative", "polar coordinates", "tangent", "scalene"]],

        "Astronomy and Physics!": [["circumpolar", "comet", "asteroid", "declination"],
            ["earthshine", "albedo", "quantum", "olivine"],
            ["pyroxene", "decoherence", "fermion", "quark"],
            ["gluon", "redshift", "inflaton", "planetesimal"],
            ["anthropic", "exogenesis", "atom", "planck"]],

        "Philosophy!": [["metaphysics", "modus ponens", "modus tollens", "analogy"],
            ["a priori", "a posteriori", "conditional", "nietzsche"],
            ["diogenes", "paradox", "occam's razor", "causality"],
            ["induction", "deduction", "ontology", "theology"],
            ["syllogism", "ethics", "karl marx", "pluralism"]],

        "World Mythology :D": [["chronos", "aether", "hypnos", "psyche"],
            ["jupiter", "sol", "chaos", "pandora"],
            ["thor", "valhalla", "amaterasu", "osiris"],
            ["mazu", "izanami", "susanoo", "xipe totec"],
            ["mercury", "bastet", "sekhmet", "ptah"]],

        "Shades of Purple!": [["violet", "periwinkle", "plum", "grape"],
            ["orchid", "wine", "mauve", "lavender"],
            ["lilac", "mulberry", "eggplant", "heliotrope"],
            ["liseran purple", "amethyst", "fuchsia", "pomp and power"],
            ["sangria", "boysenberry", "thistle", "heather"]],

        "The Many Different Flavors of Cat!": [["Russian Blue", "Siamese", "Persian", "Sphynx"],
            ["Ragdoll", "Singapura", "Snowshoe", "Turkish Van"],
            ["Maine Coon", "Devon Rex", "Charteux", "Scottish Fold"],
            ["Himalayan", "Ragamuffin", "Bombay", "Siberian"],
            ["Egyptian Mau", "Norwegian Forest Cat", "Abyssinian", "York Chocolate"]]
    };

    // Variables to store game logic and its view
    var game;
    var view;

    // Instructions to display in h2 header
    var mainInstructions = "Search for the list of words inside the box and click-and-drag to select them!";

    // Function call to start the word search game
    setUpWordSearch();

    /** Randomly chooses a word theme and sets up the game matrix and the game
     * view to reflect that theme
     *
     * @param {String} selectedTheme (optional) specific theme to set up, defaults to random
     */
    function setUpWordSearch(selectedTheme = "random") {
        var searchTypesArray = Object.keys(searchTypes);
        var theme;

        if (selectedTheme === "random") {
            var randIndex = Math.floor(Math.random() * searchTypesArray.length);
            theme = searchTypesArray[randIndex];
        } else if (searchTypesArray.includes(selectedTheme)) {
            theme = selectedTheme;
        } else {
            theme = searchTypesArray[0]; // default to first theme if invalid
        }

        var listOfWords = searchTypes[theme];

        // Convert words to uppercase
        convertToUpperCase(listOfWords);

        // Update headings
        updateHeadings(mainInstructions, theme);

        // Update background based on selected theme
        updateBackground(theme);

        // Existing game setup logic
        game = new WordSearchLogic(gameId, listOfWords.slice());
        game.setUpGame();
        view = new WordSearchView(game.getMatrix(), game.getListOfWords(), gameId, listId, instructionsId);
        view.setUpView();
        view.triggerMouseDrag();
    }

    /** Converts a given 2D array of words to all uppercase
     *
     * @param {String[][]} wordList a matrix of words to convert to uppercase
     */
    function convertToUpperCase(wordList) {

        for (var i = 0; i < wordList.length; i++) {

            for (var j = 0; j < wordList[i].length; j++) {

                wordList[i][j] = wordList[i][j].toUpperCase();

            }

        }

    }

    /** Updates the instructions (h2) and theme (h3) headings according to the given
     * text parameters
     *
     * @param {String} instructions text to set the h2 heading to
     * @param {String} theme text to set the h3 theme element to
     */
    function updateHeadings(instructions, theme) {

        $(instructionsId).text(instructions);
        $(themeId).text(theme);

    }

    /** Updates the background image based on the selected theme */
    function updateBackground(theme) {
        // Reference to the body element
        var body = document.body;

        // Remove any existing theme classes
        body.classList.remove(
            'math-background',
            'astronomy-background',
            'philosophy-background',
            'mythology-background',
            'purple-background',
            'cats-background'
        );

        // Determine which class to add based on the theme
        switch (theme) {
            case "Math! (please don't run away)":
                body.classList.add('math-background');
                break;
            case "Astronomy and Physics!":
                body.classList.add('astronomy-background');
                break;
            case "Philosophy!":
                body.classList.add('philosophy-background');
                break;
            case "World Mythology :D":
                body.classList.add('mythology-background');
                break;
            case "Shades of Purple!":
                body.classList.add('purple-background');
                break;
            case "The Many Different Flavors of Cat!":
                body.classList.add('cats-background');
                break;
            default:
                // Optionally, set a default background or leave it blank
                break;
        }
    }

    /** Solves the word search puzzle when the solve button is clicked
     *
     * @event WordSearchController#click
     * @param {function} function to execute on mouse click
     */
    $(solveId).click(function() {

        view.solve(game.getWordLocations(), game.getMatrix());

    });

    /** Empties the game and list divs and replaces them with a new setup, modeling
     * a 'refresh' effect when button is clicked
     *
     * @param {function} function to execute on mouse click to generate a new puzzle
     */
    $(newGameId).click(function() {

        // Get selected theme
        var selectedTheme = $("#themeSelect").val();

        // Empties the game and list elements, as well as the h3 theme span element
        $(gameId).empty();
        $(listId).empty();
        $(themeId).empty();

        // Call setUpWordSearch with the selected theme
        setUpWordSearch(selectedTheme);

    });

}
