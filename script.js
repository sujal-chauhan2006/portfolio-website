document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const themeToggle = document.getElementById('themeToggle');

    // Theme toggle handling
    const updateThemeIcon = (theme) => {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };

    // Sync button state with active theme
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(activeTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // System color scheme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    });

    // Close menu on link click
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight + 30;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const handleScroll = () => {
        const scrollY = window.scrollY;

        navbar.classList.toggle('scrolled', scrollY > 20);
        scrollTopBtn.classList.toggle('visible', scrollY > 400);

        // Active nav link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll reveal animations with stagger
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent
                    ? [...parent.querySelectorAll('.slide-up:not(.visible)')]
                    : [];

                const index = siblings.indexOf(entry.target);
                const delay = index >= 0 ? index * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate form input before submitting
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const btn = contactForm.querySelector('button');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            fetch("https://formsubmit.co/ajax/sjchauhan2006@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Form submission failed');
            })
            .then(data => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.backgroundColor = '#10B981';
                btn.style.borderColor = '#10B981';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to Send';
                btn.style.backgroundColor = '#EF4444';
                btn.style.borderColor = '#EF4444';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // Project accordion toggle logic
    const toggleButtons = document.querySelectorAll('.project-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            const collapseSection = card.querySelector('.project-details-collapse');
            const isCurrentlyExpanded = btn.getAttribute('aria-expanded') === 'true';

            if (!isCurrentlyExpanded) {
                // Close all other open project collapses first
                toggleButtons.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        const otherCard = otherBtn.closest('.project-card');
                        const otherCollapse = otherCard.querySelector('.project-details-collapse');
                        
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherBtn.classList.remove('active');
                        otherCollapse.classList.remove('open');
                        otherCollapse.style.maxHeight = '0px';
                        otherBtn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
                    }
                });

                // Open this one
                btn.setAttribute('aria-expanded', 'true');
                btn.classList.add('active');
                collapseSection.classList.add('open');
                collapseSection.style.maxHeight = collapseSection.scrollHeight + 'px';
                btn.innerHTML = 'Hide Details <i class="fas fa-chevron-down"></i>';
            } else {
                // Close this one
                btn.setAttribute('aria-expanded', 'false');
                btn.classList.remove('active');
                collapseSection.classList.remove('open');
                collapseSection.style.maxHeight = '0px';
                btn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
            }
        });
    });

    // Resume Preview Modal Logic
    const resumeModal = document.getElementById('resumeModal');
    const resumeOverlay = document.getElementById('resumeModalOverlay');
    const closeResumeBtn = document.getElementById('closeResumeModal');
    const openResumeTriggers = document.querySelectorAll('.open-resume-trigger');
    const printBtnHeader = document.getElementById('printResumeBtn');
    const printBtnFooter = document.getElementById('printResumeBtnFooter');

    const openResumeModal = (e) => {
        if (e) e.preventDefault();
        if (!resumeModal) return;

        resumeModal.removeAttribute('hidden');
        // Force reflow for smooth animation transition
        void resumeModal.offsetWidth;
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeResumeModal = () => {
        if (!resumeModal) return;

        resumeModal.classList.remove('active');
        setTimeout(() => {
            resumeModal.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }, 300);
    };

    openResumeTriggers.forEach(trigger => {
        trigger.addEventListener('click', openResumeModal);
    });

    if (closeResumeBtn) {
        closeResumeBtn.addEventListener('click', closeResumeModal);
    }

    if (resumeOverlay) {
        resumeOverlay.addEventListener('click', closeResumeModal);
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && !resumeModal.hasAttribute('hidden')) {
            closeResumeModal();
        }
    });

    // Print functionality
    const handlePrintResume = () => {
        window.print();
    };

    if (printBtnHeader) {
        printBtnHeader.addEventListener('click', handlePrintResume);
    }
    if (printBtnFooter) {
        printBtnFooter.addEventListener('click', handlePrintResume);
    }
});

