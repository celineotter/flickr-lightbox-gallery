/*  Image Data Management Methods - Image Manager */

function ImagesManager () {
    this._imageListApi = 'https://api.flickr.com/services/rest';
    this._imageListQueries = [
        'method=flickr.photos.getRecent',
        'api_key=45507b391ae7e46d5e7381223d0a5f9d',
        'format=json',
        'nojsoncallback=1',
        'perpage=20',
        'page='
    ];
    this._imageApi = 'https://api.flickr.com/services/rest';
    this._imageQueries = [
        'method=flickr.photos.getSizes',
        'api_key=ca9cc117bd7f8665090d55a17864a3be',
        'format=json&nojsoncallback=1',
        'photo_id='
    ];
    this.reset();
}

ImagesManager.prototype.reset = function fetchData(api, cb, subject, item) {
    this.page = 1;
    this.viewImages = [];
};

ImagesManager.prototype.fetchData = function fetchData(api, cb, subject, item) {
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
};

ImagesManager.prototype.loadNextPage = function loadNextPage() {
    this.page++;
    this.fetchImageList();
};

ImagesManager.prototype.fetchImageList = function fetchImageList() {
    var api = this._imageListApi + '?' + this._imageListQueries.join('&') + this.page;
    this.fetchData(api, (this.fetchImage.bind(this)), 'photo');
};

ImagesManager.prototype.fetchImage = function fetchImage(newImages) {
    var api = this._imageApi + '?' + this._imageQueries.join('&');
    var uniqueImages = this.rejectDuplicates(newImages);
    uniqueImages.forEach((function(image) {
        this.fetchData(api + image.id, (this.parseSize.bind(this)), 'size', image);
    }).bind(this));
};

ImagesManager.prototype.rejectDuplicates = function rejectDuplicates(newImages) {
    var uniqueImages = [],
        imageIdsHash = {};

    traverseImages(this.viewImages, false);
    traverseImages(newImages, true);

    return uniqueImages;

    function traverseImages(images, logUnique) {
        images.forEach(function (image) {
            if (!imageIdsHash.hasOwnProperty(image.id)) {
                imageIdsHash[image.id] = true;
                if (logUnique) { uniqueImages.push(image); }
            }
        });
    }
};

ImagesManager.prototype.parseSize = function parseSize(sizes, image) {
    var sizeFound = false;
    sizes.forEach((function(resultImage) {
        if (resultImage.label === 'Medium' && !sizeFound) {
            sizeFound = true;
            image.viewId = 'gridImage' + this.viewImages.length;
            image.src = resultImage.source;
            this.viewImages.push(image);

            var el = '<img class="grid-img" id="' + image.viewId + '" src="'+image.src+'" alt="'+image.title+'" onclick="viewManager.openModal(this);"/><figcaption>' + image.title + '</figcaption>';
            this.appendImage(document.getElementById('imageGrid'), el);
        }
    }).bind(this));
};

// viewhelper transfer:

ImagesManager.prototype.appendImage = function appendImage(containerEl, strEl) {
    var $el = document.createElement('figure');
    $el.innerHTML = strEl;
    containerEl.appendChild($el);
};
