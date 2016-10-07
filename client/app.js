// TODO: Make stack + current indx
// TODO: Filter Duplicates
// TODO: add title to popup
// TODO: Make propotype
// TODO: clean css
// TODO: add autoscroll to current position on close
// TODO: github + deploy
// TODO: tests


var PHOTO_LIST_API = 'https://api.flickr.com/services/rest',
    PHOTO_LIST_QUERIES = [
        'method=flickr.photos.getRecent',
        'api_key=45507b391ae7e46d5e7381223d0a5f9d',
        'format=json',
        'nojsoncallback=1',
        'per_page=20',
        'page='
    ],

    PHOTO_API = 'https://api.flickr.com/services/rest',
    PHOTO_QUERIES = [
        'method=flickr.photos.getSizes',
        'api_key=ca9cc117bd7f8665090d55a17864a3be',
        'format=json&nojsoncallback=1',
        'photo_id='

    ],
    modalOpen = false,
    page = 1,
    selectedImageId = null,
    imageCount = 0,
    dataList = [];

/* DOC INIT */
document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        initApplication();
        clearPhotoList();
    }
};
// HELPER_SERVICE#
function initApplication() {
    document.getElementById('fetchLatest').addEventListener('click', clearPhotoList);
    document.getElementById('loadMore').addEventListener('click', loadMorePhotos);
    document.getElementById('close').addEventListener('click', closeModal);
    document.getElementById('nextImg').addEventListener('click', function () { changeImage(true); });
    document.getElementById('previousImg').addEventListener('click', function () { changeImage(); });
    document.addEventListener('keydown', keyDownTextField, false);
}

// DATA#
function fetchData(api, cb, subject, item) {
    var xhttp = new XMLHttpRequest(),
        result;

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.response);
            if (result.hasOwnProperty(subject + 's')) {
                cb(result[subject + 's'][subject], item);
            }
        }
    };

    xhttp.open('GET', api, true);
    xhttp.send();
}

// HELPER_SERVICE#
function clearPhotoList() {
    imageCount = 0;
    page = 1;
    document.getElementById('imageGrid').innerHTML = '';
    fetchPhotoList();
}
// VIEW_SERVICE#
function loadMorePhotos() {
    page++;
    fetchPhotoList();
}
// DATA#
function fetchPhotoList() {
    var api = PHOTO_LIST_API + '?' + PHOTO_LIST_QUERIES.join('&') + page;
    fetchData(api, fetchPhoto, 'photo');
}
// DATA#
function fetchPhoto(photos) {
    var api = PHOTO_API + '?' + PHOTO_QUERIES.join('&');
    // create dictionary of photos
    // checkDuplicate
    photos.forEach(function(photo) {
        fetchData(api + photo.id, parseSize, 'size', photo);
    });
}
// DATA#
function parseSize(sizes, photo) {
    sizes.forEach(function(resultImage) {
        if (resultImage.label === 'Medium') {
            // push to stack
            dataList.push(photo);

            var el = '<img class="grid-img" id="gridImage' + imageCount++ + '" src="'+resultImage.source+'" onclick="openModal(this);"/><figcaption>' + photo.title + '</figcaption>';
            appendImage(document.getElementById('imageGrid'), el);
        }
    });
}
// DATA#
function appendImage(containerEl, strEl) {
    var $el = document.createElement('figure');
    $el.innerHTML = strEl;
    containerEl.appendChild($el);
}
// VIEW_SERVICE#
function openModal(figure) {
    var modal, modalImg;
    if (modalOpen) { return; }
    document.getElementById('fetchLatest').setAttribute('disabled', true);
    document.getElementById('imageGrid').className += " block-events";
    selectedImageId = figure.id;
    modalOpen = true;
    modal = document.getElementById('imageModal');
    modal.style.display = 'table';

    modalImg = document.getElementById('imageView');
    modalImg.src = figure.src;
    modalImg.alt = figure.alt;
}
// HELPER_SERVICE#
function changeImage(forward) {
    var currentIdx =  selectedImageId.slice(9);
    if (currentIdx === '0' && !forward) { return; }
    if (currentIdx === String((20 * page) - 1) && forward) { return; }
    newIdxId = 'gridImage' + (forward ? ++currentIdx : --currentIdx);
    var thumbnailImg = document.getElementById(newIdxId);
    var modalImg = document.getElementById('imageView');
    modalImg.src = thumbnailImg.src;
    modalImg.alt = thumbnailImg.alt;
    selectedImageId = newIdxId;
}
// HELPER_SERVICE#
function keyDownTextField (e) {
    if (!modalOpen) { return; }
    if (e.keyCode === 39) {
        changeImage(true);
    } else if (e.keyCode === 37) {
        changeImage();
    }
}
// VIEW_SERVICE#
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.getElementById('imageGrid').className = "";
    document.getElementById('fetchLatest').removeAttribute('disabled');
    modalOpen = false;
}
