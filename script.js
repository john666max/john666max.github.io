document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initNavbarScroll();
    initSmoothNavigation();
    initHeroParallax();
    initInteractiveCarousel();
    initButtonEffects();
});

// ==========================================================================
// 1. Front Page to Content Scroll Reveal Engine (Intersection Observer)
// ==========================================================================
function initScrollReveal() {
    const observerOptions = {
        root: null, // Viewport standard binding
        threshold: 0.12, // Triggers when 12% of the targeted view frame maps out
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Execution ends processing observation loop once visual assets load
            }
        });
    }, observerOptions);

    // Track layout containers using the dedicated visibility system
    document.querySelectorAll('.reveal-section').forEach(section => {
        revealObserver.observe(section);
    });
}

// Navbar scroll edge layout behavior
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.85)';
            navbar.style.borderBottomColor = 'rgba(66, 66, 69, 0.6)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.7)';
            navbar.style.borderBottomColor = 'rgba(66, 66, 69, 0.3)';
        }
    });
}

// Handle Anchor Jump Interventions smoothly
function initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Hero Parallax
function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (!heroContent) return;
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.35}px)`;
            heroContent.style.opacity = 1 - (scrollPosition / (window.innerHeight * 0.8));
        }
    });
}

// ==========================================================================
// 2. High-Performance Infinite Loop Carousel (Drag + Button Mechanics)
// ==========================================================================
function initInteractiveCarousel() {
    const carousel = document.getElementById('logo-carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!track) return;

    let isAutoplayPaused = false;
    let scrollPosition = 0;
    const speed = 0.75; // Step frequency size for background processing animation tick loop
    
    // Build loop duplication matrix dynamically
    const originalItems = Array.from(track.children);
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    // Compute layout dimensional limits
    let itemWidth = originalItems[0].offsetWidth + 28; // Element dimensions mixed into standard margin gap values
    let totalWidth = itemWidth * originalItems.length;

    window.addEventListener('resize', () => {
        itemWidth = originalItems[0].offsetWidth + 28;
        totalWidth = itemWidth * originalItems.length;
    });

    // Core continuous render engine processing loop
    function updateScroll() {
        if (!isAutoplayPaused) {
            scrollPosition -= speed;
            if (Math.abs(scrollPosition) >= totalWidth) {
                scrollPosition = 0; // Seamless reset without skipping standard layout view frames
            }
            track.style.transform = `translateX(${scrollPosition}px)`;
        }
        requestAnimationFrame(updateScroll);
    }
    
    // Fire automatic engine
    requestAnimationFrame(updateScroll);

    // Directional control bindings
    function handleManualShift(direction) {
        isAutoplayPaused = true;
        // Shift a complete item increment down the line track mapping sequence
        scrollPosition += (direction * itemWidth * 1.5);
        
        // Prevent out-of-bounds anomalies during manual layout shifting execution cycles
        if (scrollPosition > 0) {
            scrollPosition = -totalWidth;
        } else if (Math.abs(scrollPosition) >= totalWidth * 2) {
            scrollPosition = -totalWidth;
        }
        
        track.style.transform = `translateX(${scrollPosition}px)`;
        // Restore automated gliding motion after manual interactive pause window expires
        setTimeout(() => { isAutoplayPaused = false; }, 2500);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => handleManualShift(1));
        nextBtn.addEventListener('click', () => handleManualShift(-1));
    }

    // Set up item hyperlinks correctly
    track.querySelectorAll('.logo-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            if (url) window.open(url, '_blank', 'noopener noreferrer');
        });
        
        // Pause automated movement when user hovers over an item
        item.addEventListener('mouseenter', () => { isAutoplayPaused = true; });
        item.addEventListener('mouseleave', () => { isAutoplayPaused = false; });
    });

    // Respect user device parameters for motion constraints
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        isAutoplayPaused = true;
    }
}

// Button micro-interactions and ripples
function initButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.querySelectorAll('.btn, .contact-link').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.background = 'rgba(255, 255, 255, 0.25)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple-effect 0.6s linear';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Global ripple injection keyframe styles fallback mapping mechanism
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes ripple-effect {
    to { transform: scale(4); opacity: 0; }
}`;
document.head.appendChild(styleSheet);