"use strict";

var imageView = function () {

    /** @constant {number} */
    var PAGE_SIZE = 20;

    /** @constant {string} */
    var ACTIVE_FILTER_CLASSNAME = "current-filter";

    /** @constant {string} */
    var API = "https://unsplash.it";

    /** @enum {number} */
    var FILTER_TYPES = {
        SIZE: 0,
        AUTHOR: 1
    };

    /** @enum {Object} */
    var SIZE_FILTER = {
        LARGE: {
            moreThan: 1500,
            lessThan: 9999
        },
        MEDIUM: {
            moreThan: 800,
            lessThan: 1500
        },
        SMALL: {
            moreThan: 0,
            lessThan: 800
        }
    };

    /**
    * Текущий тип фильтра (по размеру или по автору). Используется для фильтрации.
    * @type  @enum {number}
    */
    var filterType = FILTER_TYPES.SIZE;

    /**
    * Текущий фильтр (размер или автор). Используется для фильтрации.
    * @type {Object | string}
    */
    var currentFilter = SIZE_FILTER.LARGE;


    /**
    * Изначальный список загруженных изображений. Используется для фильтрации.
    * @type {Array.<Object>}
    */
    var images = [];

    /**
    * Cписок текущих авторов для загруженных изображений. Используется для фильтрации.
    * @type {Array.<Object>}
    */
    var authors = [];

    /**
    * Текущее состояние списка изображений, учитывающее примененный фильтр.
    * Используется для отрисовки.
    * @type {Array.<Object>}
    */
    var filteredImages = [];

    /** @type {number} */
    var pageNumber = 0;

    /**
    * ссылка по нажатию на которую нас должно перевести на следующую страницу
    * @type {HTMLElement}
    */
    var nextPageLink = document.getElementById("next-page");

    /**
    * ссылка по нажатию на которую нас должно перевести на предыдущую страницу
    * @type {HTMLElement}
    */
    var prevPageLink = document.getElementById("prev-page");

    /**
    * элемент для отображения текущей страницы
    * @type {HTMLElement}
    */
    var currentPageCounter = document.getElementById("current-page");

    /**
    * элементы раздела фильтра Size, нужны чтобы повесить на них обработчик нажатия
    * @type {Array.<HTMLElement>}
    */
    var sizesLi = document.querySelectorAll("#sizes li");


    var resetPreviousFilterClass = function () {

        var sizeLi = document.querySelectorAll("#sizes li");
        sizeLi.forEach(function (size) {
            size.classList.remove(ACTIVE_FILTER_CLASSNAME);
        });

        var authorsLi = document.querySelectorAll("#authors li");
        authorsLi.forEach(function (author) {
            author.classList.remove(ACTIVE_FILTER_CLASSNAME);
        });
    };

    var filter = function () {

        if (filterType === FILTER_TYPES.SIZE) {

            filteredImages = images.filter(function (image) {
                return image.width >= currentFilter.moreThan && image.width < currentFilter.lessThan;
            });

            return;

        }

        filteredImages = images.filter(function (image) {
            return image.author === currentFilter;
        });

    };

    var renderImages = function () {

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;

        var imagesContainer = document.getElementById("images");
        imagesContainer.innerHTML = "";

        filteredImages.slice(from, to).forEach(function (image) {

            var li = document.createElement("li");
            li.style.backgroundImage = "url(" + API + "/300/200/?image=" + image.id + ")";

            li.setAttribute("data-id", image.id);

            imagesContainer.appendChild(li);
        });

        var pictures = document.querySelectorAll("#images li");

        pictures.forEach(function (picture) {
            picture.onclick = function () {
                var backgroundImage = "url(" + API + "/1600/1067/?image=" + picture.getAttribute("data-id") + ")";
                window.gallery.openGallery(backgroundImage);
            };
        });

    };

    /**
    * @param {string}
    */
    var authorFilterWasSelected = function (author) {
        filterType = FILTER_TYPES.AUTHOR;
        currentFilter = author;
        resetPreviousFilterClass();
        this.classList.add(ACTIVE_FILTER_CLASSNAME);
        filter();
        renderImages();
    };

    /**
    * @param {string}
    */
    var sizeFilterWasSelected = function (size) {
        filterType = FILTER_TYPES.SIZE;
        currentFilter = SIZE_FILTER[size];
        resetPreviousFilterClass();
        this.classList.add(ACTIVE_FILTER_CLASSNAME);
        filter();
        renderImages();
    };

    prevPageLink.onclick = function () {

        if (pageNumber > 0) {
            pageNumber = pageNumber - 1;
            currentPageCounter.innerHTML = pageNumber + 1;
            renderImages();
        }
    };

    nextPageLink.onclick = function () {

        pageNumber = pageNumber + 1;
        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;

        if (filteredImages.slice(from, to).length === 0) {
            pageNumber = pageNumber - 1;
            return;
        }

        currentPageCounter.innerHTML = pageNumber + 1;
        renderImages();
    };

    /**
    * @param {Object}
    */
    var ajaxRequest = function (options) {

        var url = options.url || "/";
        var method = options.method || "GET";
        var callback = options.callback || function () {};
        var data = options.data || {};
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(data));

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
                callback(xmlHttp.responseText);
            }
        };

    };

    var renderAuthors = function () {

        var authorsContainer = document.getElementById("authors");

        authorsContainer.innerHTML = "";

        authors.forEach(function (author) {
            var li = document.createElement("li");
            li.innerHTML = author;
            li.onclick = authorFilterWasSelected.bind(li, author);
            authorsContainer.appendChild(li);
        });
    };

    /**
    * @param {Object}
    */
    var receivedImages = function (imgs) {

        images = JSON.parse(imgs);

        images.forEach(function (image) {
            if (authors.indexOf(image.author) === -1) {
                authors.push(image.author);
            }
        });

        filter();
        renderImages();
        renderAuthors();
    };

    var loadImages = function () {
        ajaxRequest({
            url: API + "/list",
            method: "GET",
            callback: receivedImages
        });
    };

    sizesLi.forEach(function (size) {
        size.onclick = sizeFilterWasSelected.bind(size, size.innerHTML.toUpperCase());
    });

    loadImages();

};

imageView();