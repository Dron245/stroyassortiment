(() => {
    "use strict";
    const modules_flsModules = {};
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                lockPaddingElements.forEach(lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                });
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach(lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            });
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            });
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach(mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach(spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                });
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach(spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
                                spollerBlock.open = false;
                            }, spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach(spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout(() => {
                                spollerCloseBlock.open = false;
                            }, spollerSpeed);
                        }
                    });
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout(() => {
                        spollerActiveBlock.open = false;
                    }, spollerSpeed);
                }
            }
        }
    }
    function functions_FLS(message) {
        setTimeout(() => {
            if (window.FLS) console.log(message);
        }, 0);
    }
    function uniqArray(array) {
        return array.filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter(function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        });
        if (media.length) {
            const breakpointsArray = [];
            media.forEach(item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });
            let mdQueries = breakpointsArray.map(function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach(breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter(function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    });
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                });
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: [ "popup_show", "popup_opened" ],
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заполнен атрибут в ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    const clsTokens = this._getClassTokens(this.options.classes.popupActive);
                    if (clsTokens.length) this.targetOpen.element.classList.add(...clsTokens);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout(() => {
                        this._focusTrap();
                    }, 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ей, такого попа нет. Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            if (this.previousOpen && this.previousOpen.element) {
                const clsTokens = this._getClassTokens(this.options.classes.popupActive);
                if (clsTokens.length) this.previousOpen.element.classList.remove(...clsTokens);
            }
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout(() => {
                this._focusTrap();
            }, 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getClassTokens(classConfig) {
            if (!classConfig) return [];
            if (Array.isArray(classConfig)) return classConfig;
            return String(classConfig).split(/\s+/).filter(Boolean);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", function(e) {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);
    let cols = document.querySelectorAll(".compare__col");
    let start = 0;
    const VISIBLE = 4;
    const COL_WIDTH = 302;
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    function update() {
        const colsContainer = document.querySelector(".compare__cols");
        const btnPrev = document.querySelector(".compare__btn_prev");
        const btnNext = document.querySelector(".compare__btn_next");
        if (!colsContainer) return;
        const handleResize = debounce(update, 200);
        window.addEventListener("resize", handleResize);
        const total = cols.length;
        const offset = -start * COL_WIDTH;
        colsContainer.style.transform = `translateX(${offset}px)`;
        btnPrev.disabled = start === 0;
        btnNext.disabled = start >= total - VISIBLE;
    }
    function next() {
        if (start < cols.length - VISIBLE) {
            start++;
            update();
        }
    }
    function prev() {
        if (start > 0) {
            start--;
            update();
        }
    }
    function removeColumn(target) {
        const col = target.closest(".compare__col");
        if (!col) return;
        col.remove();
        cols = document.querySelectorAll(".compare__col");
        if (start > cols.length - VISIBLE) start = Math.max(0, cols.length - VISIBLE);
        update();
    }
    function applyMobileFeatures() {
        const isMobile = window.innerWidth <= 768;
        const fixedCol = document.querySelector(".compare__col_fixed");
        const scrollCols = document.querySelectorAll(".compare__scroll .compare__col");
        if (!fixedCol || !scrollCols.length) return;
        const fixedCells = fixedCol.querySelectorAll(".compare__cell");
        scrollCols.forEach(col => {
            const cells = col.querySelectorAll(".compare__cell");
            cells.forEach((cell, i) => {
                if (i === 0) return;
                let feature = cell.querySelector(".compare__feature");
                if (isMobile) {
                    if (!feature) {
                        feature = document.createElement("div");
                        feature.className = "compare__feature";
                        cell.prepend(feature);
                    }
                    const label = fixedCells[i]?.textContent?.trim() || "";
                    feature.textContent = label;
                } else if (feature) feature.remove();
            });
        });
    }
    function setHeaderHeights() {
        const headerCells = document.querySelectorAll(".compare__col_fixed .compare__cell_header, .compare__col .compare__cell_header");
        if (!headerCells.length) return;
        headerCells.forEach(cell => cell.style.height = "auto");
        let maxHeight = 0;
        headerCells.forEach(cell => {
            const h = cell.offsetHeight;
            if (h > maxHeight) maxHeight = h;
        });
        headerCells.forEach(cell => cell.style.height = maxHeight + "px");
    }
    function initProfileFormSave() {
        const form = document.querySelector(".profile__form");
        if (!form) return;
        const button = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll("input[name]");
        if (!button || !inputs.length) return;
        const savedData = JSON.parse(localStorage.getItem("profileData") || "{}");
        inputs.forEach(input => {
            if (savedData[input.name] && savedData[input.name] !== input.value) input.value = savedData[input.name];
        });
        let notify = form.querySelector(".form__notify");
        if (!notify) {
            notify = document.createElement("div");
            notify.className = "form__notify";
            form.appendChild(notify);
        }
        form.addEventListener("submit", e => {
            e.preventDefault();
            let hasError = false;
            const data = {};
            inputs.forEach(input => {
                const value = input.value.trim();
                const item = input.closest(".form-faq__item") || input.parentElement;
                item?.classList.remove("_error");
                if (!value) {
                    hasError = true;
                    item?.classList.add("_error");
                }
                data[input.name] = value;
            });
            if (hasError) {
                notify.textContent = "Заполните все обязательные поля ❗";
                notify.classList.add("_active", "_error");
                setTimeout(() => notify.classList.remove("_active", "_error"), 3e3);
                return;
            }
            button.disabled = true;
            button.classList.add("_loading");
            const oldText = button.textContent;
            button.textContent = "Сохраняем...";
            setTimeout(() => {
                localStorage.setItem("profileData", JSON.stringify(data));
                button.disabled = false;
                button.classList.remove("_loading");
                button.textContent = oldText;
                notify.textContent = "Изменения сохранены ✅";
                notify.classList.remove("_error");
                notify.classList.add("_active");
                setTimeout(() => {
                    notify.classList.remove("_active");
                }, 2500);
            }, 1500);
        });
    }
    function initForms(scope = document) {
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.setAttribute("novalidate", "");
            const inputs = form.querySelectorAll("input[required]");
            const phoneInputs = form.querySelectorAll('input[type="tel"]');
            const emailInputs = form.querySelectorAll('input[type="email"]');
            phoneInputs.forEach(phoneInput => {
                phoneInput.addEventListener("focus", () => {
                    if (phoneInput.value.trim() === "") phoneInput.value = "+7 (";
                    clearError(phoneInput);
                });
                phoneInput.addEventListener("input", () => {
                    let value = phoneInput.value.replace(/\D/g, "");
                    if (value.startsWith("8")) value = "7" + value.slice(1);
                    if (!value.startsWith("7")) value = "7" + value;
                    let formatted = "+7 (";
                    if (value.length > 1) formatted += value.substring(1, 4);
                    if (value.length >= 5) formatted += ") " + value.substring(4, 7);
                    if (value.length >= 8) formatted += "-" + value.substring(7, 9);
                    if (value.length >= 10) formatted += "-" + value.substring(9, 11);
                    phoneInput.value = formatted;
                });
                phoneInput.addEventListener("blur", () => {
                    const digits = phoneInput.value.replace(/\D/g, "");
                    if (digits.length < 11) phoneInput.value = "";
                });
            });
            function isValidEmail(email) {
                const pattern = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;
                return pattern.test(email);
            }
            function showError(input) {
                const item = input.closest(".form-faq__item");
                if (!item) return;
                const label = item.querySelector(".form-faq__label");
                if (label && !label.dataset.original) {
                    label.dataset.original = label.textContent;
                    label.textContent = "Ошибка";
                }
                item.classList.add("_error");
            }
            function clearError(input) {
                const item = input.closest(".form-faq__item");
                if (!item) return;
                const label = item.querySelector(".form-faq__label");
                if (item.classList.contains("_error")) {
                    item.classList.remove("_error");
                    if (label && label.dataset.original) {
                        label.textContent = label.dataset.original;
                        delete label.dataset.original;
                    }
                }
            }
            emailInputs.forEach(emailInput => {
                emailInput.addEventListener("focus", () => clearError(emailInput));
                emailInput.addEventListener("blur", () => {
                    const value = emailInput.value.trim();
                    if (value !== "" && !isValidEmail(value)) showError(emailInput);
                });
            });
            form.addEventListener("submit", e => {
                e.preventDefault();
                let hasError = false;
                inputs.forEach(input => {
                    const type = input.getAttribute("type");
                    const value = input.value.trim();
                    let invalid = false;
                    if (type === "checkbox") {
                        if (!input.checked) invalid = true;
                    } else if (!value) invalid = true; else if (type === "tel") {
                        const digits = value.replace(/\D/g, "");
                        if (digits.length < 11) invalid = true;
                    } else if (type === "email") {
                        if (!isValidEmail(value)) invalid = true;
                    } else if (type === "password") if (value.length < 6) invalid = true;
                    if (invalid) {
                        showError(input);
                        hasError = true;
                    }
                    const passwordInputs = form.querySelectorAll('input[type="password"]');
                    if (passwordInputs.length === 2) {
                        const [pass1, pass2] = passwordInputs;
                        if (pass1.value.trim() !== pass2.value.trim()) {
                            showError(pass2);
                            hasError = true;
                        }
                    }
                });
                if (!hasError) form.closest(".form-faq")?.classList.add("form-faq_success-active");
            });
            inputs.forEach(input => {
                input.addEventListener("focus", () => clearError(input));
            });
        });
        const hoverBoxes = document.querySelectorAll(".checkbox__hover");
        hoverBoxes.forEach(hover => {
            hover.addEventListener("click", () => {
                const checkbox = hover.parentElement.querySelector(".checkbox__input");
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event("change", {
                        bubbles: true
                    }));
                }
            });
        });
    }
    async function activateTab(hash) {
        const tabsLinks = document.querySelectorAll(".lk__tabs a");
        const content = document.querySelector(".lk__content");
        if (!tabsLinks.length || !content) return;
        const link = Array.from(tabsLinks).find(a => a.getAttribute("href").endsWith(hash));
        if (!link) return;
        tabsLinks.forEach(l => l.classList.remove("_lk-active"));
        link.classList.add("_lk-active");
        content.classList.add("_loading");
        try {
            const res = await fetch(link.getAttribute("href"));
            if (!res.ok) throw new Error("Ошибка загрузки вкладки");
            const html = await res.text();
            const parser = new DOMParser;
            const doc = parser.parseFromString(html, "text/html");
            const mainContent = doc.querySelector(".lk__content")?.innerHTML || "";
            content.innerHTML = mainContent;
            content.classList.remove("_loading");
            initForms(content);
            initProfileFormSave();
        } catch (err) {
            console.error(err);
            content.classList.remove("_loading");
            content.innerHTML = "<p class='lk__error'>Не удалось загрузить вкладку 😞</p>";
        }
    }
    function initLkTabs() {
        const tabsLinks = document.querySelectorAll(".lk__tabs a");
        if (!tabsLinks.length) return;
        function openTabFromHash() {
            const hash = location.hash.slice(1) || "profile";
            const link = Array.from(tabsLinks).find(a => a.getAttribute("href").includes(hash + ".html"));
            if (link) {
                const href = link.getAttribute("href");
                activateTab(href);
            } else {
                const firstLink = tabsLinks[0];
                if (firstLink) {
                    const firstHref = firstLink.getAttribute("href");
                    history.replaceState(null, "", "#lk");
                    activateTab(firstHref);
                }
            }
        }
        tabsLinks.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                const hash = link.getAttribute("href").split("/").pop();
                const tabName = hash.replace(".html", "");
                history.pushState(null, "", `#${tabName}`);
                openTabFromHash();
            });
        });
        openTabFromHash();
        window.addEventListener("hashchange", openTabFromHash);
    }
    document.addEventListener("DOMContentLoaded", () => {
        document.documentElement.addEventListener("click", e => {
            const target = e.target;
            console.log(target);
            if (target.closest(".compare__btn_next")) next();
            if (target.closest(".compare__btn_prev")) prev();
            if (target.closest(".compare__close")) removeColumn(target);
            if (e.target.closest(".form-faq__close")) {
                const formBlock = e.target.closest(".form-faq");
                formBlock.classList.remove("form-faq_success-active");
                const form = formBlock.querySelector(".form-faq__form");
                form.reset();
            }
        });
        update();
        const updateFeatures = debounce(applyMobileFeatures, 100);
        window.addEventListener("resize", updateFeatures);
        window.addEventListener("load", applyMobileFeatures);
        applyMobileFeatures();
        initForms(document);
        const updateHeight = debounce(setHeaderHeights, 200);
        window.addEventListener("resize", updateHeight);
        setTimeout(setHeaderHeights, 200);
        window.addEventListener("load", setHeaderHeights);
        const images = document.querySelectorAll(".compare__col img");
        images.forEach(img => {
            img.addEventListener("load", () => {
                updateHeight();
            });
        });
        initLkTabs();
    });
    spollers();
})();