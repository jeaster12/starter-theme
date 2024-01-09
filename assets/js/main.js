
// -----------------------------------------------------------------------------
// Helpers

function safeReportError(err) {
    if ("Sentry" in window) {
        return window.Sentry.captureException(err);
    }

    if (typeof window.reportError === "function") {
        return window.reportError(err);
    }

    console.error(err);
}

function safeCall(fn) {
    try {
        fn()
    } catch (err) {
        safeReportError(err);
    }
}

function addClickOutsideEventListener(node, callback) {
    const handleClickOutside = (event) => {
        if (!node.contains(event.target)) {
            callback && callback(event);
        }
    }

    document.addEventListener("click", handleClickOutside);

    return handleClickOutside;
}

function focusOptionsSupported () {
    let supported = false;

    try {
        document.createElement('div').focus({
            get preventScroll() { return supported = true; }
        });
    } catch (err) {
        supported = false;
        safeReportError(err);
    }

    return supported;
}


// -----------------------------------------------------------------------------
// Init animations

safeCall(() => {
    const animationEnabled = document.querySelector('.tag-hash-landing-animation');
    const scrollAnimations = sal({ threshold: animationEnabled ? 0.05 : 0 });

    if (!animationEnabled) {
        scrollAnimations.disable();
    }
});


// -----------------------------------------------------------------------------
// Responsive menu

safeCall(() => {
    const menu = document.querySelector("[data-mobile-menu]");
    const toggle = document.querySelector("[data-mobile-menu-toggle]");
    const closeBtns = document.querySelectorAll("[data-mobile-menu-close]") || [];

    const extraMenuClassWhenOpen = 'open';
    const extraBodyClassWhenOpen = 'has-modal';

    if (!toggle || !menu) {
        return;
    }

    const open = () => {
        menu.classList.add(extraMenuClassWhenOpen);
        document.body.classList.add(extraBodyClassWhenOpen);
    }

    const close = () => {
        menu.classList.remove(extraMenuClassWhenOpen);
        document.body.classList.remove(extraBodyClassWhenOpen);
    }

    toggle.addEventListener("click", () => {
        open();
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            close();
        });
    });
});


// -----------------------------------------------------------------------------
// Theme toggle

safeCall(() => {   
    const buttons = document.querySelectorAll("[data-theme-toggle]") || [];

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }

            // Ghost native comments sets the color scheme once on page load
            // We need to reload the comments iframe when the user changes the color scheme
            safeCall(() => {
                const commentsIframe = document.querySelector("#ghost-comments-root > iframe");
                if (commentsIframe) {
                    commentsIframe.style.visibility = "hidden";
                    commentsIframe.contentWindow.location.reload();
                    setTimeout(() => {
                        commentsIframe.style.visibility = "visible";
                    }, 300);
                }
            });
        });
    });
});


// -----------------------------------------------------------------------------
// Menu dropdown

safeCall(() => {
    const container = document.querySelector('[data-dropdown-container]');
    const toggle = document.querySelector('[data-dropdown-toggle]');
    const dropdown = document.querySelector('[data-dropdown]');

    if (!toggle || !dropdown || !container) {
        return;
    }

    const handleClickOutside = (event) => {
        if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
            container.classList.remove('open');
        }
    }    

    toggle.addEventListener('click', () => {
        if (container.classList.contains('open')) {
            container.classList.remove('open');
            document.removeEventListener("click", handleClickOutside, true);
        } else {
            container.classList.add('open');
            document.addEventListener("click", handleClickOutside, true);
        }
    });
});


// -----------------------------------------------------------------------------
// Collapsible docs sections

safeCall(() => {
    const menu = document.querySelector('.collapsible .docs-menu');
    if (!menu) {
        return;
    }    

    // open / close sections
    const headings = menu.querySelectorAll('[data-docs-section-heading]');
    headings.forEach(h => {
        h.addEventListener("click", () => {
            const section = h.closest('[data-docs-section]');
            section && section.classList.toggle('open');
        });
    });
});


// -----------------------------------------------------------------------------
// Scroll the doc sidebar to current link

safeCall(() => {
    const menu = document.querySelector('.docs-menu');
    if (!menu) {
        return;
    }    

    const links = Array.from(menu.querySelectorAll('a'));
    const currentPostIndex = links.findIndex(({ classList }) => classList.contains('current'));
    const currentPost = links[currentPostIndex];

    if (!currentPost) {
        return;
    }

    currentPost.scrollIntoView({ block: "nearest", inline: "nearest" });

});


// -----------------------------------------------------------------------------
// Doc responsive menu

safeCall(() => {
    const breadcrumbsBtn = document.querySelector('[data-breadcrumbs-button]');
    const docsMenu = document.querySelector('[data-docs-menu]');
    const closeBtns = document.querySelectorAll('[data-docs-menu-close]');

    const extraMenuClassWhenOpen = 'open';
    const extraBodyClassWhenOpen = 'has-modal';

    if (!breadcrumbsBtn || !docsMenu) {
        return;
    }

    const open = () => {
        docsMenu.classList.add(extraMenuClassWhenOpen);
        document.body.classList.add(extraBodyClassWhenOpen);
    }

    const close = () => {
        docsMenu.classList.remove(extraMenuClassWhenOpen);
        document.body.classList.remove(extraBodyClassWhenOpen);
    }

    breadcrumbsBtn.addEventListener("click", () => {
        open();
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            close();
        });
    });    
});


// -----------------------------------------------------------------------------
// Docs Next & Prev & Breadcrumbs

safeCall(() => {
    const menu = document.querySelector('.docs-menu');
    const prevLink = document.querySelector('.docs-prev');
    const nextLink = document.querySelector('.docs-next');

    if (!menu) {
        return;
    }

    const links = Array.from(menu.querySelectorAll('a'));
    const currentPostIndex = links.findIndex(({ classList }) => classList.contains('current'));
    
    const indexPage = links[0]; 
    const prevPost = links[currentPostIndex - 1];
    const currentPost = links[currentPostIndex];
    const nextPost = links[currentPostIndex + 1];

    // Set parent doc nav link as current
    // This is only needed when a documentation collection is set on index (/)
    // For other paths, this is already handled by Ghost adding class 'current-parent' to nav links
    if (currentPost && currentPost !== indexPage) {
        const currentSlug = currentPost.getAttribute('data-slug') || '';
        const navLinks = Array.from(document.querySelectorAll('[data-header] .navigation a') || []);
        const hasCurrent = navLinks.some(l => l.classList.contains('current') || l.classList.contains('current-parent'));

        if (!hasCurrent) {
            for(let i = 0; i < navLinks.length; i++) {
                if (navLinks[i].href === currentPost.href.replace(currentSlug + "/", '')) {
                    navLinks[i].classList.add('current');
                    break;
                }
            }    
        }
    }

    if (currentPost) {
        const sectionName = currentPost.getAttribute('data-section');   
        
        const breadcrumbsSectionElement = document.querySelector("[data-breadcrumbs-section]");
        const breadcrumbsSectionTextElement = document.querySelector("[data-breadcrumbs-section-text]");
        const breadcrumbsCurrentElement = document.querySelector("[data-breadcrumbs-current]");

        if (sectionName && breadcrumbsSectionElement && breadcrumbsSectionTextElement && !menu.classList.contains('no-sections')) {
            breadcrumbsSectionTextElement.textContent = sectionName;
            breadcrumbsSectionElement.classList.remove('hidden');
        }

        if (breadcrumbsCurrentElement) {
            breadcrumbsCurrentElement.textContent = currentPost.getAttribute('data-title');
            breadcrumbsCurrentElement.classList.remove('hidden');
        }
    }

    if (prevPost && prevLink) {
        const textElement = prevLink.querySelector('.docs-prev-title');
        const sectionElement = prevLink.querySelector('.docs-prev-section');
        const sectionName = prevPost.getAttribute('data-section');

        if (sectionElement && sectionName) {
            sectionElement.textContent = " - " + sectionName;
        }        

        if (textElement) {
            prevLink.href = prevPost.href;
            textElement.textContent = prevPost.getAttribute('data-title');
            prevLink.classList.remove('invisible');
        }
    }

    if (nextPost && nextLink && currentPostIndex !== -1) {
        const textElement = nextLink.querySelector('.docs-next-title');
        const sectionElement = nextLink.querySelector('.docs-next-section');
        const sectionName = nextPost.getAttribute('data-section');

        if (sectionElement && sectionName) {
            sectionElement.textContent = " - " + sectionName;
        }

        if (textElement) {
            nextLink.href = nextPost.href;
            textElement.textContent = nextPost.getAttribute('data-title');
            nextLink.classList.remove('invisible');
        }
    }
});


// -----------------------------------------------------------------------------
// Add class to header when it becomes stuck (when position sticky takes effect)

safeCall(() => {
    const header = document.querySelector("[data-header]");
    const classWhenStuck = "stuck";

    const check = () => {
        header.classList.toggle(classWhenStuck, window.scrollY > 0);
    };
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(check);
    }, { passive: true });

    check();
});


// -----------------------------------------------------------------------------
// External links

safeCall(() => {
    const links = document.querySelectorAll('.navigation a, .content a') || [];

    links.forEach(link => {
        if (link.protocol !== "javascript:" && link.hostname !== location.hostname) {
            link.classList.add('external');
            link.target = "_blank";
        }

        // Fix some links that are always set by Ghost as external even when they're not (Product card button, ...)
        if (link.classList.contains('kg-product-card-button') && (link.protocol === "javascript:" || link.hostname === location.hostname)) {
            link.removeAttribute("target");
            link.removeAttribute("rel");            
        }
    });
});


// -----------------------------------------------------------------------------
// Fix blog timeline 
// When two consecutive posts are posted one year appart but on the same month 
// (not handled by CSS)

function fixTimeline() {
    const timelinePosts = Array.from(document.querySelectorAll('.timeline .timeline-post'));

    for (let i = 0; i < timelinePosts.length - 1; i++) {
        const current = timelinePosts[i];
        const currentMonth = current.getAttribute('data-post-month');
        const currentYear = current.getAttribute('data-post-year');

        const next = timelinePosts[i + 1];
        const nextMonth = next.getAttribute('data-post-month');
        const nextYear = next.getAttribute('data-post-year');

        if (currentMonth === nextMonth && currentYear !== nextYear) {
            next.classList.add('timeline-post--break');
        }
    }
}

safeCall(() => fixTimeline());


// -----------------------------------------------------------------------------
// Feed pagination 

safeCall(function () {
    const feedElement = document.querySelector("[data-pagination-feed]");
    const loadMoreBtn = document.querySelector("[data-pagination-btn]");
    const nextElement = document.querySelector('link[rel=next]');
    
    if (!loadMoreBtn || !feedElement || !nextElement) {
        return;
    }

    var loading = false;
    var currentPage = 1;
    var totalPages = Number(loadMoreBtn.getAttribute("data-total-pages")) ;

    // show the "Load more" button
    loadMoreBtn.classList.remove('hidden');

    function onPageLoad() {
        if (this.status >= 400) {
            loadMoreBtn.remove();
            return;
        }
        
        currentPage++;
        
        // Append contents
        var first = null;
        var postElements = this.response.querySelectorAll("[data-pagination-post]");
        var postElementsCopy = [];

        var fragment = document.createDocumentFragment();

        const focusPoint = document.createElement("span");
        fragment.appendChild(focusPoint);

        postElements.forEach(function (item, index) {
            // document.importNode is important, without it the item's owner
            // document will be different which can break resizing of
            // `object-fit: cover` images in Safari
            var node = document.importNode(item, true);

            fragment.appendChild(node);
            postElementsCopy.push(node);

            if (index === 0) {
                first = node;
            }
        });

        feedElement.appendChild(fragment);      
        
        // The feed could be empty if posts are filtered, in this case we should try to load next page
        var shouldAutoLoadNext = postElementsCopy.length === 0 && currentPage < totalPages;

        // Notify other parts of the app that new posts were loaded
        window.dispatchEvent(
            new CustomEvent("posts.loaded", {
                detail: { posts: postElementsCopy },
            })
        );

        // bring the focus back to the first element of the new page
        setTimeout(() => {
            const focusOptions = focusOptionsSupported() ? { preventScroll: true } : undefined;
            focusPoint.setAttribute("tabindex", -1);
            focusPoint.focus(focusOptions);
            focusPoint.blur();
            focusPoint.remove();
        });

        // set next link
        var resNextElement = this.response.querySelector('link[rel=next]');;
        if (resNextElement) {
            nextElement.href = resNextElement.href;
        } else {
            shouldAutoLoadNext = false;
            loadMoreBtn.remove();
        }

        // sync status
        if (shouldAutoLoadNext) {
            loading = false;
            onClick();
        } else {
            loading = false;
            loadMoreBtn.classList.remove("loading");
    
            fixTimeline();
        }
    }

    function onClick() {
        if (loading) {
            return;
        }

        loading = true;
        loadMoreBtn.classList.add("loading");

        var xhr = new window.XMLHttpRequest();
        xhr.responseType = "document";

        xhr.addEventListener("load", onPageLoad);

        xhr.open("GET", nextElement.href);
        xhr.send(null);
    }

    loadMoreBtn.addEventListener("click", onClick);
});


// -----------------------------------------------------------------------------
// Table of contents

safeCall(() => {
    const tocContainer = document.querySelector("[data-toc-container]");
    const tocSrc = document.querySelector("[data-toc-src]");
    const tocTarget = document.querySelector("[data-toc-target]");
    if (!tocbot || !tocSrc || !tocTarget || !tocContainer) {
        return;
    }

    tocbot.init({
        // Where to grab the headings to build the table of contents.
        contentElement: tocSrc,
        // Where to render the table of contents.
        tocElement: tocTarget,
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h1, h2, h3',
        // Headings that match the ignoreSelector will be skipped.
        ignoreSelector: '.js-toc-ignore, .js-toc-ignore h1, .js-toc-ignore h2, .js-toc-ignore h3, .kg-card h1, .kg-card h2, .kg-card h3, .gh-post-upgrade-cta h2',        
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        // ignore headings that are hidden in DOM
        ignoreHiddenElements: true,
        // Extra classes to add to links.
        extraLinkClasses: "flex py-1.5 hover:text-gray-700 dark:hover:text-gray-300 [&.node-name--H3]:py-1 [&.node-name--H3]:before:content-['—'] [&.node-name--H3]:before:inline [&.node-name--H3]:before:mr-1 [&.node-name--H3]:before:opacity-50",        
        // Class to add to active links,
        activeLinkClass: "current text-gray-700 font-medium -tracking-xs",     
        // Headings offset between the headings and the top of the document (this is meant for minor adjustments).
        headingsOffset: 80, 
        // Smooth scroll offset
        scrollSmoothOffset: -80,      
        // keep the toc scroll position in sync with the content.
        disableTocScrollSync: true,    
    }); 

    const tocList = tocContainer.querySelector('.toc-list');

    // Only show toc if we have at least two heading (one heading is added as a fix, see hbs file)
    if (!tocList || tocList.childNodes.length <= 1) {
        return;
    }

    tocContainer.classList.remove("invisible");
});


// -----------------------------------------------------------------------------
// Add lightbox to post/page content images

safeCall(() => {
    lightbox('.kg-image-card > .kg-image, .kg-gallery-image > img');
});


// -----------------------------------------------------------------------------
// Responsive video in post/page content

safeCall(() => {
    const sources = [
        '.content .kg-embed-card iframe[src*="youtube.com"]',
        '.content .kg-embed-card iframe[src*="youtube-nocookie.com"]',
        '.content .kg-embed-card iframe[src*="player.vimeo.com"]',
        '.content .kg-embed-card iframe[src*="dailymotion.com"]',
        '.content .kg-embed-card iframe[src*="embed.ted.com"]',
        '.content .kg-embed-card iframe[src*="kickstarter.com"][src*="video.html"]',
        '.content .kg-embed-card object',
        '.content .kg-embed-card embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
});


// -----------------------------------------------------------------------------
// Make post/page tables responsive

safeCall(() => {
    document.querySelectorAll(".ghost-content table, .content table").forEach((table) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("table-responsive");

        table.parentElement.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
});


// -----------------------------------------------------------------------------
// Configure Prismjs

safeCall(() => {
    window.Prism = window.Prism || {};
    window.Prism.plugins = window.Prism.plugins || {};
    window.Prism.plugins.autoloader = window.Prism.plugins.autoloader || {};

    window.Prism.plugins.autoloader.languages_path = "https://cdn.jsdelivr.net/npm/prismjs@v1.29.0/components/";

    window.Prism.highlightAll();
});

// -----------------------------------------------------------------------------
// Fix comments dark accent color

window.addEventListener("DOMContentLoaded", () => safeCall(() => {
    const commentsIframe = document.querySelector("#ghost-comments-root > iframe");
    const accentLight = window.Spiritix.ghostAccentColorLightRgb;
    const accentDark = window.Spiritix.ghostAccentColorDarkRgb;

    const onLoad = (loadEvent) => safeCall(() => {
        const iframeDocument = loadEvent.target.contentDocument;
        const styleElement = iframeDocument.createElement('style');

        styleElement.textContent = ` 
            .dark [style*='background-color: rgb(${accentLight.split(" ").join(', ')})'] { 
                background-color: rgb(${accentDark}) !important; 
            }
            .dark [style*='color: rgb(${accentLight.split(" ").join(', ')})']:not([style*='-color: rgb(${accentLight.split(" ").join(', ')})']) { 
                color: rgb(${accentDark}) !important; 
            }
        `;

        iframeDocument.head.appendChild(styleElement);
    });

    if (commentsIframe && accentLight && accentDark) {
        commentsIframe.addEventListener("load", onLoad);
    }
}));

// -----------------------------------------------------------------------------
// Fix accessibility issues with some editor cards

safeCall(() => {
    // Toggle cards icon buttons don't have any text
    const toggleButtons = document.querySelectorAll('.kg-toggle-card-icon');
    toggleButtons.forEach(b => {
        if (!b.hasAttribute('aria-label')) {
            b.setAttribute('aria-label',  window.Spiritix.t["Toggle menu"] || "Toggle menu");
        }
    });

    // Product cards images don't have alt
    const productImages = document.querySelectorAll('.kg-product-card-image');
    productImages.forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', '');
        }
    });
});


