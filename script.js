const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-plan]').forEach(button => {
  button.addEventListener('click', () => {
    const plan = document.getElementById('plan');
    const wanted = button.dataset.plan;

    if (!plan) return;

    [...plan.options].forEach(option => {
      if (option.text.startsWith(wanted)) {
        plan.value = option.value;
      }
    });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();