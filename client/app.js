/*  Doc Init  */

var imagesManager,
    viewManager;

document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        initApplication();
    }
};

function initApplication() {
    imagesManager = new ImagesManager();
    viewManager = new ViewManager();

    document.getElementById('fetchLatest').addEventListener('click', viewManager.clearImageList.bind(viewManager));
    document.getElementById('loadMore').addEventListener('click', viewManager.loadMoreImages);
    document.getElementById('close').addEventListener('click', viewManager.closeModal.bind(viewManager));
    document.getElementById('nextImg').addEventListener('click', function () { viewManager.changeImage(true); });
    document.getElementById('previousImg').addEventListener('click', function () { viewManager.changeImage(false); });
    document.addEventListener('keydown', viewManager.keyDownTextField.bind(viewManager), false);

    imagesManager.fetchImageList();
}
