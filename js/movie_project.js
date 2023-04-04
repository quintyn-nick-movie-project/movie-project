import {
    bgRender,
    editMovie,
    getFavorite,
    getMovies,
    renderMovieCard,
    renderFavCard,
    setFavorite,
    setMovies
} from "./movie_project_functions.js"

bgRender();



(() => {

    let intro = document.getElementById('intro');
    let content = document.getElementById('content');
    let movyGrid = document.getElementById('moviesGrid')
    let favyGrid = document.getElementById('favGrid')

//  GET MOVIES
    window.addEventListener('load', async () => {
        let controlCenter = document.querySelectorAll(".dg");
        controlCenter.forEach(n => n.remove());

        // Get Favorites
        let jsonFav = await getFavorite();
        console.log(jsonFav);

        // Get Movies
        let jsonMovies = await getMovies();
        console.log(jsonMovies);

        // Render Favorites
        const favGrid = document.querySelector('#favGrid');
        jsonFav.forEach(function(jsonFav){
            renderFavCard(jsonFav, favGrid);
        });

        // Render Movies
        const moviesGrid = document.querySelector('#moviesGrid');
        jsonMovies.forEach(function(jsonMovies){
            renderMovieCard(jsonMovies, moviesGrid);
        });
        intro.classList.add('hide')
        content.classList.remove('hide')
    })


//  ADD NEW MOVIE
    document.querySelector('#grade-button').addEventListener('click', async function () {

        const title = document.querySelector('#title').value;

        const genres = document.querySelector('#genre').value;

        const ratings = document.getElementsByName('rate');
        console.log(ratings)

        const poster = 'https://via.placeholder.com/200x300'

        const plot = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid animi architecto earum eius eos esse iste porro ratione rem veniam!"

        for(let i = 0; i < ratings.length; i++) {
            if(ratings[i].checked)
                var rating = parseFloat(ratings[i].value);
        }

        // Documentaion will inform of the neccessary fields to a data send request
        let movieData = {
            title,
            genres,
            rating,
            poster,
            plot
        }

        if (rating === 5) {
            let result =  await setFavorite(movieData)
            let jsonFav = await getFavorite();
            console.log(jsonFav);
            // Render the movies
            const favGrid = document.querySelector('#favGrid');
            jsonFav.forEach(function(jsonFav){
                renderMovieCard(jsonFav, favGrid);
        });
        } else {
            let result =  await setMovies(movieData)
            let jsonMovies = await getMovies();
            console.log(jsonMovies);
            // Render the movies
            const moviesGrid = document.querySelector('#moviesGrid');
            jsonMovies.forEach(function(jsonMovies){
                renderMovieCard(jsonMovies, moviesGrid);
        });
        }

    })

//  REFRESH MOVIES
    document.querySelector('#refresh-grid').addEventListener('click', async() => {
        favyGrid.innerHTML = ''
        movyGrid.innerHTML = ''
        // Get Favorites
        let refFav = await getFavorite();

        // Get Movies
        let refMovies = await getMovies();

        // Render Favorites
        const favGrid = document.querySelector('#favGrid');
        refFav.forEach(function(Fav){
            renderFavCard(Fav, favGrid);
        });

        // Render Movies
        const moviesGrid = document.querySelector('#moviesGrid');
        refMovies.forEach(function(Mov){
            renderMovieCard(Mov, moviesGrid);
        });
    })

})();

