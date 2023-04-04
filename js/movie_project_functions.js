import dat from "https://cdn.skypack.dev/dat.gui@0.7.7";

"use strict";

// RENDER UNIQUE BACKGROUND ON LOAD
export function bgRender () {

    const gui = new dat.GUI();

    const generator = (seedNum) => {
        return Math.random() * seedNum
    }
//change me
    let seed= generator(1000);
//change me

    let count = 0;
    let canvas = document.getElementById("c");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let centerw = w / 2, centerh = h / 2;
    let ctx = canvas.getContext("2d");
    let currblendmode = "color-dodge";
    let bgColor = "rgb(26,22,46)";
    let showDots = false;
    let guiInit = false;
    let colorArr=[
        // center
        "rgba(152,149,142,0.02)",
        // reds
        "rgba(255,0,30, 0.0123)",
        // greens
        "rgba(33,228,52, 0.008)",
        // violet
        "rgba(99,43,225, 0.006)",
        // blue
        "rgba(00,69,64, 0.006)"
    ]
    let currColor = bgColor;
    let blobsArr = [];
    let init = () => {
        //console.log("init")
        ctx.baseColor = currColor;
        ctx.globalCompositeOperation = currblendmode;
        ctx.fillStyle = ctx.baseColor;
        ctx.fillRect(0, 0, w, h);
        initBlobs();
    }

    let initBlobs = () => {
        //
        for (let i = 0; i < colorArr.length; i++) {
            blobsArr.push(new Blob(colorArr[i]));
        }
        drawBlobs();
    }

    let drawBlobs = () => {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = ctx.baseColor;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        for (let i = 0; i < colorArr.length; i++) {
            let _newBlob = blobsArr[i];

            for (let j = 0; j < 20; j++) {

                for (let k = 0; k < 3; k++) {
                    _newBlob.generateLayer(k);
                }
                for (let s in _newBlob.shapes) {
                    _newBlob.drawShape(_newBlob.shapes[s]);
                }

            }
            if(showDots == true){
                utils.showDots(_newBlob.subDividedBaseShapeArray);
            }
        }

    }



//
    class Blob {
        constructor(color) {
            this.subdivisions = 0;
            this.subDividedBaseShapeArray = [];
            this.color = color;
            this.shapes = { shapeArr_0: [] };
            this.initStartingPoints();
            this.initBaseShape();
        }

        createNewPoint(p1, p2, iter){
            let midX = (p1.x + p2.x) / 2;
            let midY = (p1.y + p2.y) / 2;
            let rnd = utils.getRandom()*53;

            let ang = rnd * (2 * Math.PI);
            let x = midX + rnd * Math.cos(ang);
            let y = midY + rnd * Math.sin(ang);
            return {x:x, y:y}
        };

        initStartingPoints(){
            let num_pts = 8;
            let ang = 0;
            let rad = w * 0.5;
            let step = (2 * Math.PI) / num_pts;
            for (let i = 0; i < num_pts; i++) {
                let _x = centerw + Math.cos(ang) * rad * utils.getRandom();
                let _y = centerh + Math.sin(ang) * rad;
                ang += step;
                this.shapes.shapeArr_0.push({ x: _x, y: _y });
            }
        }

        generateLayer = (pos) =>{
            //console.log("generate")
            let tmparr = this.subDividedBaseShapeArray.slice();
            for (let i = 0; i < 3; i++) {
                tmparr = this.subDivide(tmparr);
            }
            this.shapes["shapeArr_" + pos] = tmparr.slice();
        }

        initBaseShape(){

            let iterations = 4; //careful! this is subdivision so the number of points increase exponentially! going higher will freeze your computer! Keep it under 5 or so!
            for (let i = 0; i < iterations; i++) {
                this.subdivisions++;
                this.shapes["shapeArr_" + this.subdivisions] = this.subDivide(this.shapes["shapeArr_" + i],i);
            }
            this.subDividedBaseShapeArray = this.shapes["shapeArr_" + this.subdivisions].slice();
            // console.log(this.subDividedBaseShapeArray.length)
            this.shapes = {};
        }

        subDivide(arr) {
            let tmparr = arr.slice();
            let newArr = [];

            //*|* first one!
            newArr.push({x:centerw,y:centerh});
            for (let i = 1; i < tmparr.length; i++) {
                //*|* main loop
                let newPt = this.createNewPoint(tmparr[i], tmparr[i - 1]);
                //push new point, then push older existing point
                newArr.push(newPt);
                newArr.push(arr[i]);
            }
            //*|* last one! Wrap back to connect to the first point at the end of the loop
            let newPt = this.createNewPoint(arr[arr.length - 1], arr[0], 1);
            newArr.push(newPt);
            //
            return newArr;
        }

        drawShape = (_arr) => {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(_arr[0].x, _arr[0].y);
            for (let i = 1; i < _arr.length; i++) {
                let itm = _arr[i];
                ctx.lineTo(itm.x, itm.y);
            }
            ctx.fill();
        }
    }

    class Utils {
        constructor() {
            this.blendModeArr = ["source-over","source-in","source-out","source-atop","destination-over","destination-in","destination-out","destination-atop","lighter","copy","xor","multiply","screen","overlay","darken","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"];
        }


        newRand = () => {
            return (seed = (seed * 16807) % 2147483647);
        }

        getRandom = () => {
            return (this.newRand() - 1) / 2147483646;
        }

        showDots = (arr) => {
            let clr = "white";
            ctx.save();
            arr.forEach(function (e, i) {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = clr;
                ctx.beginPath();
                ctx.arc(e.x, e.y, 2, 0, Math.PI * 2);
                ctx.stroke();
            });
            ctx.restore();
        };
    }

    let utils = new Utils();
    window.onload = () => {
        init();
    };

}

// GET MOVIES
export const getFavorite = async () => {
        try {
        let url = 'http://localhost:3000/favorites';
        let response = await fetch(url);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}

export const getMovies = async () => {
        try {
        let url = 'http://localhost:3000/movies';
        let response = await fetch(url);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}

// SET MOVIES
export const setFavorite = async (movie) => {
    try {
        let url = 'http://localhost:3000/favorites';
        let options = {
            // GET IS DEFAULT, No key required
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie),

        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}
export const setMovies = async (movie) => {
    try {
        let url = 'http://localhost:3000/movies';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie),
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}

// REMOVE MOVIE
export const removeMovie = async (movieID) => {
    try {
        let url = `http://localhost:3000/movies/${movieID}`;
        let options = {
            method: 'DELETE'
        }
        let response = await fetch(url, options);
        console.log(`MOVIE DELETE: ${response}`);
        // let data = await response.json();
        // return data
    } catch(error) {
        console.log(error)
    }
}

// EDIT MOVIE
export const editFavMovie = async (movie) => {
    try {
        let url = `http://localhost:3000/favorites/${movie.id}`;
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie),
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}
export const editMovie = async (movie) => {
    try {
        let url = `http://localhost:3000/movies/${movie.id}`;
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie),
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data
    } catch(error) {
        console.log(error)
    }
}

const preCheck = (filmRate, starVal) => {
    if (filmRate === starVal) {
        return 'checked'
    } else {
        return ''
    }
}

const preGenre = (filmGenre, dropValue) => {
    if (filmGenre[0] == 'Science Fiction') {
        return 'selected'
    }
    else if (filmGenre[0] === dropValue) {
        return 'selected'
    } else {
        return ''
    }
}


const getPoster = (title) => {
    $('#term').focus(function(){
        var full = $("#poster").has("img").length ? true : false;
        if(full == false){
            $('#poster').empty();
        }
    });

    var getPoster = function(){

        var film = $('#term').val();

        if(film == ''){

            $('#poster').html('<div class="alert"><strong>Oops!</strong> Try adding something into the search field.</div>');

        } else {

            $('#poster').html('<div class="alert"><strong>Loading...</strong></div>');

            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?", function(json) {
                if (json != "Nothing found."){
                    console.log(json);
                    $('#poster').html('<p>Your search found: <strong>' + json.results[0].title + '</strong></p><img src=\"http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '\" class=\"img-responsive\" >');
                } else {
                    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=goonies&callback=?", function(json) {

                        console.log(json);
                        $('#poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><p>Perhaps you were looking for The Goonies?</p><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json[0].poster_path + ' class="img-responsive" />');
                    });
                }
            });

        }

        return false;
    }

    $('#search').click(getPoster);
    $('#term').keyup(function(event){
        if(event.keyCode == 13){
            getPoster();
        }
    });

}


// RENDER HTML
export const renderMovieCard = (film, parent) => {
    const star = ' ★ '
    const element = document.createElement('div');
    element.classList.add('movie-card');
    element.innerHTML = `
        <div class="editor column align-center justify-space-between hide">
            <label for="edt-title"> Title
            <input id="edt-title-${film.id}" type="text" placeholder="${film.title}">
            </label>
            <label for="edt-genre">  Genre
            <select id="edt-genre-${film.id}">
                <option value="Comedy" ${preGenre(film.genres, 'Comedy' )}> Comedy </option>
                <option value="Fantasy" ${preGenre(film.genres, 'Fantasy' )}> Fantasy </option>
                <option value="Crime" ${preGenre(film.genres, 'Crime' )}> Crime </option>
                <option value="Drama" ${preGenre(film.genres, 'Drama' )}> Drama </option>
                <option value="Music" ${preGenre(film.genres, 'Music' )}> Music </option>
                <option value="Adventure" ${preGenre(film.genres, 'Adventure' )}> Adventure </option>
                <option value="History" ${preGenre(film.genres, 'History' )}> History </option>
                <option value="Thriller" ${preGenre(film.genres, 'Thriller' )}> Thriller </option>
                <option value="Animation" ${preGenre(film.genres, 'Animation' )}> Animation </option>
                <option value="Family" ${preGenre(film.genres, 'Family' )}> Family </option>
                <option value="Mystery" ${preGenre(film.genres, 'Mystery' )}> Mystery </option>
                <option value="Biography" ${preGenre(film.genres, 'Biography' )}> Biography </option>
                <option value="Action" ${preGenre(film.genres, 'Action' )}> Action </option>
                <option value="Romance" ${preGenre(film.genres, 'Romance' )}> Romance </option>              
                <option value="War" ${preGenre(film.genres, 'War' )}> War </option>
                <option value="Western" ${preGenre(film.genres, 'Western' )}> Western </option>
                <option value="Horror" ${preGenre(film.genres, 'Horror' )}> Horror </option>
                <option value="Musical" ${preGenre(film.genres, 'Musical' )}> Musical </option>
                <option value="Sci-Fi" ${preGenre(film.genres, "Sci-Fi" )}> Sci-Fi </option>
            </select>
            </label>
            <div class="rating" id="edt-rating-${film.id}">
                <input type="radio" id="star5-${film.id}" name="edt-rate-${film.id}" value="5" ${preCheck(film.rating, 5)}/>
                <label for="star5-${film.id}">5</label>
                <input type="radio" id="star4-${film.id}" name="edt-rate-${film.id}" value="4" ${preCheck(film.rating, 4)}/>
                <label for="star4-${film.id}">4</label>
                <input type="radio" id="star3-${film.id}" name="edt-rate-${film.id}" value="3" ${preCheck(film.rating, 3)}/>
                <label for="star3-${film.id}">3</label>
                <input type="radio" id="star2-${film.id}" name="edt-rate-${film.id}" value="2" ${preCheck(film.rating, 2)}/>
                <label for="star2-${film.id}">2</label>
                <input type="radio" id="star1-${film.id}" name="edt-rate-${film.id}" value="1" ${preCheck(film.rating, 1)}/>
                <label for="star1-${film.id}"></label>
            </div>
            <label for="edt-plot">Plot</label>
            <input id="edt-plot-${film.id}" type="text" placeholder="${film.plot}">
            <label for="edt-poster">Poster</label>
            <input id="edt-poster-${film.id}" type="url" placeholder="${film.poster}">
            
            <button class="edt-submit-button">EDIT</button>
        </div>
        <div class="img-wrapper">
            <img class="film-poster" src="${film.poster}" alt="movie-image">          
        </div>
        <div class="film-info">
            <div class="film-rating">${star.repeat(film.rating)}</div>
            <h2 class="film-title">${film.title}</h2>
            <p class="genres">${film.genres}</p>
        </div>
        <p class="message hide"> Film Plot: ${film.plot}</p>
        <button class="rmv-button button-64" role="button">X</button>
        <button class="edt-button button-64" role="button">EDIT</button>
    `;

    element.querySelector('.img-wrapper').addEventListener('click', function(){
        element.querySelector('.message').classList.toggle('hide');
    });
    element.querySelector('.rmv-button').addEventListener('click', function(){
        element.remove();
        removeMovie(film.id);
    });

    //  EDIT MOVIE
    element.querySelector('.edt-button').addEventListener('click', async function () {
        element.querySelector('.editor').classList.toggle('hide');
        element.querySelector('.edt-submit-button').addEventListener('click', async function() {
            element.querySelector('.editor').classList.toggle('hide');

            const titleEDT = element.querySelector(`#edt-title-${film.id}`).value;
            console.log(titleEDT)

            const genresEDT = element.querySelector(`#edt-genre-${film.id}`).value;
            console.log(genresEDT)

            const ratingsEDT = document.getElementsByName(`edt-rate-${film.id}`);
            console.log(ratingsEDT)

            const posterEDT = element.querySelector(`#edt-poster-${film.id}`).value;
            console.log(posterEDT)

            const plotEDT = element.querySelector(`#edt-plot-${film.id}`).value;
            console.log(plotEDT)

            for(let i = 0; i < ratingsEDT.length; i++) {
                if(ratingsEDT[i].checked)
                    var ratingEDT = parseFloat(ratingsEDT[i].value);
            }

            // Documentaion will inform of the neccessary fields to a data send request
            let movieData = {
                id: film.id,
                title: titleEDT,
                genres: genresEDT,
                rating: ratingEDT,
                poster: posterEDT,
                plot: plotEDT
            }

            if (ratingEDT === 5) {
                let result =  await editFavMovie(movieData)
                let jsonFav = await getFavorite();
                console.log(jsonFav);
                // Render the movies
                const favGrid = document.querySelector('#favGrid');
                jsonFav.forEach(function(jsonFav){
                    renderMovieCard(jsonFav, favGrid);
                });
            } else {
                let result =  await editMovie(movieData)
                let jsonMovies = await getMovies();
                console.log(jsonMovies);
                // Render the movies
                const moviesGrid = document.querySelector('#moviesGrid');
                jsonMovies.forEach(function(jsonMovies){
                    renderMovieCard(jsonMovies, moviesGrid);
                });
            }
        })
    })

    parent.appendChild(element);
}

export const renderFavCard = (film, parent) => {
    const star = ' ★ '
    const element = document.createElement('div');
    element.classList.add('movie-card');
    element.innerHTML = `
        <div class="editor column align-center justify-space-between hide">
            <label for="edt-title"> Title</label>
            <input id="edt-title-${film.id}" type="text" placeholder="${film.title}">
            <label for="edt-genre">  Genre</label>
            <select id="edt-genre-${film.id}">
                 <option value="Comedy" ${preGenre(film.genres, 'Comedy' )}> Comedy </option>
                <option value="Fantasy" ${preGenre(film.genres, 'Fantasy' )}> Fantasy </option>
                <option value="Crime" ${preGenre(film.genres, 'Crime' )}> Crime </option>
                <option value="Drama" ${preGenre(film.genres, 'Drama' )}> Drama </option>
                <option value="Music" ${preGenre(film.genres, 'Music' )}> Music </option>
                <option value="Adventure" ${preGenre(film.genres, 'Adventure' )}> Adventure </option>
                <option value="History" ${preGenre(film.genres, 'History' )}> History </option>
                <option value="Thriller" ${preGenre(film.genres, 'Thriller' )}> Thriller </option>
                <option value="Animation" ${preGenre(film.genres, 'Animation' )}> Animation </option>
                <option value="Family" ${preGenre(film.genres, 'Family' )}> Family </option>
                <option value="Mystery" ${preGenre(film.genres, 'Mystery' )}> Mystery </option>
                <option value="Biography" ${preGenre(film.genres, 'Biography' )}> Biography </option>
                <option value="Action" ${preGenre(film.genres, 'Action' )}> Action </option>
                <option value="Romance" ${preGenre(film.genres, 'Romance' )}> Romance </option>
                <option value="War" ${preGenre(film.genres, 'War' )}> War </option>
                <option value="Western" ${preGenre(film.genres, 'Western' )}> Western </option>
                <option value="Musical" ${preGenre(film.genres, 'Musical' )}> Musical </option>
                <option value="Horror" ${preGenre(film.genres, 'Horror' )}> Horror </option>
                 <option value="Sci-Fi" ${preGenre(film.genres, "Sci-Fi" )}> Sci-Fi </option>
                
            </select>
            <span>Grade</span>
            <div class="rating" id="edt-fav-rating-${film.id}">
                <input type="radio" id="star5-fav-${film.id}" name="edt-fav-rate-${film.id}" value="5" ${preCheck(film.rating, 5)}/>
                <label for="star5-fav-${film.id}">5</label>
                <input type="radio" id="star4-fav-${film.id}" name="edt-fav-rate-${film.id}" value="4" ${preCheck(film.rating, 4)}/>
                <label for="star4-fav-${film.id}">4</label>
                <input type="radio" id="star3-fav-${film.id}" name="edt-fav-rate-${film.id}" value="3" ${preCheck(film.rating, 3)}/>
                <label for="star3-fav-${film.id}">3</label>
                <input type="radio" id="star2-fav-${film.id}" name="edt-fav-rate-${film.id}" value="2" ${preCheck(film.rating, 2)}/>
                <label for="star2-fav-${film.id}">2</label>
                <input type="radio" id="star1-fav-${film.id}" name="edt-fav-rate-${film.id}" value="1" ${preCheck(film.rating, 1)}/>
                <label for="star1-fav-${film.id}"></label>
            </div>
            <label for="edt-plot">Plot</label>
            <input id="edt-plot-${film.id}" type="text" placeholder="${film.plot}">
            <label for="edt-poster">Poster</label>
            <input id="edt-poster-${film.id}" type="url" placeholder="${film.poster}">
            
            <button class="edt-submit-button">EDIT</button>
        </div>
        <div class="img-wrapper">
            <img class="film-poster" src="${film.poster}" alt="movie-image">          
        </div>
        <div class="film-info">
            <div class="film-rating">${star.repeat(film.rating)}</div>
            <h2 class="film-title">${film.title}</h2>
            <p class="genres">${film.genres}</p>
        </div>
            <p class="message hide"> Film Plot: ${film.plot}</p>
        <button class="rmv-button button-64" role="button">X</button>
        <button class="edt-button button-64" role="button">EDIT</button>
    `;

    element.querySelector('.img-wrapper').addEventListener('click', function(){
        element.querySelector('.message').classList.toggle('hide');
    });
    element.querySelector('.rmv-button').addEventListener('click', function(){
        element.remove();
        removeMovie(film.id);
    });

    //  EDIT MOVIE
    element.querySelector('.edt-button').addEventListener('click', async function () {
        element.querySelector('.editor').classList.toggle('hide');
        element.querySelector('.edt-submit-button').addEventListener('click', async function() {
            element.querySelector('.editor').classList.toggle('hide');

            const titleFavEDT = element.querySelector(`#edt-title-${film.id}`).value;

            const genresFavEDT = element.querySelector(`#edt-genre-${film.id}`).value;

            const ratingsFavEDT = document.getElementsByName(`edt-fav-rate-${film.id}`);

            const posterFavEDT = element.querySelector(`#edt-poster-${film.id}`).value;

            const plotFavEDT = element.querySelector(`#edt-plot-${film.id}`).value;

            for(let i = 0; i < ratingsFavEDT.length; i++) {
                if(ratingsFavEDT[i].checked)
                    var ratingFavEDT = parseFloat(ratingsFavEDT[i].value);
            }

            // Documentaion will inform of the neccessary fields to a data send request
            let movieData = {
                id: film.id,
                title: titleFavEDT,
                genres: genresFavEDT,
                rating: ratingFavEDT,
                poster: posterFavEDT,
                plot: plotFavEDT
            }
            console.log(movieData)

                let result =  await editFavMovie(movieData)
                let jsonFav = await getFavorite();



        })
    })


    parent.appendChild(element);
}