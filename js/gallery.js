"use strict";

var gallery = function () {

    /** @constant {string} */
    var HIDDEN_CLASSNAME = "hidden";

    /** @enum {number} */
    var KeyCode = {
        ESC: 27
    };

    var galleryContainer = document.querySelector(".gallery");
    var closeElement = galleryContainer.querySelector(".gallery-close");
    var preview = galleryContainer.querySelector(".gallery-picture");

    /**
    * @param {Event} evt
    * @return {boolean}
    */
    var isDeactivationEvent = function (evt) {
        return evt.keyCode === KeyCode.ESC;
    };

    var setElementHidden = function (element, hidden) {
        element.classList.toggle(HIDDEN_CLASSNAME, hidden);
    };

    /**
    * @param {KeyboardEvent} evt
    */
    var onCloseClickHandler = function () {
        hideGallery();
    };

    /**
    * @param {KeyboardEvent} evt
    */
    var onDocumentKeydownHandler = function (evt) {
        if (isDeactivationEvent(evt)) {
            evt.preventDefault();
            hideGallery();
        }
    };

    var hideGallery = function () {
        document.body.style.overflowY = "auto";
        setElementHidden(galleryContainer, true);
        document.removeEventListener("keydown", onDocumentKeydownHandler);
        closeElement.removeEventListener("click", onCloseClickHandler);
    };

    var openGallery = function (backgroundImage) {
        document.body.style.overflowY = "hidden";
        preview.style.backgroundImage = backgroundImage;
        setElementHidden(galleryContainer, false);
        document.addEventListener("keydown", onDocumentKeydownHandler);
        closeElement.addEventListener("click", onCloseClickHandler);
    };

    window.gallery = {
        openGallery: openGallery
    };

};

gallery();