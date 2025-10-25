document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const portfolioApp = {
        // --- General Elements & State ---
        elements: {
            header: document.getElementById('header'),
            sections: document.querySelectorAll('.section'),
            navLinks: document.querySelectorAll('.nav-link'),
            backToTopButton: document.getElementById('back-to-top'),
            scrollProgress: document.querySelector('#back-to-top .scroll-progress'),
        },
        isManualNavigating: false, // New state to prevent observer interference during manual navigation

        // --- Initialization ---
        init() {
            // Defensive: ensure basic elements query succeeded
            this.elements.sections = this.elements.sections || document.querySelectorAll('.section');
            this.elements.navLinks = this.elements.navLinks || document.querySelectorAll('.nav-link');

            // Bind waitForScrollEnd to the app context
            this.waitForScrollEnd = this.waitForScrollEnd.bind(this); // Keep this binding

            const startTime = Date.now(); // Record start time for loading screen

            this.setupEventListeners();
            if (this.loadingScreen && typeof this.loadingScreen.init === 'function') this.loadingScreen.init(); // Initialize loading screen early
            this.observeSections();
            if (this.navigation && typeof this.navigation.init === 'function') this.navigation.init();
            if (this.theme && typeof this.theme.init === 'function') this.theme.init();
            if (this.typingEffect && typeof this.typingEffect.init === 'function') this.typingEffect.init();
            // Initialize highlighter early, but its initial position will be set by showInitialSection
            if (this.highlighter && typeof this.highlighter.init === 'function') this.highlighter.init();
            if (this.skills && typeof this.skills.init === 'function') this.skills.init();
            if (this.projects && typeof this.projects.init === 'function') this.projects.init();
            if (this.resume && typeof this.resume.init === 'function') this.resume.init();
            if (this.contact && typeof this.contact.init === 'function') this.contact.init();

            // Hide loading screen after all assets are loaded
            window.addEventListener('load', () => {
                const elapsedTime = Date.now() - startTime;
                const minimumTime = 2000; // 2 seconds
                const remainingTime = Math.max(0, minimumTime - elapsedTime);

                setTimeout(() => {
                    if (this.loadingScreen && typeof this.loadingScreen.hide === 'function') {
                        this.loadingScreen.hide();
                    }
                    // After loading screen is hidden, show the initial section
                    this.showInitialSection();
                }, remainingTime);
            });
        },

        // --- Initial Section based on URL Hash ---
        showInitialSection() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.navigateTo(hash, true); // true for isInitialLoad
            } else {
                // If no hash, ensure at least one section has active class
                const active = document.querySelector('.section.active');
                if (!active && this.elements.sections && this.elements.sections.length) {
                    this.elements.sections[0].classList.add('active');
                    const firstNavLink = document.querySelector('.nav-link[data-section="home"]');
                    if (firstNavLink) firstNavLink.classList.add('active');
                }
            }
        },

        // --- Global Event Listeners (using delegation) ---
        setupEventListeners() {
            window.addEventListener('scroll', () => {
                this.handleScroll();
            });

            if (this.elements.backToTopButton) {
                this.elements.backToTopButton.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            // Handle popstate so back/forward updates active section
            window.addEventListener('popstate', () => {
                const hash = window.location.hash.substring(1);
                if (hash) this.navigateTo(hash, true);
            });
        },

        // --- Scroll Handling ---
        handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

            // Back to top button visibility
            if (this.elements.backToTopButton) {
                if (scrollY > 300) {
                    this.elements.backToTopButton.classList.add('visible');
                } else {
                    this.elements.backToTopButton.classList.remove('visible');
                }
            }

            // Scroll progress indicator
            if (this.elements.scrollProgress) {
                this.elements.scrollProgress.style.setProperty('--scroll-progress', scrollPercent / 100);
            }
        },

        // --- Section Observer for Active Nav Link ---
        observeSections() {
            try {
                if (!this.elements.sections || !this.elements.sections.length) return;
                this.observer = new IntersectionObserver(this.observerCallback.bind(this), { threshold: 0.5 });
                this.elements.sections.forEach(section => this.observer.observe(section));
            } catch (err) {
                console.warn('Failed to create observer:', err);
            }
        },

        showToast(message, type = 'success') { // --- Toast Notifications ---
            const toast = document.getElementById('toast');
            if (!toast) return;

            const icon = toast.querySelector('.toast-icon');
            const messageEl = toast.querySelector('.toast-message');

            toast.className = 'toast'; // Reset classes
            toast.classList.add(type, 'show');
            messageEl.textContent = message;

            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                info: 'fa-info-circle'
            };
            if (icon) icon.className = `toast-icon fas ${icons[type] || icons.info}`;

            setTimeout(() => toast.classList.remove('show'), 3000);
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) closeBtn.onclick = () => toast.classList.remove('show');
        },

        // --- MODULE: Navigation ---
        navigation: {
            init() {
                this.navMenu = document.getElementById('nav-menu');
                this.mobileToggle = document.getElementById('mobile-menu-toggle');
                this.mobileOverlay = document.getElementById('mobile-overlay');

                document.addEventListener('click', e => {
                    // Nav link clicks
                    const navLink = e.target.closest('.nav-link');
                    if (navLink) {
                        e.preventDefault();
                        // Call navigateTo with the section ID
                        portfolioApp.navigateTo(navLink.dataset.section);
                        return;
                    }
                    // Scroll-to button clicks
                    const scrollToBtn = e.target.closest('[data-scroll-to]');
                    if (scrollToBtn) {
                        portfolioApp.navigateTo(scrollToBtn.dataset.scrollTo);
                        return;
                    }
                    // Mobile menu toggle
                    if (e.target.closest('#mobile-menu-toggle')) {
                        this.toggleMobileMenu();
                        return;
                    }
                    // Mobile overlay click
                    if (this.mobileOverlay && e.target === this.mobileOverlay) {
                        this.toggleMobileMenu(false);
                    }
                });
            },
            toggleMobileMenu(forceState) {
                if (!this.navMenu) return;
                const show = forceState !== undefined ? forceState : !this.navMenu.classList.contains('active');
                this.navMenu.classList.toggle('active', show);
                if (this.mobileOverlay) this.mobileOverlay.classList.toggle('active', show);
                if (this.mobileToggle && this.mobileToggle.querySelector('i')) {
                    this.mobileToggle.querySelector('i').className = show ? 'fas fa-times' : 'fas fa-bars';
                }
            }
        },

        // --- MODULE: Navigation Highlighter ---
        highlighter: {
            init() {
                this.navMenu = document.getElementById('nav-menu');
                this.highlighterEl = this.navMenu ? this.navMenu.querySelector('.nav-highlighter') : null;
                this.navLinks = this.navMenu ? this.navMenu.querySelectorAll('.nav-link') : [];

                if (!this.highlighterEl || !this.navLinks.length) return;

                this.navLinks.forEach(link => {
                    link.addEventListener('mouseenter', () => this.move(link));
                });

                this.navMenu.addEventListener('mouseleave', () => {
                    const activeLink = this.navMenu.querySelector('.nav-link.active');
                    if (activeLink) this.move(activeLink);
                });

            },
            move(targetLink) {
                if (!this.highlighterEl || !targetLink) return;

                const targetRect = targetLink.getBoundingClientRect();
                const menuRect = this.navMenu.getBoundingClientRect();

                this.highlighterEl.style.width = `${targetRect.width}px`;
                this.highlighterEl.style.left = `${targetRect.left - menuRect.left}px`;
            }
        },

        // --- MODULE: Loading Screen (Flame Animation) ---
        loadingScreen: {
            canvas: null,
            ctx: null,
            animationFrameId: null,
            fps: 4,
            interval: 0, // Will be calculated in init
            prev: 0,
            y: [2, 1, 0, 0, 0, 0, 1, 2],
            max: [7, 9, 11, 13, 13, 11, 9, 7],
            min: [4, 7, 8, 10, 10, 8, 7, 4],

            outerColor: '#d14234', // Default fallback
            middleColor: '#f2a55f',
            innerColor: '#e8dec5',
            init() {
                this.canvas = document.getElementById("c");
                if (!this.canvas) {
                    console.warn("Canvas element 'c' not found for loading screen.");
                    return;
                }
                this.ctx = this.canvas.getContext("2d");
                this.ctx.translate(0, 16);
                this.ctx.scale(1, -1);

                // Get colors from CSS variables
                const styles = getComputedStyle(document.documentElement);
                this.outerColor = styles.getPropertyValue('--color-red-400').trim() || this.outerColor;
                this.middleColor = styles.getPropertyValue('--color-orange-400').trim() || this.middleColor;
                this.innerColor = styles.getPropertyValue('--color-rose-300').trim() || this.innerColor;

                this.interval = 1000 / this.fps;
                this.prev = Date.now();
                this.flame(); // Start the animation
            },

            flame() {
                const now = Date.now();
                const dif = now - this.prev;

                if (dif > this.interval) {
                    this.prev = now;

                    this.ctx.clearRect(0, 0, 360, 360);

                    this.ctx.strokeStyle = this.outerColor;
                    let i = 0;
                    for (let x = 4; x < 12; x++) {
                        const a = Math.random() * (this.max[i] - this.min[i] + 1) + this.min[i];
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + 0.5, this.y[i++]);
                        this.ctx.lineTo(x + 0.5, a);
                        this.ctx.stroke();
                    }

                    this.ctx.strokeStyle = this.middleColor;
                    let j = 1;
                    for (let x = 5; x < 11; x++) {
                        const a = Math.random() * (this.max[j] - 5 - (this.min[j] - 5) + 1) + (this.min[j] - 5);
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + 0.5, this.y[j++] + 1);
                        this.ctx.lineTo(x + 0.5, a);
                        this.ctx.stroke();
                    }

                    this.ctx.strokeStyle = this.innerColor;
                    let k = 3;
                    for (let x = 7; x < 9; x++) {
                        const a = Math.random() * (this.max[k] - 9 - (this.min[k] - 9) + 1) + (this.min[k] - 9);
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + 0.5, this.y[k++]);
                        this.ctx.lineTo(x + 0.5, a);
                        this.ctx.stroke();
                    }
                }
                this.animationFrameId = window.requestAnimationFrame(() => this.flame());
            },

            hide() {
                const loadingScreenEl = document.getElementById('loading-screen');
                if (loadingScreenEl) {
                    loadingScreenEl.classList.add('hidden');
                    // Stop the animation when hidden
                    if (this.animationFrameId) {
                        window.cancelAnimationFrame(this.animationFrameId);
                        this.animationFrameId = null;
                    }
                    // Remove the element from DOM after transition
                    loadingScreenEl.addEventListener('transitionend', () => {
                        loadingScreenEl.remove();
                    }, { once: true });
                }
            }
        },

        async navigateTo(sectionId, isInitialLoad = false) {
            if (!sectionId) return;
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) return;

            // Set flag to prevent observer from interfering with manual navigation
            this.isManualNavigating = true;

            // Update nav links active state
            if (this.elements.navLinks && this.elements.navLinks.length) {
                this.elements.navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === sectionId);
                });
            }
            if (this.highlighter && typeof this.highlighter.move === 'function') { // Check if highlighter module exists
                this.highlighter.move(document.querySelector(`.nav-link[data-section="${sectionId}"]`)); // Move highlighter to the newly active link
            }

            // Switch the active section
            document.querySelectorAll('.section.active').forEach(s => s.classList.remove('active'));
            targetSection.classList.add('active');

            // Scroll to the target section smoothly
            targetSection.scrollIntoView({ behavior: 'smooth' });

            if (!isInitialLoad) {
                history.pushState(null, null, `#${sectionId}`);
            }

            // If mobile menu is open, close it
            if (this.navigation && this.navigation.navMenu && this.navigation.navMenu.classList.contains('active')) {
                this.navigation.toggleMobileMenu(false);
            }

            // Restart typing effect if navigating back to home
            if (sectionId === 'home' && this.typingEffect && typeof this.typingEffect.init === 'function') {
                this.typingEffect.init();
            }

            // Reset the manual navigation flag after scroll finish
            await this.waitForScrollEnd();
            setTimeout(() => {
                this.isManualNavigating = false;
            }, 50);
        },

        // Utility to wait for scroll to finish
        waitForScrollEnd() {
            return new Promise(resolve => {
                let lastScrollY = window.scrollY;
                let scrollTimeout;

                const checkScroll = () => {
                    const currentScrollY = window.scrollY;
                    if (currentScrollY === lastScrollY) {
                        clearTimeout(scrollTimeout);
                        window.removeEventListener('scroll', checkScroll);
                        resolve();
                    } else {
                        lastScrollY = currentScrollY;
                        scrollTimeout = setTimeout(checkScroll, 100); // Check every 100ms
                    }
                };
                window.addEventListener('scroll', checkScroll);
                scrollTimeout = setTimeout(checkScroll, 50); // Initial check
            });
        },

        observerCallback(entries) {
            // Only update nav links if not currently performing a manual navigation
            if (this.isManualNavigating) {
                return;
            }
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const activeSectionId = entry.target.getAttribute('id');
                    if (this.elements.navLinks && this.elements.navLinks.length) {
                        let newActiveLink = null;
                        this.elements.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.dataset.section === activeSectionId) {
                                link.classList.add('active');
                                newActiveLink = link;
                            }
                        });
                        // Move highlighter when observer changes active link
                        if (this.highlighter && typeof this.highlighter.move === 'function' && newActiveLink) {
                            this.highlighter.move(newActiveLink);
                        }
                    }
                }
            });
        },

        // --- MODULE: Theme Toggle ---
        theme: {
            init() {
                this.toggleButton = document.getElementById('theme-toggle');
                if (!this.toggleButton) return;
                this.icon = this.toggleButton.querySelector('i');
                this.currentTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                this.applyTheme(this.currentTheme);

                this.toggleButton.addEventListener('click', () => {
                    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                    this.applyTheme(this.currentTheme);
                    localStorage.setItem('theme', this.currentTheme);
                });
            },
            applyTheme(theme) {
                document.documentElement.setAttribute('data-color-scheme', theme);
                if (this.icon) this.icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        },

        // --- MODULE: Typing Effect ---
        typingEffect: {
            init() {
                this.element = document.getElementById('typing-text');
                if (!this.element) return;
                this.words = ["AI/ML Engineer", "Web Developer", "Data Analyst", "Problem Solver"];
                this.wordIndex = 0;
                this.charIndex = 0;
                this.isDeleting = false;

                // Ensure any prior timers won't conflict by using a stable loop
                if (this._typingTimer) clearTimeout(this._typingTimer);
                this._typingLoop();
            },
            _typingLoop() {
                // Stop the effect if the home section is not active
                if (!document.getElementById('home') || !document.getElementById('home').classList.contains('active')) {
                    return;
                }
                const currentWord = this.words[this.wordIndex];
                const speed = this.isDeleting ? 75 : 150;
                this.element.textContent = currentWord.substring(0, this.charIndex);

                if (this.isDeleting) {
                    this.charIndex = Math.max(0, this.charIndex - 1);
                } else {
                    this.charIndex = Math.min(currentWord.length, this.charIndex + 1);
                }

                if (!this.isDeleting && this.charIndex === currentWord.length) {
                    this.isDeleting = true;
                    this._typingTimer = setTimeout(() => this._typingLoop(), 2000);
                    return;
                } else if (this.isDeleting && this.charIndex === 0) {
                    this.isDeleting = false;
                    this.wordIndex = (this.wordIndex + 1) % this.words.length;
                }
                this._typingTimer = setTimeout(() => this._typingLoop(), speed);
            }
        },

        // --- MODULE: Skills Animation ---
        skills: {
            init() { // --- MODULE: Skills Animation ---
                try {
                    const canvas = document.getElementById('skill-canvas');
                    if (!canvas || typeof TagCanvas === 'undefined') {
                        if (canvas) canvas.style.display = 'none';
                        return;
                    }

                    const isDarkMode = () => document.documentElement.getAttribute('data-color-scheme') === 'dark';

                    const options = {
                        textColour: isDarkMode() ? '#CBD5E1' : '#2D3748',
                        outlineColour: 'transparent',
                        reverse: true,
                        depth: 0.8,
                        maxSpeed: 0.05,
                        initial: [0.05, -0.05],
                        weight: true,
                        weightMode: 'size',
                        weightSize: 1.2,
                        dragControl: true,
                        noSelect: true,
                    };

                    TagCanvas.Start('skill-canvas', 'skill-tags', options);
                } catch (e) {
                    console.warn("Skill canvas failed to start:", e);
                }
            }
        },

        // --- MODULE: Projects ---
        projects: {
            init() {
                this.colorizeTechTags();
            },
            colorizeTechTags() {
                const projectCards = document.querySelectorAll('.project-card');
                const colorClasses = [
                    'var(--color-bg-1)', 'var(--color-bg-2)', 'var(--color-bg-3)', 
                    'var(--color-bg-4)', 'var(--color-bg-5)', 'var(--color-bg-6)', 
                    'var(--color-bg-7)', 'var(--color-bg-8)'
                ];

                projectCards.forEach(card => {
                    const tags = card.querySelectorAll('.tech-tag');
                    tags.forEach((tag, index) => {
                        tag.style.backgroundColor = colorClasses[index % colorClasses.length];
                    });
                });
            }
        },

        // --- MODULE: Resume Viewer ---
        resume: {
            init() {
                this.viewer = document.getElementById('resume-viewer');
                this.image = document.getElementById('resume-image');
                if (!this.viewer || !this.image) return;

                this.scale = 1;
                this.panning = false;
                this.pointX = 0;
                this.pointY = 0;
                this.start = { x: 0, y: 0 };

                const zoomIn = document.getElementById('zoom-in');
                const zoomOut = document.getElementById('zoom-out');
                const resetZoom = document.getElementById('reset-zoom');

                if (zoomIn) zoomIn.addEventListener('click', () => this.zoom(1.2));
                if (zoomOut) zoomOut.addEventListener('click', () => this.zoom(1 / 1.2));
                if (resetZoom) resetZoom.addEventListener('click', () => this.reset());

                this.viewer.addEventListener('wheel', e => {
                    e.preventDefault();
                    this.zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1);
                });
                this.viewer.addEventListener('mousedown', e => this.startPan(e));
                this.viewer.addEventListener('mouseup', () => this.endPan());
                this.viewer.addEventListener('mouseleave', () => this.endPan());
                this.viewer.addEventListener('mousemove', e => this.pan(e));
            },
            setTransform() {
                if (this.image) this.image.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
            },
            zoom(factor) {
                this.scale = Math.max(0.5, Math.min(this.scale * factor, 5));
                this.setTransform();
            },
            reset() {
                this.scale = 1;
                this.pointX = 0;
                this.pointY = 0;
                this.setTransform();
            },
            startPan(e) {
                e.preventDefault();
                this.panning = true;
                this.start = { x: e.clientX - this.pointX, y: e.clientY - this.pointY };
            },
            endPan() {
                this.panning = false;
            },
            pan(e) {
                if (!this.panning) return;
                e.preventDefault();
                this.pointX = e.clientX - this.start.x;
                this.pointY = e.clientY - this.start.y;
                this.setTransform();
            }
        },

        // --- MODULE: Contact ---
        contact: {
            init() {
                this.form = document.getElementById('contact-form');
                if (this.form) {
                    this.form.addEventListener('submit', e => this.handleSubmit(e));
                }

                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.addEventListener('click', e => {
                        const copyBtn = e.target.closest('.copy-contact-btn');
                        if (copyBtn) {
                            const card = copyBtn.closest('.contact-card');
                            const textToCopy = card ? card.dataset.copy : '';
                            if (!textToCopy) return;
                            navigator.clipboard.writeText(textToCopy).then(() => {
                                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                                copyBtn.classList.add('copied');
                                portfolioApp.showToast(`'${textToCopy}' copied!`);
                                setTimeout(() => {
                                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                                    copyBtn.classList.remove('copied');
                                }, 2000);
                            }).catch(() => {
                                portfolioApp.showToast('Copy failed.', 'error');
                            });
                        }
                    });
                }
            },
            validateField(field) {
                const errorEl = field.nextElementSibling;
                let valid = true;
                let message = '';

                if (field.required && !field.value.trim()) {
                    valid = false;
                    message = 'This field is required.';
                } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
                    valid = false;
                    message = 'Please enter a valid email address.';
                }

                if (field.parentElement) field.parentElement.classList.toggle('error', !valid);
                if (errorEl) errorEl.textContent = message;
                return valid;
            },
            handleSubmit(e) {
                e.preventDefault();
                const fields = this.form.querySelectorAll('[required]');
                let isFormValid = true;

                fields.forEach(field => {
                    if (!this.validateField(field)) {
                        isFormValid = false;
                    }
                });

                if (isFormValid) {
                    // In a real app, you would send this data to a server.
                    // For this demo, we'll just simulate success.
                    console.log('Form submitted:', new FormData(this.form));
                    portfolioApp.showToast('Message sent successfully!', 'success');
                    this.form.reset();
                } else {
                    portfolioApp.showToast('Please correct the errors in the form.', 'error');
                }
            }
        }
    }; // end portfolioApp

    // --- Run the App ---
    portfolioApp.init();
}); // DOMContentLoaded end
