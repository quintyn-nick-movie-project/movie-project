import {
    bgRender,
    editMovie,
    getFavorite,
    getMovies,
    renderMovieCard,
    renderFavCard,
    setFavorite,
    setMovies, getPoster
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

        // Get Movies
        let jsonMovies = await getMovies();

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
        const localRate = document.getElementsByName('rate');
        for(let i = 0; i < localRate.length; i++) {
            if(localRate[i].checked) {
                var rating = parseFloat(localRate[i].value);
            }
        }
        getPoster(title, rating)
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

