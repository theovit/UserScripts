// ==UserScript==
// @name         Hanime Site Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides ads, forces new tabs, and cleans up page sections
// @author       Moon
// @match        https://*hanime.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanime.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS Injections (run once)
    const hideSelectors = [
        '.site-description',
        '.user_comments',
        '.rc-section:not(.up-next)'
    ];
    const style = document.createElement('style');
    style.innerHTML = hideSelectors.map(s => `${s} { display: none !important; }`).join('\n');
    document.head.appendChild(style);

    // 2. Combined Maintenance Function
    function runMaintenance() {

        // Task A: Auto-close ads
        const closeButtons = document.querySelectorAll('.unit__close');
        closeButtons.forEach(btn => {
            if (btn.offsetParent !== null) {
                btn.click();
            }
        });

        // Task B: Force links to open in new tab
        const links = document.querySelectorAll('a.hvc2, a.tile, a.search-result__item');
        links.forEach(link => {
            if (link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // Run once on load
    runMaintenance();

    // 3. Single Observer for everything
    const observer = new MutationObserver(runMaintenance);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
