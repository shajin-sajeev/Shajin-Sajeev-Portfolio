// Mobile menu toggle
document.getElementById('mobile-menu').addEventListener('click', function() {
	document.querySelector('.nav-menu').classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
	link.addEventListener('click', () => {
		document.querySelector('.nav-menu').classList.remove('active');
	});
});

// Typing effect for hero section
const typingText = document.querySelector('.typing-effect');
const words = ['robust Laravel APIs', 'seamless integrations', 'e-commerce solutions', 'scalable systems'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
	const currentWord = words[wordIndex];
  
	if (isDeleting) {
		typingText.textContent = currentWord.substring(0, charIndex - 1);
		charIndex--;
	} else {
		typingText.textContent = currentWord.substring(0, charIndex + 1);
		charIndex++;
	}

	if (!isDeleting && charIndex === currentWord.length) {
		isDeleting = true;
		setTimeout(typeEffect, 1500);
	} else if (isDeleting && charIndex === 0) {
		isDeleting = false;
		wordIndex = (wordIndex + 1) % words.length;
		setTimeout(typeEffect, 500);
	} else {
		setTimeout(typeEffect, isDeleting ? 50 : 100);
	}
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
	setTimeout(typeEffect, 1000);
  
	// Smooth scrolling for anchor links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
      
			const targetId = this.getAttribute('href');
			if (targetId === '#') return;
      
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 80,
					behavior: 'smooth'
				});
			}
		});
	});
  
	// set current year in footer
	(function setCurrentYear(){
	  try {
	    const el = document.getElementById('current-year');
	    if(el) el.textContent = new Date().getFullYear();
	  } catch (e) {
	  }
	})();
});

// Add scroll effect to navbar (dark-themed behavior)
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    const navBg = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg') || 'rgba(8,10,18,0.85)';
    navbar.style.backgroundColor = navBg.trim();
    navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.6)';
  } else {
    navbar.style.backgroundColor = 'transparent';
    navbar.style.boxShadow = 'none';
  }
});

