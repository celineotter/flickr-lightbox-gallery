/*  Consequent to Direct User Interaction Methods */

function ViewManager() {
    this.modalOpen = false;
    this.selectedImageIdx = null;
}

ViewManager.prototype.clearImageList = function clearImageList() {
    document.getElementById('imageGrid').innerHTML = '';
    imagesManager.reset();
    imagesManager.fetchImageList();
};

ViewManager.prototype.loadMoreImages = function loadMoreImages() {
    imagesManager.loadNextPage();
};

ViewManager.prototype.openModal = function openModal(figure) {
    var modal, modalImg;
    if (this.modalOpen) { return; }

    document.getElementById('fetchLatest').setAttribute('disabled', true);
    document.getElementById('imageGrid').className += "block-events";

    this.selectedImageIdx = this.findIndexMatchingId(figure.id);
    this.checkLightboxArrowValidity();

    this.modalOpen = true;
    modal = document.getElementById('imageModal');
    modal.style.display = 'table';

    modalImg = document.getElementById('imageView');
    modalImg.src = figure.src;
    modalImg.alt = figure.alt;
};

ViewManager.prototype.closeModal = function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.getElementById('imageGrid').className = "";
    document.getElementById('fetchLatest').removeAttribute('disabled');
    this.modalOpen = false;
};

ViewManager.prototype.changeImage = function changeImage(getNext) {
    var currentIdx =  this.selectedImageIdx;
    if (currentIdx === 0 && !getNext) { return; }
    if (currentIdx === imagesManager.viewImages.length - 1 && getNext) { return; }
    this.selectedImageIdx = (getNext ? ++currentIdx : --currentIdx);
    this.checkLightboxArrowValidity();
    var modalImg = document.getElementById('imageView');
    modalImg.src = imagesManager.viewImages[this.selectedImageIdx].src;
    modalImg.alt = imagesManager.viewImages[this.selectedImageIdx].title;
};

ViewManager.prototype.findIndexMatchingId = function findIndexMatchingId(targetId) {
    var found = false, targetIdx;
    imagesManager.viewImages.forEach(function (image, idx) {
        if (image.viewId === targetId & !found) {
            found = true;
            targetIdx = idx;
        }
    });
    return targetIdx;
};

ViewManager.prototype.checkLightboxArrowValidity = function checkLightboxArrowValidity() {
    lightboxArrowVisibility('previousImg', (this.selectedImageIdx !== 0) );
    lightboxArrowVisibility('nextImg', (this.selectedImageIdx !== imagesManager.viewImages.length - 1) );

    function lightboxArrowVisibility(arrowId, show) {
        document.getElementById(arrowId).style.visibility = show ? 'visible' : 'hidden';
    }
};

ViewManager.prototype.keyDownTextField = function keyDownTextField(e) {
    if (!this.modalOpen) { return; }
    if (e.keyCode === 39) {
        this.changeImage(true);
    } else if (e.keyCode === 37) {
        this.changeImage();
    }
};
