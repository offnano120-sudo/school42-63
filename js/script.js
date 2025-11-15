// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// News counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .news-card, .quick-link');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});


// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--bg-white);
        box-shadow: var(--shadow);
        padding: 1rem;
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .feature-card,
    .news-card,
    .quick-link {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in,
    .news-card.animate-in,
    .quick-link.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
    .feature-card:nth-child(4) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

// Form handling example (можно добавить позже)
function handleContactForm(event) {
    event.preventDefault();
    // Обработка формы обратной связи
    alert('Сообщение отправлено!');
}

// Initialize any counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);
// Hero Slider functionality
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.startAutoSlide();
        this.addEventListeners();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause auto-slide on hover
        const slider = document.querySelector('.hero');
        slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.dotsContainer.children[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        this.slides[this.currentSlide].classList.add('active');
        this.dotsContainer.children[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }
    
    startAutoSlide() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
    
    // Update login button to redirect to electronic diary
    const loginBtn = document.querySelector('.btn-login');
    loginBtn.addEventListener('click', () => {
        window.open('https://asurso.ru/', '_blank');
    });
    
    // Update hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons[0].addEventListener('click', () => {
        // Scroll to admission section or open page
        window.open('admission-grade1.html', '_blank');
    });
    
    heroButtons[1].addEventListener('click', () => {
        window.open('https://asurso.ru/', '_blank');
    });
});

// Add placeholder images if real images are not available
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/800x400/4f46e5/ffffff?text=Школа+№42';
    img.alt = 'Изображение временно недоступно';
}

// Add this to the existing CSS in style
const additionalStyles = `
    .slide img {
        transition: transform 10s ease;
    }
    
    .slide.active img {
        transform: scale(1.1);
    }
    
    .hero-buttons .btn {
        margin: 0 0.5rem;
    }
    
    @media (max-width: 768px) {
        .hero-buttons {
            flex-direction: column;
            gap: 1rem;
        }
        
        .hero-buttons .btn {
            margin: 0;
            width: 100%;
            max-width: 250px;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
