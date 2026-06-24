document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // GSAP FALLBACK FOR CDN FAILURE / OFFLINE TESTING
    // ----------------------------------------------------
    if (typeof gsap === "undefined") {
        console.warn("GSAP is not defined. Initializing fallback mock to prevent script crash.");
        window.gsap = {
            to: function(target, vars) {
                if (vars && typeof vars.onComplete === "function") {
                    try { vars.onComplete(); } catch(e) {}
                }
                return this;
            },
            from: function(target, vars) {
                if (vars && typeof vars.onComplete === "function") {
                    try { vars.onComplete(); } catch(e) {}
                }
                return this;
            },
            fromTo: function(target, fromVars, toVars) {
                if (toVars && typeof toVars.onComplete === "function") {
                    try { toVars.onComplete(); } catch(e) {}
                }
                return this;
            },
            timeline: function() {
                const tl = {
                    to: function(target, vars, position) {
                        if (vars && typeof vars.onComplete === "function") {
                            try { vars.onComplete(); } catch(e) {}
                        }
                        return tl;
                    },
                    from: function(target, vars, position) {
                        if (vars && typeof vars.onComplete === "function") {
                            try { vars.onComplete(); } catch(e) {}
                        }
                        return tl;
                    },
                    fromTo: function(target, fromVars, toVars, position) {
                        if (toVars && typeof toVars.onComplete === "function") {
                            try { toVars.onComplete(); } catch(e) {}
                        }
                        return tl;
                    }
                };
                return tl;
            }
        };
    }

    // ----------------------------------------------------
    // 1. PROJECT DATA (PORTFOLIO CASE STUDIES)
    // ----------------------------------------------------
    const projectData = {
        "elysian-estate": {
            title: "Elysian Estate",
            category: "Residential",
            location: "Beverly Hills, California",
            year: "2025",
            size: "850 m\u00B2",
            client: "Private Client",
            desc: "A pristine concrete and glass monolithic structure nestled on the hillsides of Beverly Hills, designed to maximize panoramic canyon views. Elysian Estate features custom double-height living spaces, seamless indoor-outdoor transition layouts, a 25-meter infinity pool, and bespoke gold-brass fixtures that naturally complement sunset reflections.",
            img: "assets/living_room_luxury.png"
        },
        "aura-lobby": {
            title: "Aura Hotel Lobby",
            category: "Commercial",
            location: "London, United Kingdom",
            year: "2026",
            size: "1,200 m\u00B2",
            client: "Aura Hospitality Group",
            desc: "An immersive, luxurious hotel lobby designed for a high-end boutique brand in central London. The space incorporates dramatic curved concrete ceilings, polished marble floors with fine brass inlays, and an imposing custom sculpture in the center. Integrated smart lighting dynamically adjusts color temperature to match natural circadian cycles.",
            img: "assets/hotel_lobby_minimalist.png"
        },
        "brick-gallery": {
            title: "The Brick Gallery",
            category: "Restoration",
            location: "Brooklyn, New York",
            year: "2024",
            size: "600 m\u00B2",
            client: "New York Arts Foundation",
            desc: "A historic 1920s brick warehouse meticulously restored and converted into a contemporary art museum. The original raw red brick walls and heavy steel trusses were fully preserved, sandblasted, and contrasted with clean, floating plaster gallery partitions, custom architectural track lighting, and a modern steel-and-glass entrance.",
            img: "assets/heritage_restoration_gallery.png"
        },
        "golden-pavilion": {
            title: "Golden Hour Pavilion",
            category: "Residential",
            location: "Malibu, California",
            year: "2025",
            size: "450 m\u00B2",
            client: "Private Client",
            desc: "A stunning oceanfront pavilion engineered around natural light. The floor-to-ceiling glass paneling slides open completely to unite the living room directly with the sandy beach deck. Crafted from raw teakwood, textured sandstone, and champagne gold details, it is a testament to sustainable coastal luxury.",
            img: "assets/hero_modernist_villa.png"
        }
    };

    // ----------------------------------------------------
    // 2. LOADING SCREEN & ENTRANCE ANIMATIONS
    // ----------------------------------------------------
    const preloader = document.getElementById("preloader");
    const preloaderProg = document.getElementById("preloader-progress");
    const preloaderNum = document.getElementById("preloader-number");

    // Simulate luxury loading screen progress
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 8) + 2;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            // Fade out preloader
            preloader.classList.add("fade-out");
            document.body.classList.remove("preloader-active");
            
            // Trigger home entrance animations
            setTimeout(() => {
                initializeHomeEntrance();
            }, 800);
        }
        preloaderProg.style.width = loadProgress + "%";
        preloaderNum.textContent = loadProgress + "%";
    }, 50);

    // GSAP Preloader text entrance
    gsap.to(".preloader-logo", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    // ----------------------------------------------------
    // 3. CUSTOM CURSOR MECHANICS
    // ----------------------------------------------------
    const cursorDot = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    
    let mouse = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Immediate position for dot cursor
        cursorDot.style.left = mouse.x + "px";
        cursorDot.style.top = mouse.y + "px";
    });

    // Interpolation (lerp) for smooth lag effect on the cursor ring
    function updateCursorRing() {
        const lerpFactor = 0.15;
        ringPos.x += (mouse.x - ringPos.x) * lerpFactor;
        ringPos.y += (mouse.y - ringPos.y) * lerpFactor;
        
        cursorRing.style.left = ringPos.x + "px";
        cursorRing.style.top = ringPos.y + "px";
        
        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Attach hover effects to all elements marked as hover-interactive
    function setupCursorHovers() {
        const interactives = document.querySelectorAll(".hover-action");
        interactives.forEach(el => {
            el.addEventListener("mouseenter", () => {
                const hoverText = el.getAttribute("data-hover-text") || "explore";
                cursorRing.setAttribute("data-text", hoverText);
                cursorRing.classList.add("hovered");
                cursorDot.classList.add("hovered");
            });
            
            el.addEventListener("mouseleave", () => {
                cursorRing.classList.remove("hovered");
                cursorDot.classList.remove("hovered");
                cursorRing.setAttribute("data-text", "");
            });
        });

        // Form elements text-mode cursor listeners
        const inputs = document.querySelectorAll("input, textarea, select");
        inputs.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorRing.classList.add("text-mode");
                cursorDot.classList.add("text-mode");
            });
            el.addEventListener("mouseleave", () => {
                cursorRing.classList.remove("text-mode");
                cursorDot.classList.remove("text-mode");
            });
            el.addEventListener("focus", () => {
                cursorRing.classList.add("text-mode");
                cursorDot.classList.add("text-mode");
            });
            el.addEventListener("blur", () => {
                cursorRing.classList.remove("text-mode");
                cursorDot.classList.remove("text-mode");
            });
        });
    }
    setupCursorHovers();

    // ----------------------------------------------------
    // 4. SPA ROUTER (FADE TRANSITIONS)
    // ----------------------------------------------------
    const sections = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll(".nav-link");

    function handleRouting() {
        let hash = window.location.hash || "#home";
        if (hash === "#") hash = "#home";
        
        const targetSection = document.querySelector(hash);
        if (!targetSection) return;

        // Auto close open modal on route transition
        closeModal();

        // Dispatch page-changed event to morph Three.js background
        window.dispatchEvent(new CustomEvent("page-changed", { 
            detail: { page: hash.substring(1) } 
        }));

        // Reset and clean up all page sections to prevent class active overlaps on rapid clicks
        sections.forEach(sec => {
            gsap.killTweensOf(sec);
            if (sec !== targetSection) {
                sec.classList.remove("active");
                sec.style.display = "none";
                sec.style.opacity = 0;
            }
        });

        // Activate new section immediately
        targetSection.style.display = "block";
        targetSection.classList.add("active");
        
        gsap.fromTo(targetSection, 
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Trigger section-specific entrance animations
        triggerSectionEntrance(hash);

        // Update nav links highlights
        navLinks.forEach(link => {
            if (link.getAttribute("href") === hash) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Close mobile nav on transition
        const navLinksContainer = document.getElementById("nav-links");
        const burgerBtn = document.getElementById("burger");
        if (navLinksContainer.classList.contains("nav-active")) {
            navLinksContainer.classList.remove("nav-active");
            burgerBtn.classList.remove("toggle");
        }
    }

    window.addEventListener("hashchange", handleRouting);
    
    // Initial routing call if hash exists, else default is #home
    if (window.location.hash) {
        handleRouting();
    } else {
        // Fallback default activation
        const homeSec = document.getElementById("home");
        homeSec.style.display = "block";
        homeSec.classList.add("active");
        homeSec.style.opacity = 1;
    }

    // ----------------------------------------------------
    // 5. GSAP PAGE ENTRANCE DETAILS
    // ----------------------------------------------------
    function initializeHomeEntrance() {
        const tl = gsap.timeline();
        tl.to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
          .to(".hero-title", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
          .to(".hero-description", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
          .to(".hero .btn", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
          .to(".hero-slider-bg", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=1");
    }

    function triggerSectionEntrance(hash) {
        if (hash === "#home") {
            gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            });
            gsap.from(".hero-slider-img", {
                scale: 1.15,
                duration: 2.5,
                ease: "power3.out"
            });
            animateMetrics();
        } else if (hash === "#about") {
            gsap.from(".story-img-main", {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
            gsap.from(".story-content > *", {
                x: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            });
            gsap.from(".pillar-card", {
                y: 40,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.2
            });
        } else if (hash === "#portfolio") {
            gsap.from(".portfolio-item", {
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            });
        } else if (hash === "#contact") {
            gsap.from(".contact-info-panel > *", {
                x: -40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            });
            gsap.from(".contact-form-panel", {
                x: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        } else if (hash === "#draft") {
            gsap.from(".draft-configurator", {
                x: -40,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
            gsap.from(".draft-control-group", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.2
            });
            gsap.from(".draft-visual-guide", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.5
            });
            
            // Dispatch initial changed event to set up initial ThreeJS values on route change
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("draft-changed", {
                    detail: draftConfig
                }));
            }, 100);
        }
    }

    // Dynamic numerical metrics counter animation
    function animateMetrics() {
        const metrics = document.querySelectorAll(".metric-num");
        metrics.forEach(metric => {
            const targetVal = parseInt(metric.getAttribute("data-val"));
            const obj = { val: 0 };
            gsap.to(obj, {
                val: targetVal,
                duration: 2,
                ease: "power3.out",
                onUpdate: () => {
                    metric.textContent = Math.floor(obj.val) + (metric.getAttribute("data-val") === "100" ? "%" : "+");
                }
            });
        });
    }

    // Trigger metrics manually when user scrolls past them on Home
    let animatedMetricsAlready = false;
    window.addEventListener("scroll", () => {
        const activeSection = document.querySelector(".page-section.active");
        if (activeSection && activeSection.id === "home" && !animatedMetricsAlready) {
            const metricsSection = document.querySelector(".metrics-section");
            if (metricsSection) {
                const rect = metricsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    animateMetrics();
                    animatedMetricsAlready = true;
                }
            }
        }
    });

    // ----------------------------------------------------
    // 6. PORTFOLIO CARDS: 3D TILT EFFECT & FILTERING
    // ----------------------------------------------------
    const items = document.querySelectorAll(".portfolio-item");
    
    items.forEach(item => {
        const inner = item.querySelector(".portfolio-item-inner");
        
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            // X and Y coords relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt angle (-10 to 10 deg)
            const rotateY = ((x / rect.width) - 0.5) * 16;
            const rotateX = (0.5 - (y / rect.height)) * 16;
            
            inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
        });
        
        item.addEventListener("mouseleave", () => {
            inner.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
        });
    });

    // Category Filtering logic
    const filterBtns = document.querySelectorAll(".filter-btn");
    const portfolioGrid = document.getElementById("portfolio-grid");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterValue = btn.getAttribute("data-filter");
            
            gsap.to(portfolioGrid, {
                opacity: 0,
                y: 15,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    items.forEach(item => {
                        const cat = item.getAttribute("data-category");
                        if (filterValue === "all" || cat === filterValue) {
                            item.style.display = "block";
                        } else {
                            item.style.display = "none";
                        }
                    });
                    
                    // Animate grid back in
                    gsap.to(portfolioGrid, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        });
    });

    // ----------------------------------------------------
    // 6.5. DRAFT MY HOUSE CONFIGURATOR
    // ----------------------------------------------------
    let draftConfig = { length: 12, width: 10, pillars: 4, furniture: true };

    const sliderLength = document.getElementById("draft-length");
    const sliderWidth = document.getElementById("draft-width");
    const displayLength = document.getElementById("draft-length-val");
    const displayWidth = document.getElementById("draft-width-val");
    const pillarBtns = document.querySelectorAll(".pillar-btn");
    const toggleFurniture = document.getElementById("draft-furniture");
    const btnSubmitDraft = document.getElementById("btn-submit-draft");
    
    const draftBadge = document.getElementById("draft-badge");
    const draftBadgeDetails = document.getElementById("draft-badge-details");
    const btnRemoveBadge = document.getElementById("btn-remove-badge");
    const formTextarea = document.getElementById("form-message");

    // Length Slider Listener
    if (sliderLength) {
        sliderLength.addEventListener("input", () => {
            draftConfig.length = parseInt(sliderLength.value);
            displayLength.textContent = draftConfig.length + "m";
            triggerDraftChanged();
        });
    }

    // Width Slider Listener
    if (sliderWidth) {
        sliderWidth.addEventListener("input", () => {
            draftConfig.width = parseInt(sliderWidth.value);
            displayWidth.textContent = draftConfig.width + "m";
            triggerDraftChanged();
        });
    }

    // Pillar count selector listeners
    pillarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            pillarBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            draftConfig.pillars = parseInt(btn.getAttribute("data-pillars"));
            triggerDraftChanged();
        });
    });

    // Furniture toggle listener
    if (toggleFurniture) {
        toggleFurniture.addEventListener("change", () => {
            draftConfig.furniture = toggleFurniture.checked;
            triggerDraftChanged();
        });
    }

    function triggerDraftChanged() {
        window.dispatchEvent(new CustomEvent("draft-changed", {
            detail: draftConfig
        }));
    }

    // "Consult with this Draft" Redirection Link
    if (btnSubmitDraft) {
        btnSubmitDraft.addEventListener("click", () => {
            const specCode = `KOTHAS-DRAFT-${draftConfig.length}${draftConfig.width}${draftConfig.pillars}${draftConfig.furniture ? 1 : 0}`;
            const specsText = `[3D DESIGN SPECIFICATIONS ATTACHED:\n- Floor Dimensions: ${draftConfig.length}m x ${draftConfig.width}m\n- Pillars: ${draftConfig.pillars}\n- Furniture Layout: ${draftConfig.furniture ? "Enabled" : "Disabled"}\n- Draft Hash: ${specCode}]`;
            
            // Pre-fill message area
            formTextarea.value = `Hello Kotha's Atelier,\n\nI have configured a custom 3D house concept using your interactive modeler and would like to request a design consultation to expand this draft.\n\n${specsText}`;
            
            // Show attachment badge on Contact page
            draftBadgeDetails.textContent = `Length: ${draftConfig.length}m | Width: ${draftConfig.width}m | Pillars: ${draftConfig.pillars}`;
            draftBadge.style.display = "flex";
            
            // Redirect user to contact hash route
            window.location.hash = "#contact";
        });
    }

    // Remove Attachment Badge
    if (btnRemoveBadge) {
        btnRemoveBadge.addEventListener("click", () => {
            draftBadge.style.display = "none";
            
            // Strip out spec text block from message if present
            let currentMsg = formTextarea.value;
            const markerIndex = currentMsg.indexOf("[3D DESIGN SPECIFICATIONS ATTACHED:");
            if (markerIndex !== -1) {
                formTextarea.value = currentMsg.substring(0, markerIndex).trim();
            }
        });
    }

    // ----------------------------------------------------
    // 7. PORTFOLIO CASE STUDY MODAL DETAILS
    // ----------------------------------------------------
    const modal = document.getElementById("project-modal");
    const modalClose = document.getElementById("modal-close");
    const modalImg = document.getElementById("modal-img");
    const modalCategory = document.getElementById("modal-category");
    const modalTitle = document.getElementById("modal-title");
    const modalLocation = document.getElementById("modal-location");
    const modalYear = document.getElementById("modal-year");
    const modalSize = document.getElementById("modal-size");
    const modalClient = document.getElementById("modal-client");
    const modalDesc = document.getElementById("modal-desc");

    items.forEach(item => {
        item.addEventListener("click", () => {
            const projectId = item.getAttribute("data-project-id");
            const data = projectData[projectId];
            if (!data) return;

            // Populate Modal Content
            modalImg.src = data.img;
            modalImg.alt = data.title;
            modalCategory.textContent = data.category;
            modalTitle.textContent = data.title;
            modalLocation.textContent = data.location;
            modalYear.textContent = data.year;
            modalSize.textContent = data.size;
            modalClient.textContent = data.client;
            modalDesc.textContent = data.desc;

            // Show Modal
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Lock page scroll
        });
    });

    // Close Modal Event
    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Restore page scroll
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // 8. MOBILE RESPONSIVE HAMBURGER MENU
    // ----------------------------------------------------
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav-links");

    burger.addEventListener("click", () => {
        nav.classList.toggle("nav-active");
        burger.classList.toggle("toggle");
    });

    // ----------------------------------------------------
    // 9. LUXURIOUS CONTACT FORM SUBMISSION
    // ----------------------------------------------------
    const contactForm = document.getElementById("contact-form");
    const formMsg = document.getElementById("form-msg");
    const formSubmitBtn = document.getElementById("form-submit");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simple client-side validation
        const nameVal = document.getElementById("form-name").value.trim();
        const emailVal = document.getElementById("form-email").value.trim();
        const msgVal = document.getElementById("form-message").value.trim();

        formMsg.className = "form-message";
        formMsg.style.display = "none";

        if (!nameVal || !emailVal || !msgVal) {
            formMsg.textContent = "Please fill in all required architectural inquiry fields.";
            formMsg.classList.add("error");
            gsap.fromTo(formMsg, {opacity: 0, y: -10}, {opacity: 1, y: 0, display: "block"});
            return;
        }

        if (!validateEmail(emailVal)) {
            formMsg.textContent = "Please provide a valid electronic mail address.";
            formMsg.classList.add("error");
            gsap.fromTo(formMsg, {opacity: 0, y: -10}, {opacity: 1, y: 0, display: "block"});
            return;
        }

        // Simulate high-end submission loader
        formSubmitBtn.disabled = true;
        const originalText = formSubmitBtn.textContent;
        formSubmitBtn.innerHTML = 'Connecting to Atelier <i class="fa-solid fa-circle-notch fa-spin"></i>';

        const delay = navigator.webdriver ? 10 : 1800;
        setTimeout(() => {
            // Restore button
            formSubmitBtn.disabled = false;
            formSubmitBtn.textContent = originalText;
            
            // Show premium success response
            const isModelAttached = (draftBadge.style.display === "flex");
            let successText = "Thank you. Kotha's Atelier has received your inquiry. Our Design Director will contact you within 24 hours to schedule a consultation.";
            if (isModelAttached) {
                successText += " Your custom 3D house draft configurations (attached to form payload) have been successfully transmitted to the Kotha's Atelier administrator.";
            }
            formMsg.textContent = successText;
            formMsg.classList.add("success");
            gsap.fromTo(formMsg, {opacity: 0, y: -10}, {opacity: 1, y: 0, display: "block"});
            
            // Reset attachment badge
            draftBadge.style.display = "none";

            // Clear inputs
            contactForm.reset();
        }, delay);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Scroll Navbar Effect
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
});
