/**
 * ==========================================================================
 * Amicro Micro-Transitions Controller
 * Adapted from: Subhan-code/Amicro--Micro-transitions- (MIT License)
 * 
 * HOW TO TOGGLE:
 * Set any property below to `false` to turn that effect off,
 * or remove this script from index.html to disable completely.
 * ==========================================================================
 */
window.AMICRO_CONFIG = {
    magneticButtons: true, // #1: Tactile magnetic pull towards cursor on nav pills & buttons
    tiltCards: true,       // #2: 3D perspective tilt & specular glare on project cards
    musicWaveform: true,   // #3: Apple sound wave animation on Marble Music Match card
    cardFanOut: true       // #4: Framer Motion card fan-outs on Off the Clock carousels
};

(function initAmicro() {
    // Only run on desktop/devices with fine pointer (mouse/trackpad), avoid touch distortion
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    // --------------------------------------------------------------------------
    // 1. Magnetic Buttons (#1)
    // --------------------------------------------------------------------------
    if (window.AMICRO_CONFIG.magneticButtons && hasFinePointer) {
        // Elements to give magnetic physics
        const magneticSelectors = [
            ".top-nav .brand",
            ".top-nav .status-pill",
            ".top-nav .controls",
            ".proj-btn",
            ".contact-btn",
            ".contact-social-link",
            ".back-nav",
            ".text-reveal-btn"
        ];

        document.querySelectorAll(magneticSelectors.join(", ")).forEach((el) => {
            el.classList.add("amicro-magnetic");

            const strength = 0.28; // Subtle tactile magnetic pull
            let rafId = null;

            const onMouseMove = (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    el.classList.add("is-magnetizing");
                    el.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
                });
            };

            const onMouseLeave = () => {
                if (rafId) cancelAnimationFrame(rafId);
                el.classList.remove("is-magnetizing");
                el.style.transform = "translate3d(0px, 0px, 0)";
            };

            el.addEventListener("mousemove", onMouseMove, { passive: true });
            el.addEventListener("mouseleave", onMouseLeave, { passive: true });
        });
    }

    // --------------------------------------------------------------------------
    // 2. 3D Tilt Cards with Specular Glare (#2)
    // --------------------------------------------------------------------------
    if (window.AMICRO_CONFIG.tiltCards && hasFinePointer) {
        const cards = document.querySelectorAll(".currently-card");

        cards.forEach((card) => {
            card.classList.add("amicro-tilt-card");

            // Inject glare element if not already present
            let glare = card.querySelector(".amicro-tilt-glare");
            if (!glare) {
                glare = document.createElement("div");
                glare.className = "amicro-tilt-glare";
                card.appendChild(glare);
            }

            const maxTilt = 8; // Maximum tilt angle in degrees (subtle, elegant)
            let rafId = null;

            const onMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
                const relY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

                const rotX = -relY * maxTilt;
                const rotY = relX * maxTilt;

                const glareX = ((relX + 0.5) * 100).toFixed(1);
                const glareY = ((relY + 0.5) * 100).toFixed(1);

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    card.classList.add("is-tilting");
                    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
                    card.style.setProperty("--glare-x", `${glareX}%`);
                    card.style.setProperty("--glare-y", `${glareY}%`);
                });
            };

            const onMouseLeave = () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.classList.remove("is-tilting");
                card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";
            };

            card.addEventListener("mousemove", onMouseMove, { passive: true });
            card.addEventListener("mouseleave", onMouseLeave, { passive: true });
        });
    }

    // --------------------------------------------------------------------------
    // 3. Apple Sound Wave Micro-interaction (#3)
    // --------------------------------------------------------------------------
    if (window.AMICRO_CONFIG.musicWaveform) {
        // Find Marble Music Match card kicker specifically
        const cards = document.querySelectorAll(".currently-card");
        cards.forEach((card) => {
            const title = card.querySelector(".currently-card-title");
            if (title && title.textContent.includes("Marble")) {
                const kicker = card.querySelector(".currently-card-kicker");
                if (kicker && !kicker.querySelector(".amicro-sound-wave")) {
                    const wave = document.createElement("span");
                    wave.className = "amicro-sound-wave";
                    wave.setAttribute("aria-hidden", "true");
                    wave.innerHTML = "<span></span><span></span><span></span><span></span><span></span>";
                    kicker.appendChild(wave);
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 4. Amicro Card Fan Outs (#4) - "Off the Clock" Carousels
    // Desktop: CardScatterSpread (hover)
    // Mobile:  CardCascadeStagger (tap)
    // --------------------------------------------------------------------------
    if (window.AMICRO_CONFIG.cardFanOut) {
        const initFanOut = () => {
            const lifeSection = document.getElementById("life");
            if (!lifeSection) return;

            const cards = lifeSection.querySelectorAll(".sometimes-card");

            // Preset scatter offsets matching Framer Motion CardScatterSpread
            const getScatterOffsets = (total) => {
                if (total === 2) {
                    return [
                        { x: -45, y: -5, rotate: -9 },
                        { x: 45, y: -5, rotate: 9 }
                    ];
                }
                if (total === 3) {
                    return [
                        { x: -60, y: 5, rotate: -12 },
                        { x: 0, y: -25, rotate: 2 },
                        { x: 60, y: 12, rotate: 12 }
                    ];
                }
                if (total === 4) {
                    return [
                        { x: -68, y: 10, rotate: -13 },
                        { x: -22, y: -18, rotate: -5 },
                        { x: 22, y: -18, rotate: 5 },
                        { x: 68, y: 14, rotate: 13 }
                    ];
                }
                if (total === 5) {
                    return [
                        { x: -75, y: 15, rotate: -14 },
                        { x: -35, y: -15, rotate: -6 },
                        { x: 0, y: -30, rotate: 2 },
                        { x: 35, y: -10, rotate: 8 },
                        { x: 75, y: 20, rotate: 15 }
                    ];
                }
                // Generalized continuous formula for total >= 6
                const offsets = [];
                const center = (total - 1) / 2;
                for (let i = 0; i < total; i++) {
                    const progress = (i - center) / (center === 0 ? 1 : center);
                    const x = Math.round(progress * 80);
                    const rotate = Math.round(progress * 15);
                    const y = Math.round((progress * progress) * 45 - 26);
                    offsets.push({ x, y, rotate });
                }
                return offsets;
            };

            cards.forEach((card) => {
                const carousel = card.querySelector(".sometimes-card-carousel");
                if (!carousel) return;

                const slides = carousel.querySelectorAll(".carousel-slide");
                if (slides.length <= 1) return; // Single-image cards stay clean

                card.classList.add("amicro-fan-card");
                carousel.classList.add("amicro-fan-carousel");
                carousel.dataset.listenersBound = "true"; // Instruct setupCarousels to skip drag scroll
                if (carousel.parentElement) {
                    carousel.parentElement.classList.add("amicro-fan-wrap");
                }

                const total = slides.length;
                const centerIdx = Math.floor((total - 1) / 2);
                const scatter = getScatterOffsets(total);

                slides.forEach((slide, i) => {
                    const dt = scatter[i] || { x: 0, y: 0, rotate: 0 };
                    const isCenter = (total % 2 === 1 && i === centerIdx) || (total % 2 === 0 && (i === centerIdx || i === centerIdx + 1));
                    const dtScale = isCenter ? 1.05 : 0.98;
                    const fanZ = total - Math.abs(i - centerIdx);
                    const restZ = total - i;

                    // Mobile Cascade calculations
                    const dist = i - centerIdx;
                    const mobY = dist * -28 - 14;
                    const mobX = dist * 14;
                    const mobRot = dist * 6;
                    const mobScale = (Math.abs(dist) === 0) ? 1.05 : 0.98;
                    const mobRestY = dist * 2;

                    slide.style.setProperty("--dt-x", `${dt.x}px`);
                    slide.style.setProperty("--dt-y", `${dt.y}px`);
                    slide.style.setProperty("--dt-rot", `${dt.rotate}deg`);
                    slide.style.setProperty("--dt-scale", dtScale);
                    slide.style.setProperty("--fan-z", fanZ);
                    slide.style.setProperty("--rest-z", restZ);

                    slide.style.setProperty("--mob-x", `${mobX}px`);
                    slide.style.setProperty("--mob-y", `${mobY}px`);
                    slide.style.setProperty("--mob-rot", `${mobRot}deg`);
                    slide.style.setProperty("--mob-scale", mobScale);
                    slide.style.setProperty("--mob-rest-y", `${mobRestY}px`);

                    // Clicking a specific card slide sets initial slide index for lightbox
                    slide.addEventListener("click", () => {
                        window.amicroClickedSlideIndex = i;
                    });
                });

                // Mobile Touch & Tap Interaction:
                // First tap expands into CardCascadeStagger (.is-fanned)
                // Second tap opens lightbox at clicked photo
                let touchStartX = 0;
                let touchStartY = 0;
                let isTouchMove = false;

                card.addEventListener("touchstart", (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isTouchMove = false;
                }, { passive: true });

                card.addEventListener("touchmove", (e) => {
                    const diffX = Math.abs(e.touches[0].clientX - touchStartX);
                    const diffY = Math.abs(e.touches[0].clientY - touchStartY);
                    if (diffX > 10 || diffY > 10) {
                        isTouchMove = true;
                    }
                }, { passive: true });

                card.addEventListener("click", (e) => {
                    if (isTouchMove) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    const isTouchOrCoarse = window.matchMedia("(hover: none) or (pointer: coarse)").matches || window.innerWidth <= 820;

                    if (isTouchOrCoarse) {
                        if (!card.classList.contains("is-fanned")) {
                            // First tap: expand the deck!
                            e.preventDefault();
                            e.stopPropagation();

                            document.querySelectorAll("#life .sometimes-card.is-fanned").forEach((c) => {
                                if (c !== card) c.classList.remove("is-fanned");
                            });

                            card.classList.add("is-fanned");
                        }
                        // Second tap: let event bubble to openLightbox
                    }
                }, true); // Capture phase ensures we intercept before inline onclick!
            });

            // Tap outside collapses all fanned decks on mobile
            document.addEventListener("click", (e) => {
                if (!e.target.closest("#life .sometimes-card.amicro-fan-card")) {
                    document.querySelectorAll("#life .sometimes-card.is-fanned").forEach((c) => {
                        c.classList.remove("is-fanned");
                    });
                }
            });
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initFanOut);
        } else {
            initFanOut();
        }
    }
})();
