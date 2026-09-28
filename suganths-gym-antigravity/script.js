/**
 * Suganth's Gym - Client Website Interactions
 * Vanilla JavaScript (No React, No external dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Elements Selection ---
    const navbar = document.getElementById("navbar");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    const desktopNavLinks = document.querySelectorAll(".nav-menu .nav-link");
    const sections = document.querySelectorAll("main section[id]");
    
    const brandLogoImg = document.getElementById("brandLogoImg");
    const brandLogoFallback = document.getElementById("brandLogoFallback");
    
    const galleryItems = document.querySelectorAll(".gallery-item");
    const galleryModal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const modalClose = document.getElementById("modalClose");
    const modalBackdrop = document.getElementById("modalBackdrop");
    
    const backToTop = document.getElementById("backToTop");

    // --- 2. Mobile Menu Drawer Toggle ---
    function toggleMobileMenu(open) {
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains("active");
        
        hamburgerBtn.classList.toggle("active", isOpen);
        mobileDrawer.classList.toggle("active", isOpen);
        drawerOverlay.classList.toggle("active", isOpen);
        
        hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        mobileDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
        document.body.style.overflow = isOpen ? "hidden" : "";
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => toggleMobileMenu());
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener("click", () => toggleMobileMenu(false));
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener("click", () => toggleMobileMenu(false));
    });

    // --- 3. Sticky Navbar Blur & Shadow on Scroll ---
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // --- 4. Active Navigation Highlighting on Scroll (ScrollSpy) ---
    function handleScrollSpy() {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                desktopNavLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
                mobileNavLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
    window.addEventListener("scroll", handleScrollSpy, { passive: true });

    // --- 5. Smooth Anchor Scrolling with Navbar Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 6. Brand Logo Fallback Management ---
    if (brandLogoImg && brandLogoFallback) {
        brandLogoImg.addEventListener("load", () => {
            // Check if loaded image has valid dimensions
            if (brandLogoImg.naturalWidth > 10) {
                brandLogoImg.style.display = "block";
                brandLogoFallback.style.display = "none";
            } else {
                brandLogoImg.style.display = "none";
                brandLogoFallback.style.display = "grid";
            }
        });
        
        brandLogoImg.addEventListener("error", () => {
            brandLogoImg.style.display = "none";
            brandLogoFallback.style.display = "grid";
        });
    }

    // --- 7. Graceful Image Loading & Fallback Management ---
    const gymPhotos = document.querySelectorAll("img.gym-photo");
    gymPhotos.forEach(img => {
        img.addEventListener("error", function() {
            // Hide the broken image so the placeholder UI underneath displays cleanly
            this.style.display = "none";
            const container = this.closest(".image-box");
            if (container) {
                const fallback = container.querySelector(".img-fallback-ui");
                if (fallback) {
                    fallback.style.display = "flex";
                }
            }
        });

        img.addEventListener("load", function() {
            // When real image loads successfully with valid dimensions
            if (this.naturalWidth > 10) {
                this.style.display = "block";
                const container = this.closest(".image-box");
                if (container) {
                    const fallback = container.querySelector(".img-fallback-ui");
                    if (fallback) {
                        fallback.style.display = "none";
                    }
                }
            }
        });
    });

    // --- 8. Gallery Lightbox Modal ---
    function openGalleryModal(src, title) {
        if (!galleryModal || !modalImg) return;
        modalImg.src = src;
        modalImg.alt = title || "Suganth's Gym photo";
        if (modalCaption) {
            modalCaption.textContent = title || "";
        }
        galleryModal.classList.add("active");
        galleryModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeGalleryModal() {
        if (!galleryModal) return;
        galleryModal.classList.remove("active");
        galleryModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const imgSrc = item.getAttribute("data-src") || (item.querySelector("img") && item.querySelector("img").src);
            const titleEl = item.querySelector(".gallery-title");
            const title = titleEl ? titleEl.textContent : "Suganth's Gym";
            if (imgSrc) {
                openGalleryModal(imgSrc, title);
            }
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.click();
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeGalleryModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeGalleryModal);
    }

    // Keyboard ESC listener
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (galleryModal && galleryModal.classList.contains("active")) {
                closeGalleryModal();
            }
            if (mobileDrawer && mobileDrawer.classList.contains("active")) {
                toggleMobileMenu(false);
            }
        }
    });

    // --- 9. Back to Top Smooth Scroll ---
    if (backToTop) {
        backToTop.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    console.log("Suganth's Gym website initialized successfully.");
});
