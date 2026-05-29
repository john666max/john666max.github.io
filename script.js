// Smooth scroll behavior enhancements
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbarScroll();
    initCarousel();
});

// Initialize scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and text elements
    document.querySelectorAll('.experience-card, .skill-category, .about-text p, .highlight-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        if (scrollTop > 100) {
            navbar.style.borderBottomColor = 'rgba(66, 66, 69, 0.5)';
        } else {
            navbar.style.borderBottomColor = '#424245';
        }

        lastScrollTop = scrollTop;
    });
}

// Smooth scroll for navigation links
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

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    hero.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

// Enhance button interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add ripple effect on click
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
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Smooth, seamless carousel + clickable logos
function initCarousel() {
    const carousel = document.getElementById('logo-carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    // Ensure track doesn't wrap and can grow
    track.style.whiteSpace = 'nowrap';
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.alignItems = 'center';
    track.style.willChange = 'transform';
    track.style.animationTimingFunction = 'linear';
    track.style.animationIterationCount = 'infinite';

    // Duplicate items until track is at least twice the visible width to avoid gaps
    const originalItems = Array.from(track.children).filter(c => !c.dataset.clone);
    const maxClones = 6; // safety cap to avoid runaway cloning
    let loops = 0;
    while (track.scrollWidth < carousel.clientWidth * 2 && loops < maxClones) {
        for (const item of originalItems) {
            const clone = item.cloneNode(true);
            clone.dataset.clone = 'true';
            track.appendChild(clone);
        }
        loops++;
    }

    // Determine a smooth animation duration based on one set width
    const oneSetWidth = originalItems.reduce((sum, it) => sum + it.getBoundingClientRect().width, 0) + (parseFloat(getComputedStyle(track).gap || 28) * originalItems.length);
    const speedPxPerSec = 140; // increase for faster scroll
    const durationSec = Math.max(6, oneSetWidth / speedPxPerSec);
    track.style.animationName = 'scroll-left';
    track.style.animationDuration = `${durationSec}s`;

    // Make items clickable: if there is an <a>, leave it; otherwise use data-url
    track.querySelectorAll('.logo-item').forEach(item => {
        const anchor = item.querySelector('a');
        const url = anchor ? anchor.href : item.dataset.url;
        if (url) {
            // ensure pointer cursor
            item.style.cursor = 'pointer';
            // open link on click
            item.addEventListener('click', (e) => {
                // allow real anchors to behave normally
                if (anchor) return;
                window.open(url, '_blank', 'noopener');
            });
        }
    });

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        track.style.animation = 'none';
    }
}

// Log page load for debugging
console.log('Portfolio website loaded successfully');