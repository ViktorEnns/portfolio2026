/* =============================================================
   Viktor Enns · Personal Portfolio Interactive Logic
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Entrance Trigger
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 100);

    // 2. Cursor Follow Soft Light Coordinator
    const cursorLight = document.querySelector(".cursor-light");
    if (cursorLight) {
        document.body.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-active");
        });
        document.body.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-active");
        });
        document.body.addEventListener("mousemove", (e) => {
            // Use requestAnimationFrame for maximum performance
            window.requestAnimationFrame(() => {
                cursorLight.style.left = `${e.clientX}px`;
                cursorLight.style.top = `${e.clientY}px`;
            });
        });
    }

    // 3. Persistent Dark/Light Theme Switching System
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || 
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    // Initialize state
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (themeToggle) {
        themeToggle.checked = currentTheme === "dark";
        themeToggle.addEventListener("change", function () {
            const theme = this.checked ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        });
    }

    // 3b. Persistent Language Switching System (EN/DE)
    const langToggle = document.getElementById("lang-toggle");
    const currentLang = localStorage.getItem("lang") || "en";

    // Initialize language state
    document.documentElement.setAttribute("data-lang", currentLang);
    if (langToggle) {
        langToggle.checked = currentLang === "de";
        langToggle.addEventListener("change", function () {
            const lang = this.checked ? "de" : "en";
            document.documentElement.setAttribute("data-lang", lang);
            localStorage.setItem("lang", lang);
        });
    }

    // 4. Vertical Scroll Progress Coordinator
    const handleScroll = () => {
        const scrollProgressEl = document.querySelector(".scroll-progress");
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgressEl && docHeight > 0) {
            const pct = (scrollTop / docHeight) * 100;
            scrollProgressEl.style.width = `${pct}%`;
        }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
});

// Global state to track currently opened dossier card for lightbox sequential navigation
let currentCardIndex = -1;

// 5. Lightroom Lightbox Modal Controller (Global namespace)
window.openLightbox = function(mediaSrcsJson, tagEn, tagDe, titleEn, titleDe, textEn, textDe, num) {
    const modal = document.getElementById("lightbox-modal");
    const mediaContainer = document.getElementById("lightbox-media-container");
    const tagEl = document.getElementById("lightbox-tag");
    const titleEl = document.getElementById("lightbox-title");
    const textEnEl = document.getElementById("lightbox-text-en");
    const textDeEl = document.getElementById("lightbox-text-de");
    const numEl = document.getElementById("lightbox-num");

    if (!modal || !mediaContainer) return;

    // Parse index from 'num' metadata string (e.g. "01 / FAUCETS" -> 1 -> index 0)
    const cardNumStr = num.split(" / ")[0];
    const cardNum = parseInt(cardNumStr, 10);
    if (!isNaN(cardNum)) {
        currentCardIndex = cardNum - 1;
    }

    // Parse media sources (can be a JSON array string or a single string)
    let mediaList = [];
    try {
        mediaList = JSON.parse(mediaSrcsJson);
    } catch (e) {
        mediaList = [mediaSrcsJson];
    }

    if (mediaList.length > 1) {
        // Render horizontal snapping carousel inside lightbox
        let slidesHtml = "";
        mediaList.forEach(src => {
            const path = `assets/sometimes/${src}`;
            const isVideo = src.toLowerCase().endsWith('.mp4');
            if (isVideo) {
                slidesHtml += `<div class="carousel-slide"><video src="${path}" autoplay muted loop playsinline></video></div>`;
            } else {
                slidesHtml += `<div class="carousel-slide"><img src="${path}" alt="Lightbox preview"></div>`;
            }
        });

        mediaContainer.innerHTML = `
            <div class="sometimes-card-carousel lightbox-media-carousel">
                ${slidesHtml}
            </div>
            <div class="carousel-badge glass glass--pill"><span>1 / ${mediaList.length}</span></div>
        `;
    } else {
        // Single media item representation
        const src = mediaList[0];
        const path = `assets/sometimes/${src}`;
        const isVideo = src.toLowerCase().endsWith('.mp4');
        if (isVideo) {
            mediaContainer.innerHTML = `<video src="${path}" autoplay muted loop playsinline style="width:100%; height:100%; object-fit:contain; border-radius:4px;"></video>`;
        } else {
            mediaContainer.innerHTML = `<img src="${path}" style="width:100%; height:100%; object-fit:contain; border-radius:4px;">`;
        }
    }

    // Re-bind mouse drag handlers for the new lightbox carousel
    setupCarousels();

    // Load captions & metadata in both languages so they auto-toggle with the global language switcher!
    if (tagEl) {
        tagEl.innerHTML = `<span class="lang-en">${tagEn}</span><span class="lang-de">${tagDe}</span>`;
    }
    if (titleEl) {
        titleEl.innerHTML = `<span class="lang-en">${titleEn}</span><span class="lang-de">${titleDe}</span>`;
    }
    if (textEnEl) textEnEl.innerHTML = textEn;
    if (textDeEl) textDeEl.innerHTML = textDe;
    if (numEl) {
        const parts = num.split(" / ");
        const numPart = parts[0];
        const labelEn = parts[1];
        numEl.innerHTML = `<span class="lang-en">${numPart} / ${labelEn}</span><span class="lang-de">${numPart} / ${titleDe.toUpperCase()}</span>`;
    }

    // Toggle active classes
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable parent body scroll hijack!
};

window.closeLightbox = function() {
    const modal = document.getElementById("lightbox-modal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable body scroll!

    // Flush large media from DOM to preserve browser memory
    const mediaContainer = document.getElementById("lightbox-media-container");
    if (mediaContainer) mediaContainer.innerHTML = "";
    currentCardIndex = -1;
};

// Hop to the Next Dossier Card in sequence
window.nextLightboxCard = function() {
    const cards = document.querySelectorAll(".sometimes-grid .sometimes-card");
    if (cards.length === 0) return;
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    cards[currentCardIndex].click();
};

// Hop to the Previous Dossier Card in sequence
window.prevLightboxCard = function() {
    const cards = document.querySelectorAll(".sometimes-grid .sometimes-card");
    if (cards.length === 0) return;
    currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    cards[currentCardIndex].click();
};

// Widescreen Slide controller with seamless outer Card Hop boundaries
window.nextLightboxMedia = function() {
    const carousel = document.querySelector(".lightbox-media-carousel");
    if (carousel && carousel.offsetWidth > 0) {
        const activeIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        const totalSlides = carousel.children.length;
        if (activeIndex < totalSlides - 1) {
            carousel.scrollTo({
                left: (activeIndex + 1) * carousel.offsetWidth,
                behavior: "smooth"
            });
            return; // Managed within internal carousel slides
        }
    }
    nextLightboxCard();
};

window.prevLightboxMedia = function() {
    const carousel = document.querySelector(".lightbox-media-carousel");
    if (carousel && carousel.offsetWidth > 0) {
        const activeIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        if (activeIndex > 0) {
            carousel.scrollTo({
                left: (activeIndex - 1) * carousel.offsetWidth,
                behavior: "smooth"
            });
            return; // Managed within internal carousel slides
        }
    }
    prevLightboxCard();
};

// Keyboard listener for Escape and Arrow Keys
document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("lightbox-modal");
    const isLightboxActive = modal && modal.classList.contains("active");

    if (e.key === "Escape") {
        closeLightbox();
    } else if (isLightboxActive) {
        if (e.key === "ArrowRight") {
            nextLightboxMedia();
        } else if (e.key === "ArrowLeft") {
            prevLightboxMedia();
        }
    }
});

// 6. Interactive Mouse-Drag-to-Scroll & Dynamic Badges Engine
function setupCarousels() {
    const carousels = document.querySelectorAll(".sometimes-card-carousel");
    carousels.forEach(carousel => {
        if (carousel.dataset.listenersBound) return;
        carousel.dataset.listenersBound = "true";

        let isDown = false;
        let startX, startY;
        let scrollLeft;
        let wasDragging = false;

        // Desktop mouse drag scrolling
        carousel.addEventListener("mousedown", (e) => {
            isDown = true;
            carousel.classList.add("dragging");
            // Subtract offset to ensure clean local coordinate calculations
            const offsetLeft = carousel.getBoundingClientRect().left;
            startX = e.pageX - offsetLeft;
            startY = e.pageY;
            scrollLeft = carousel.scrollLeft;
            wasDragging = false;
            // Only prevent default on non-inputs to preserve native drag
            if (e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT") {
                e.preventDefault();
            }
        });

        carousel.addEventListener("mouseleave", () => {
            isDown = false;
            carousel.classList.remove("dragging");
        });

        carousel.addEventListener("mouseup", () => {
            isDown = false;
            carousel.classList.remove("dragging");
        });

        carousel.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const offsetLeft = carousel.getBoundingClientRect().left;
            const x = e.pageX - offsetLeft;
            const diffX = Math.abs((e.pageX - offsetLeft) - startX);
            const diffY = Math.abs(e.pageY - startY);
            
            // Mark as dragging if user slides more than 8 pixels
            if (diffX > 8 || diffY > 8) {
                wasDragging = true;
            }
            const walk = (x - startX) * 1.5; // Swipe velocity multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Intercept and block click propagation if carousel swipe dragging occurred
        carousel.addEventListener("click", (e) => {
            if (wasDragging) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true); // Run in capture phase

        // Dynamic Badge Index Update on Scroll (carousels only)
        carousel.addEventListener("scroll", () => {
            if (carousel.offsetWidth > 0) {
                const index = Math.round(carousel.scrollLeft / carousel.offsetWidth) + 1;
                const total = carousel.children.length;
                const badgeSpan = carousel.parentElement.querySelector(".carousel-badge span");
                if (badgeSpan) {
                    badgeSpan.textContent = `${index} / ${total}`;
                }
            }
        });
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    setupCarousels();
    
    // Click-backdrop listener for modal closure
    const lightboxModal = document.getElementById("lightbox-modal");
    if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }
});
