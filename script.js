// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Automatically select a pricing plan in the contact form
const planButtons = document.querySelectorAll('[data-plan]');
const planSelect = document.querySelector('#plan');

planButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (planSelect) {
      planSelect.value = button.dataset.plan;
    }
  });
});

// Scroll reveal animation
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Automatically update copyright year
const yearElement = document.querySelector('#year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// DawgsWeb contact form
// Submit to Formspree without leaving the site,
// then redirect successful submissions to our branded thank-you page.
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const submitButton = document.getElementById('submit-button');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const originalButtonText = submitButton
      ? submitButton.textContent
      : '';

    // Disable button while sending
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (formStatus) {
      formStatus.textContent = 'Sending your message...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json'
        }
      });

      // Successful Formspree submission
      if (response.ok) {
        window.location.href = 'thank-you.html';
        return;
      }

      // Formspree returned an error
      let message =
        'Something went wrong. Please check your information and try again.';

      try {
        const data = await response.json();

        if (
          data &&
          Array.isArray(data.errors) &&
          data.errors.length
        ) {
          message = data.errors
            .map(error => error.message)
            .join(' ');
        }
      } catch (error) {
        // Use default error message above
      }

      if (formStatus) {
        formStatus.textContent = message;
      }
    } catch (error) {
      // Network error
      if (formStatus) {
        formStatus.textContent =
          'We could not send your message. Please check your connection and try again.';
      }
    } finally {
      // Restore button if we did not redirect
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}