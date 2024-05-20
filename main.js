const chartSize = document.getElementById('chart-size')
const chartTitle = document.getElementById('chart-title')

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var albums = [];
var imgSize = 128;
var cw = window.innerWidth/2
var padding = 50;

function titles() {
    var x = cw + padding, y = padding;

    ctx.font = "600 14px 'Roboto Mono'"
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';

    // ctx.setTransform(1,0,0,1,canvas.width + padding,padding)
    for (var i = 0; i < albums.length; i++) {
        ctx.fillText(albums[i].artist.name + " - " + albums[i].title, x, y + 15)
        y += 15;

        if ((i+1) % chartSize.value == 0) {
            y += 20;
        }
    }
}

function grid() {
    var x = padding, y = padding;
    // ctx.setTransform(1,0,0,1,0,0)
    for (var i = 0; i < albums.length; i++) {
        var img = new Image();
        img.onload = (function(x, y) {
            return function() {
                // draw the image
                ctx.drawImage(this, x, y, imgSize, imgSize);
            }
        })(x, y);
        img.src = albums[i].cover_medium;
        x += imgSize;
        if (x + imgSize > cw - padding) {
            x = padding;
            y += imgSize; 
        }
        if (y + padding > canvas.height) {
            return;
        }
    }
}

function header() {
    ctx.font = "600 18px 'Roboto Mono'"
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(chartTitle.value, cw, 20)
}

function search(q) {
    const script = document.createElement('script')
    const fn = `callback_${Date.now()}`;
    
    window[fn] = (result) => {
        onSearchSuccess(result.data);
        
        // Cleanup
        delete window[fn];
        document.body.removeChild(script);
        // document.getElementById('search').value = ''
    };
  
    script.src = `https://api.deezer.com/search/album?q=${encodeURI(q)}&output=jsonp&callback=${fn}`;
    document.body.appendChild(script);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw()
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

function onSearchSuccess(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    results.forEach(result => {
        const btn = document.createElement('button');
        btn.textContent = "Add to Chart";
        btn.addEventListener('click', () => addToCollage(result));

        const itemDiv = document.createElement('div');
        itemDiv.append(btn);
        itemDiv.append(" | " + result.artist.name + " - " + result.title);

        resultsDiv.append(itemDiv);
    });
}


function searchAlbum() {
    const q = document.getElementById('search').value;
    search(q);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    grid();
    titles();
    header();
}

function addToCollage(album) {
    // const collage = document.getElementById('collage');
    // const img = document.createElement('img');
    // img.src = album.cover;
    // img.alt = "Cover of " + album.title + " by " + album.artist.name;
    // collage.append(img);
    albums.push(album)
    draw()
}