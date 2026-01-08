// ================= PRELOADER =================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        preloader.classList.add('loaded');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            preloader.style.display = 'none';
            
            // Initialize particles after preloader
            initParticles();
        }, 500);
    }, 2000);
});

// ================= SCROLL PROGRESS INDICATOR =================
const progressIndicator = document.querySelector('.progress-indicator');

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (window.scrollY / documentHeight) * 100;
    
    progressIndicator.style.width = `${scrolled}%`;
});

// ================= PARTICLE SYSTEM =================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle system
    const particles = [];
    const particleCount = 80;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`;
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines
    function connectParticles() {
        const maxDistance = 120;
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================= SCROLL REVEAL ANIMATIONS =================
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;
        
        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// ================= COUNTER ANIMATIONS =================
const counters = document.querySelectorAll('.stat-number');

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ================= SKILL BARS ANIMATION =================
const skillBars = document.querySelectorAll('.skill-level');

function animateSkillBars() {
    skillBars.forEach(bar => {
        bar.style.animation = 'skillFill 1.5s ease-out forwards';
    });
}

// Intersection Observer for skill bars
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ================= HOVER EFFECTS =================
const hoverElements = document.querySelectorAll('[data-hover-sound]');

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        // Create subtle hover feedback
        element.style.transform = 'scale(1.05)';
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
});

// ================= FORM HANDLING =================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success feedback
            submitBtn.innerHTML = '✓ Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    });
}

// ================= WAVE ANIMATION =================
const waves = document.querySelectorAll('.section-separator path');

function animateWaves() {
    waves.forEach((wave, index) => {
        wave.style.animation = `waveMove ${20 + index * 5}s linear infinite`;
    });
}

// Start wave animation
animateWaves();

// ================= CURSOR EFFECT =================
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-trail');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    document.body.appendChild(cursor);
    
    // Remove cursor trail after animation
    setTimeout(() => {
        cursor.remove();
    }, 500);
});

// Add cursor trail styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: cursorTrail 0.5s linear forwards;
    }
    
    @keyframes cursorTrail {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(cursorStyle);

// ================= PERFORMANCE OPTIMIZATIONS =================
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkReveal, 100);
});

// ================= INITIALIZE ON LOAD =================
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Initialize counters
    checkReveal();
});