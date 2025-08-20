// Enhanced Portfolio JavaScript with Full Functionality
class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.isLoading = true;
        this.theme = localStorage.getItem('theme') || 'dark';
        this.resumeZoom = 1;
        this.resumeTranslateX = 0;
        this.resumeTranslateY = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.mobileMenuOpen = false;
        this.skillsAnimated = false;
        
        this.typingTexts = [
            'AI/ML Engineering Student',
            'Data Analytics Intern',
            'Full-Stack Developer',
            'Problem Solver',
            'Tech Enthusiast'
        ];
        this.currentTextIndex = 0;
        this.typingTimeout = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Portfolio App...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.initializeTheme();
        this.initializeLoading();
        this.initializeNavigation();
        this.initializeMobileMenu();
        this.initializeTypingEffect();
        this.initializeCSSPlayground();
        this.initializeSkillsAnimation();
        this.initializeResumeViewer();
        this.initializeContactForm();
        this.initializeScrollEffects();
        this.initializeToast();
        this.initializeThemeToggle();
        this.initializeKeyboardNavigation();
        this.initializeIntersectionObserver();
        this.initializeContactCopy();
        
        console.log('✅ Portfolio App initialized successfully');
    }

    // Theme Management
    initializeTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        this.updateThemeIcon();
        console.log('🎨 Theme initialized:', this.theme);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.theme = this.theme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-color-scheme', this.theme);
                localStorage.setItem('theme', this.theme);
                
                this.updateThemeIcon();
                this.showToast(`Switched to ${this.theme} mode`, 'success');
                
                console.log('🎨 Theme toggled to:', this.theme);
            });
        }
    }

    // Loading Screen
    initializeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            this.isLoading = false;
            this.startAnimations();
            console.log('✅ Loading completed');
        }, 2000);
    }

    startAnimations() {
        this.startTyping();
        if (this.currentSection === 'skills') {
            this.animateSkills();
        }
    }

    // Navigation System
    initializeNavigation() {
        console.log('🧭 Initializing navigation...');
        
        // Handle nav links
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        console.log('Found nav links:', navLinks.length);

        navLinks.forEach((link, index) => {
            const sectionId = link.dataset.section;
            console.log(`Nav link ${index}: ${sectionId}`);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicked nav link:', sectionId);
                this.navigateToSection(sectionId);
            });
        });

        // Handle CTA buttons
        const ctaButtons = document.querySelectorAll('[data-scroll-to]');
        console.log('Found CTA buttons:', ctaButtons.length);
        
        ctaButtons.forEach((button, index) => {
            const target = button.dataset.scrollTo;
            console.log(`CTA button ${index}: ${target}`);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('CTA button clicked, target:', target);
                this.navigateToSection(target);
            });
        });

        // Initialize with home section
        this.navigateToSection('home');
    }

    navigateToSection(sectionId) {
        console.log(`🧭 Navigating to section: ${sectionId}`);
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        // Update active section
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('✅ Section activated:', sectionId);
        } else {
            console.error('❌ Section not found:', sectionId);
            return;
        }

        this.currentSection = sectionId;

        // Trigger specific animations for sections
        setTimeout(() => {
            if (sectionId === 'skills' && !this.skillsAnimated) {
                this.animateSkills();
            }
        }, 300);

        // Close mobile menu if open
        this.closeMobileMenu();
    }

    // Mobile Menu
    initializeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        console.log('📱 Mobile menu initialized');
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (navMenu) {
            navMenu.classList.toggle('active', this.mobileMenuOpen);
        }
        
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active', this.mobileMenuOpen);
        }
        
        if (mobileToggle) {
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = this.mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
        
        console.log('📱 Mobile menu toggled:', this.mobileMenuOpen);
    }

    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            const navMenu = document.getElementById('nav-menu');
            const mobileOverlay = document.getElementById('mobile-overlay');
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            
            if (navMenu) navMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
            
            document.body.style.overflow = '';
            console.log('📱 Mobile menu closed');
        }
    }

    // Typing Effect
    initializeTypingEffect() {
        this.typingElement = document.getElementById('typing-text');
        console.log('⌨️ Typing effect initialized');
    }

    startTyping() {
        if (!this.typingElement || this.isLoading) return;

        const targetText = this.typingTexts[this.currentTextIndex];
        let currentText = '';
        let currentIndex = 0;

        const typeWriter = () => {
            if (currentIndex < targetText.length) {
                currentText += targetText.charAt(currentIndex);
                this.typingElement.textContent = currentText;
                currentIndex++;
                this.typingTimeout = setTimeout(typeWriter, 100);
            } else {
                this.typingTimeout = setTimeout(() => {
                    this.eraseText();
                }, 2000);
            }
        };

        typeWriter();
    }

    eraseText() {
        if (!this.typingElement) return;

        let currentText = this.typingElement.textContent;
        
        const eraser = () => {
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                this.typingElement.textContent = currentText;
                this.typingTimeout = setTimeout(eraser, 50);
            } else {
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
                this.typingTimeout = setTimeout(() => this.startTyping(), 500);
            }
        };

        eraser();
    }

    // CSS Playground
    initializeCSSPlayground() {
        console.log('🎨 Initializing CSS Playground...');
        this.initializeBoxShadowGenerator();
        this.initializeBorderRadiusGenerator();
        this.initializeGradientGenerator();
        this.initializeTextShadowGenerator();
        this.initializeCopyButtons();
        console.log('✅ CSS Playground initialized');
    }

    initializeBoxShadowGenerator() {
        const controls = {
            x: document.getElementById('shadow-x'),
            y: document.getElementById('shadow-y'),
            blur: document.getElementById('shadow-blur'),
            spread: document.getElementById('shadow-spread'),
            color: document.getElementById('shadow-color'),
            inset: document.getElementById('shadow-inset')
        };

        const preview = document.getElementById('shadow-preview');
        const codeOutput = document.getElementById('shadow-code');

        if (!preview || !codeOutput) {
            console.log('⚠️ Box shadow elements not found');
            return;
        }

        const updateShadow = () => {
            const x = controls.x?.value || 0;
            const y = controls.y?.value || 5;
            const blur = controls.blur?.value || 15;
            const spread = controls.spread?.value || 0;
            const color = controls.color?.value || '#000000';
            const inset = controls.inset?.checked ? 'inset ' : '';

            const shadowValue = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
            preview.style.boxShadow = shadowValue;
            codeOutput.value = `box-shadow: ${shadowValue};`;

            // Update value displays
            this.updateValueDisplay(controls.x, `${x}px`);
            this.updateValueDisplay(controls.y, `${y}px`);
            this.updateValueDisplay(controls.blur, `${blur}px`);
            this.updateValueDisplay(controls.spread, `${spread}px`);
        };

        // Add event listeners
        Object.values(controls).forEach(control => {
            if (control) {
                control.addEventListener('input', updateShadow);
                control.addEventListener('change', updateShadow);
            }
        });

        // Initial update
        updateShadow();
        console.log('✅ Box shadow generator initialized');
    }

    initializeBorderRadiusGenerator() {
        const controls = {
            tl: document.getElementById('radius-tl'),
            tr: document.getElementById('radius-tr'),
            br: document.getElementById('radius-br'),
            bl: document.getElementById('radius-bl')
        };

        const preview = document.getElementById('radius-preview');
        const codeOutput = document.getElementById('radius-code');

        if (!preview || !codeOutput) return;

        const updateRadius = () => {
            const tl = controls.tl?.value || 8;
            const tr = controls.tr?.value || 8;
            const br = controls.br?.value || 8;
            const bl = controls.bl?.value || 8;

            const radiusValue = `${tl}px ${tr}px ${br}px ${bl}px`;
            preview.style.borderRadius = radiusValue;
            codeOutput.value = `border-radius: ${radiusValue};`;

            // Update value displays
            this.updateValueDisplay(controls.tl, `${tl}px`);
            this.updateValueDisplay(controls.tr, `${tr}px`);
            this.updateValueDisplay(controls.br, `${br}px`);
            this.updateValueDisplay(controls.bl, `${bl}px`);
        };

        Object.values(controls).forEach(control => {
            if (control) {
                control.addEventListener('input', updateRadius);
                control.addEventListener('change', updateRadius);
            }
        });

        updateRadius();
        console.log('✅ Border radius generator initialized');
    }

    initializeGradientGenerator() {
        const controls = {
            angle: document.getElementById('gradient-angle'),
            color1: document.getElementById('gradient-color1'),
            color2: document.getElementById('gradient-color2')
        };

        const preview = document.getElementById('gradient-preview');
        const codeOutput = document.getElementById('gradient-code');

        if (!preview || !codeOutput) return;

        const updateGradient = () => {
            const angle = controls.angle?.value || 90;
            const color1 = controls.color1?.value || '#667eea';
            const color2 = controls.color2?.value || '#764ba2';

            const gradientValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
            preview.style.background = gradientValue;
            codeOutput.value = `background: ${gradientValue};`;

            this.updateValueDisplay(controls.angle, `${angle}deg`);
        };

        Object.values(controls).forEach(control => {
            if (control) {
                control.addEventListener('input', updateGradient);
                control.addEventListener('change', updateGradient);
            }
        });

        updateGradient();
        console.log('✅ Gradient generator initialized');
    }

    initializeTextShadowGenerator() {
        const controls = {
            x: document.getElementById('text-shadow-x'),
            y: document.getElementById('text-shadow-y'),
            blur: document.getElementById('text-shadow-blur'),
            color: document.getElementById('text-shadow-color'),
            textColor: document.getElementById('text-color')
        };

        const preview = document.getElementById('text-shadow-preview');
        const codeOutput = document.getElementById('text-shadow-code');

        if (!preview || !codeOutput) return;

        const updateTextShadow = () => {
            const x = controls.x?.value || 2;
            const y = controls.y?.value || 2;
            const blur = controls.blur?.value || 4;
            const shadowColor = controls.color?.value || '#000000';
            const textColor = controls.textColor?.value || '#333333';

            const shadowValue = `${x}px ${y}px ${blur}px ${shadowColor}`;
            const textElement = preview.querySelector('span');
            if (textElement) {
                textElement.style.textShadow = shadowValue;
                textElement.style.color = textColor;
            }
            codeOutput.value = `text-shadow: ${shadowValue};\ncolor: ${textColor};`;

            this.updateValueDisplay(controls.x, `${x}px`);
            this.updateValueDisplay(controls.y, `${y}px`);
            this.updateValueDisplay(controls.blur, `${blur}px`);
        };

        Object.values(controls).forEach(control => {
            if (control) {
                control.addEventListener('input', updateTextShadow);
                control.addEventListener('change', updateTextShadow);
            }
        });

        updateTextShadow();
        console.log('✅ Text shadow generator initialized');
    }

    updateValueDisplay(control, value) {
        if (control && control.parentNode) {
            const valueDisplay = control.parentNode.querySelector('.value-display');
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
        }
    }

    initializeCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        console.log('📋 Found copy buttons:', copyButtons.length);
        
        copyButtons.forEach((button, index) => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = button.dataset.target;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement && targetElement.value) {
                    try {
                        await navigator.clipboard.writeText(targetElement.value);
                        button.classList.add('copied');
                        button.innerHTML = '<i class="fas fa-check"></i>';
                        this.showToast('CSS code copied to clipboard!', 'success');
                        
                        setTimeout(() => {
                            button.classList.remove('copied');
                            button.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                        
                        console.log('✅ Copied CSS code from button', index);
                    } catch (err) {
                        console.error('❌ Failed to copy:', err);
                        this.showToast('Failed to copy code', 'error');
                    }
                } else {
                    console.error('❌ Target element not found or has no value:', targetId);
                }
            });
        });
    }

    // Skills Animation
    initializeSkillsAnimation() {
        this.skillsAnimated = false;
        console.log('📊 Skills animation initialized');
    }

    animateSkills() {
        if (this.skillsAnimated) return;

        const skillItems = document.querySelectorAll('.skill-item');
        console.log('📊 Animating skills:', skillItems.length);
        
        skillItems.forEach((item, index) => {
            const skillLevel = parseInt(item.dataset.skill) || 0;
            const skillProgress = item.querySelector('.skill-progress');
            const skillPercentage = item.querySelector('.skill-percentage');
            
            if (skillProgress && skillPercentage) {
                setTimeout(() => {
                    skillProgress.style.width = `${skillLevel}%`;
                    this.animateCounter(skillPercentage, skillLevel);
                }, index * 200);
            }
        });

        this.skillsAnimated = true;
        console.log('✅ Skills animated');
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `${Math.floor(current)}%`;
        }, 30);
    }

    // Resume Viewer with Zoom and Pan
    initializeResumeViewer() {
        const resumeImage = document.getElementById('resume-image');
        const resumeViewer = document.getElementById('resume-viewer');
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const resetZoomBtn = document.getElementById('reset-zoom');

        if (!resumeImage || !resumeViewer) {
            console.log('⚠️ Resume viewer elements not found');
            return;
        }

        // Zoom controls
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.zoomResume(0.2);
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.zoomResume(-0.2);
            });
        }

        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetResumeZoom();
            });
        }

        // Mouse wheel zoom
        resumeViewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoomResume(zoomDelta);
        });

        // Touch/Drag pan functionality
        this.initializeResumePan(resumeImage, resumeViewer);

        console.log('📄 Resume viewer initialized');
    }

    zoomResume(delta) {
        this.resumeZoom = Math.max(0.5, Math.min(3, this.resumeZoom + delta));
        this.updateResumeTransform();
        console.log('🔍 Resume zoom:', this.resumeZoom);
    }

    resetResumeZoom() {
        this.resumeZoom = 1;
        this.resumeTranslateX = 0;
        this.resumeTranslateY = 0;
        this.updateResumeTransform();
        
        const resumeViewer = document.getElementById('resume-viewer');
        if (resumeViewer) {
            resumeViewer.scrollLeft = 0;
            resumeViewer.scrollTop = 0;
        }
        console.log('🔄 Resume zoom reset');
    }

    updateResumeTransform() {
        const resumeImage = document.getElementById('resume-image');
        if (resumeImage) {
            resumeImage.style.transform = `scale(${this.resumeZoom}) translate(${this.resumeTranslateX}px, ${this.resumeTranslateY}px)`;
        }
    }

    initializeResumePan(image, viewer) {
        let startX, startY, scrollLeft, scrollTop;

        const startDrag = (e) => {
            this.isDragging = true;
            image.style.cursor = 'grabbing';
            
            if (e.type === 'mousedown') {
                startX = e.pageX - viewer.offsetLeft;
                startY = e.pageY - viewer.offsetTop;
            } else if (e.type === 'touchstart') {
                startX = e.touches[0].pageX - viewer.offsetLeft;
                startY = e.touches[0].pageY - viewer.offsetTop;
            }
            
            scrollLeft = viewer.scrollLeft;
            scrollTop = viewer.scrollTop;
        };

        const drag = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            
            let x, y;
            if (e.type === 'mousemove') {
                x = e.pageX - viewer.offsetLeft;
                y = e.pageY - viewer.offsetTop;
            } else if (e.type === 'touchmove') {
                x = e.touches[0].pageX - viewer.offsetLeft;
                y = e.touches[0].pageY - viewer.offsetTop;
            }
            
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            viewer.scrollLeft = scrollLeft - walkX;
            viewer.scrollTop = scrollTop - walkY;
        };

        const endDrag = () => {
            this.isDragging = false;
            image.style.cursor = 'grab';
        };

        // Mouse events
        image.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Touch events
        image.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    // Contact Form with Validation
    initializeContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) {
            console.log('⚠️ Contact form not found');
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.submitForm(form);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Clear error state on input
                const formGroup = input.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                }
            });
        });

        console.log('📧 Contact form initialized');
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove existing error state
        formGroup.classList.remove('error');

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        } else if (field.name === 'name' && field.value && field.value.length < 2) {
            isValid = false;
            message = 'Name must be at least 2 characters long';
        } else if (field.name === 'message' && field.value && field.value.length < 10) {
            isValid = false;
            message = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        }

        return isValid;
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.delay(2000);
            
            this.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Remove any error states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            console.log('✅ Contact form submitted successfully');
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Contact Copy Functionality
    initializeContactCopy() {
        const copyButtons = document.querySelectorAll('.copy-contact-btn');
        console.log('📞 Found contact copy buttons:', copyButtons.length);
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const contactCard = button.closest('.contact-card');
                const copyText = contactCard.dataset.copy;
                
                if (copyText) {
                    try {
                        await navigator.clipboard.writeText(copyText);
                        button.classList.add('copied');
                        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        this.showToast(`${copyText} copied to clipboard!`, 'success');
                        
                        setTimeout(() => {
                            button.classList.remove('copied');
                            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                        
                        console.log('✅ Contact info copied:', copyText);
                    } catch (err) {
                        console.error('❌ Failed to copy contact info:', err);
                        this.showToast('Failed to copy contact information', 'error');
                    }
                }
            });
        });
    }

    // Scroll Effects
    initializeScrollEffects() {
        const backToTopBtn = document.getElementById('back-to-top');
        const scrollProgress = backToTopBtn?.querySelector('.scroll-progress');

        const updateScrollEffects = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            // Back to top button
            if (scrollTop > 300 && backToTopBtn) {
                backToTopBtn.classList.add('visible');
            } else if (backToTopBtn) {
                backToTopBtn.classList.remove('visible');
            }

            // Update scroll progress
            if (scrollProgress) {
                scrollProgress.style.setProperty('--scroll-progress', `${scrollPercent}%`);
            }
        };

        // Throttle scroll events for performance
        const throttledScrollHandler = this.throttle(updateScrollEffects, 16);
        window.addEventListener('scroll', throttledScrollHandler);
        
        // Initial call
        updateScrollEffects();

        // Back to top click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('⬆️ Scrolled to top');
            });
        }

        console.log('📜 Scroll effects initialized');
    }

    // Intersection Observer for animations
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card, .highlight-card, .project-card, .timeline-item').forEach(element => {
            observer.observe(element);
        });

        console.log('👁️ Intersection observer initialized');
    }

    // Toast Notifications
    initializeToast() {
        this.toastElement = document.getElementById('toast');
        this.toastTimeout = null;
        
        // Close button functionality
        const closeButton = this.toastElement?.querySelector('.toast-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideToast();
            });
        }
        
        console.log('🍞 Toast system initialized');
    }

    showToast(message, type = 'info') {
        if (!this.toastElement) return;

        const toastIcon = this.toastElement.querySelector('.toast-icon');
        const toastMessage = this.toastElement.querySelector('.toast-message');

        // Clear existing timeout
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        if (toastIcon) toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
        if (toastMessage) toastMessage.textContent = message;
        
        this.toastElement.className = `toast ${type}`;

        // Show toast
        this.toastElement.classList.add('show');

        // Auto hide after 4 seconds
        this.toastTimeout = setTimeout(() => {
            this.hideToast();
        }, 4000);
        
        console.log(`🍞 Toast shown: ${message} (${type})`);
    }

    hideToast() {
        if (this.toastElement) {
            this.toastElement.classList.remove('show');
        }
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }
    }

    // Keyboard Navigation
    initializeKeyboardNavigation() {
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'css-playground', 'resume', 'contact'];
        let currentIndex = 0;

        document.addEventListener('keydown', (e) => {
            // Only handle keys when not in form elements
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    currentIndex = Math.max(0, currentIndex - 1);
                    this.navigateToSection(sections[currentIndex]);
                    break;
                    
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    currentIndex = Math.min(sections.length - 1, currentIndex + 1);
                    this.navigateToSection(sections[currentIndex]);
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    currentIndex = 0;
                    this.navigateToSection(sections[currentIndex]);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    currentIndex = sections.length - 1;
                    this.navigateToSection(sections[currentIndex]);
                    break;
                    
                case 'Escape':
                    this.closeMobileMenu();
                    break;
            }
        });

        console.log('⌨️ Keyboard navigation initialized');
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application
console.log('🎯 Initializing Portfolio Application...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioApp();
    });
} else {
    new PortfolioApp();
}

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👀 Page is now visible');
    } else {
        console.log('🙈 Page is now hidden');
    }
});

// Handle errors
window.addEventListener('error', (e) => {
    console.error('❌ Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled promise rejection:', e.reason);
});

console.log('✅ Portfolio JavaScript loaded successfully');
