document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopButton = document.querySelector('.back-to-top');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Menu Toggle ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Optional: Prevent body scroll when menu is open
        // document.body.classList.toggle('no-scroll');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            // document.body.classList.remove('no-scroll');
        }
    }));

    // --- Smooth Scrolling ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Only prevent default for internal links
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
            // External links will behave normally
        });
    });

    // --- Navbar background change on scroll ---
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Back to Top button visibility ---
    const backToTopThreshold = 300;
     window.addEventListener('scroll', () => {
        if (window.scrollY > backToTopThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Back to top button click handler (uses smooth scroll)
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Active Link Highlighting on Scroll ---
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        const navbarHeight = header.offsetHeight;
        let currentSectionId = '';

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 50; // Adjusted offset

            if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSectionId = current.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });

        // Handle case when scrolled to the very top
        if (scrollY < sections[0].offsetTop - navbarHeight - 50) {
             navLinks.forEach(link => link.classList.remove('active'));
             // Optionally activate the 'home' link
             const homeLink = document.querySelector('.nav-menu a[href="#home"]');
             if (homeLink) homeLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', highlightNavLink);
    // Initial call to set active link on page load/refresh
    highlightNavLink();

    // --- Update Footer Year ---
     if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
     }

    // --- Simple Contact Form AJAX Submission (Example using Formspree) ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default page reload

            const formData = new FormData(contactForm);
            const action = contactForm.getAttribute("action"); // Get Formspree URL

            if (!action || !action.includes('formspree.io')) {
                console.warn('Form action URL is not set or not a Formspree URL. Submission might fail.');
                if (formStatus) {
                    formStatus.textContent = 'Form endpoint not configured.';
                    formStatus.className = 'error';
                }
                return; // Stop if no valid action URL
            }

             if (formStatus) {
                 formStatus.textContent = 'Sending...';
                 formStatus.className = '';
             }


            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success
                     if (formStatus) {
                         formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                         formStatus.className = 'success';
                     }
                     contactForm.reset(); // Clear the form
                } else {
                    // Attempt to get error details from Formspree
                    response.json().then(data => {
                        let errorMessage = "Oops! There was a problem submitting your form.";
                        if (data && data.errors) {
                            errorMessage = data.errors.map(error => error.message).join(", ");
                        }
                         if (formStatus) {
                             formStatus.textContent = errorMessage;
                             formStatus.className = 'error';
                         }
                    })
                }
            })
            .catch(error => {
                // Network error or other issue
                 if (formStatus) {
                     formStatus.textContent = "Oops! There was a network error submitting your form.";
                     formStatus.className = 'error';
                 }
                 console.error('Form submission error:', error);
            });
        });
    }

    // --- Simple Fade-in Animation on Scroll (Optional) ---
    const animatedElements = document.querySelectorAll('.section h2, .section .section-intro, .about-content, .observation-card, .portfolio-item, .contact-content > div');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                 // Optional: Stop observing once revealed to prevent re-animation
                 // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove class if you want it to fade out when scrolling away
                 // entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% is visible

    animatedElements.forEach(el => {
        el.classList.add('reveal-on-scroll'); // Add initial state class via CSS
        revealObserver.observe(el);
    });

}); // End DOMContentLoaded

// Add corresponding CSS for the fade-in effect:
/*
.reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
}
*/
// You should add the CSS above to your style.css file