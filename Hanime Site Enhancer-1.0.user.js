// ==UserScript==
// @name         Hanime Site Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides ads, forces new tabs, and cleans up page sections
// @author       Moon
// @match        https://*hanime.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanime.tv
// @updateURL    https://github.com/theovit/UserScripts/raw/refs/heads/main/Hanime%20Site%20Enhancer-1.0.user.js
// @downloadURL  https://github.com/theovit/UserScripts/raw/refs/heads/main/Hanime%20Site%20Enhancer-1.0.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS Injections (run once)
    const hideSelectors = [
        '.site-description',
        '.user_comments'
    ];
    const style = document.createElement('style');
    style.innerHTML = hideSelectors.map(s => `${s} { display: none !important; }`).join('\n');
    document.head.appendChild(style);

    // 2. Combined Maintenance Function
    function runMaintenance() {

        // Task A: Clean up sections
        const sections = document.querySelectorAll('.rc-section');
        sections.forEach(section => {

            // Check for specific text content to protect the section
            const titleDiv = section.querySelector('.rcs-title');
            if (titleDiv && titleDiv.innerText.includes('series:')) {
                // Keep this section visible
                return;
            }

            // Otherwise, hide it
            section.style.display = 'none';
        });

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
