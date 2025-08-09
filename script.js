
// Dynamic Date Update
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = formattedDate;
}

// Update date when the page loads
document.addEventListener('DOMContentLoaded', updateCurrentDate);

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Always start with light theme, but respect user's saved preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    html.classList.add('dark');
} else {
    // Ensure light theme is the default and remove any dark class
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Smooth Scrolling for Navigation
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

// Mouse Trail Effect
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: 0, y: 0 };
let trail = [];

// Update canvas size on window resize
function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', updateCanvasSize);
window.addEventListener('orientationchange', () => {
    setTimeout(updateCanvasSize, 100);
});

// Mouse movement tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Add new trail point
    trail.push({
        x: mouse.x,
        y: mouse.y,
        life: 1.0
    });
    
    // Limit trail length
    if (trail.length > 20) {
        trail.shift();
    }
});

// Trail animation
function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw trail
    for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const isDark = html.classList.contains('dark');
        
        // Different colors for light/dark theme
        if (isDark) {
            // Green glow for dark mode
            ctx.fillStyle = `rgba(34, 197, 94, ${point.life * 0.8})`;
        } else {
            // RGB colors for light mode
            const r = Math.sin(i * 0.3) * 127 + 128;
            const g = Math.sin(i * 0.3 + 2) * 127 + 128;
            const b = Math.sin(i * 0.3 + 4) * 127 + 128;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${point.life * 0.6})`;
        }
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.life * 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Fade out
        point.life -= 0.05;
    }
    
    // Remove dead trail points
    trail = trail.filter(point => point.life > 0);
    
    requestAnimationFrame(animateTrail);
}

animateTrail();

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
});

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
    if (!document.getElementById('chatbot').contains(e.target)) {
        chatbotWindow.classList.add('hidden');
    }
});

// Simple chatbot responses
const chatResponses = [
    "Thanks for reaching out! I'm always interested in new opportunities.",
    "I'd love to discuss your project. Feel free to email me!",
    "Currently working on some exciting projects. What can I help you with?",
    "Check out my GitHub for the latest projects I've been working on.",
    "I specialize in full-stack development, AI, and blockchain solutions."
];

// Add message to chatbot
function addMessage(message, isUser = false) {
    const chatContainer = document.querySelector('#chatbot-window .overflow-y-auto');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-4';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = isUser 
        ? 'bg-blue-500 text-white p-2 rounded ml-8 text-right' 
        : 'bg-gray-200 dark:bg-gray-700 p-2 rounded mr-8';
    messageBubble.innerHTML = `<p class="font-courier text-sm">${message}</p>`;
    
    messageDiv.appendChild(messageBubble);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle chat input
const chatInput = document.querySelector('#chatbot-window input');
const chatSend = document.querySelector('#chatbot-window button');

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate response delay
        setTimeout(() => {
            const randomResponse = chatResponses[Math.floor(Math.random() * chatResponses.length)];
            addMessage(randomResponse);
        }, 1000);
    }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Typewriter effect for headlines
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typewriter effects on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('typewriter-text')) {
            const text = entry.target.textContent;
            typeWriter(entry.target, text, 30);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all typewriter elements
document.querySelectorAll('.typewriter-text').forEach(el => {
    observer.observe(el);
});

// Add newspaper loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #f59e0b, #10b981);
    z-index: 1000;
    transition: width 0.3s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Scroll Animations
const observeElements = (selector, animationClass) => {
    const elements = document.querySelectorAll(selector);
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        scrollObserver.observe(el);
    });
};

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    observeElements('.fade-in', 'visible');
    observeElements('.slide-in-left', 'visible');
    observeElements('.slide-in-right', 'visible');
    observeElements('.scale-in', 'visible');
    observeElements('.rotate-in', 'visible');
});

// Parallax effect for background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.body;
    const speed = scrolled * 0.5;
    
    parallax.style.backgroundPosition = `0 ${speed}px, 0 ${speed + 10}px, ${speed + 10}px ${-speed - 10}px, ${-speed - 10}px 0px`;
});

// Add scroll-triggered animations for project cards
const staggerElements = () => {
    const projectCards = document.querySelectorAll('.project-article');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    projectCards.forEach(card => {
        staggerObserver.observe(card);
    });
};

// Initialize stagger animations
document.addEventListener('DOMContentLoaded', staggerElements);

// Initialize EmailJS
(function() {
    emailjs.init("IJNF184cEmLcA8Pxt");
})();

// Contact Form Handling with EmailJS
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Show loading state
        const submitButton = contactForm.querySelector('.send-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="ri-loader-4-line mr-2 animate-spin"></i>TRANSMITTING...';
        submitButton.disabled = true;
        
        // Prepare template parameters for EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Somen Sharma'
        };
        
        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_jz4b08h',     // Your EmailJS service ID
                'template_ve4jwi7',    // Your EmailJS template ID
                templateParams
            );
            
            console.log('Email sent successfully:', response);
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success message
            formStatus.className = 'success mt-4 p-3 text-center font-courier text-sm';
            formStatus.textContent = `📬 Message dispatched successfully! Expect a telegraph response within 24-48 hours.`;
            formStatus.classList.remove('hidden');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.classList.add('hidden');
            }, 5000);
            
            // Add newspaper-style notification
            showNewsflash(`📰 BREAKING: Message from ${name} received at digital headquarters!`);
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show error message
            formStatus.className = 'error mt-4 p-3 text-center font-courier text-sm';
            formStatus.textContent = `📧 Telegraph lines are down! Please try again or contact directly via email.`;
            formStatus.classList.remove('hidden');
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                formStatus.classList.add('hidden');
            }, 5000);
        }
    });
}

// Newspaper-style notification function
function showNewsflash(message) {
    const newsflash = document.createElement('div');
    newsflash.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f9fafb;
        border: 3px double #374151;
        padding: 2rem;
        z-index: 1000;
        font-family: 'Playfair Display', serif;
        font-weight: bold;
        font-size: 1.2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        min-width: 300px;
        max-width: 500px;
    `;
    
    if (document.documentElement.classList.contains('dark')) {
        newsflash.style.background = '#374151';
        newsflash.style.borderColor = '#d1d5db';
        newsflash.style.color = '#f3f4f6';
    }
    
    newsflash.innerHTML = `
        <div style="margin-bottom: 1rem; font-size: 1.5rem;">📰 NEWSFLASH! 📰</div>
        <div>${message}</div>
        <div style="margin-top: 1rem; font-size: 0.8rem; font-family: 'Courier Prime', monospace;">
            - The Daily Portfolio Editorial Team
        </div>
    `;
    
    document.body.appendChild(newsflash);
    
    // Animate in
    newsflash.style.opacity = '0';
    newsflash.style.transform = 'translate(-50%, -50%) scale(0.8)';
    newsflash.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        newsflash.style.opacity = '1';
        newsflash.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        newsflash.style.opacity = '0';
        newsflash.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(newsflash)) {
                document.body.removeChild(newsflash);
            }
        }, 300);
    }, 4000);
}

// Add Easter egg for logo click
document.querySelector('h1').addEventListener('click', () => {
    const messages = [
        "👑 You found the secret!",
        "🎉 Keep exploring!",
        "💻 Code is art!",
        "🚀 Innovation never stops!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 1000;
        font-family: 'Courier Prime', monospace;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.textContent = randomMessage;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
});

