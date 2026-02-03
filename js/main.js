/* ========================================
   AGENCE STEPHANE QUENTIN - JavaScript
======================================= */

// ========================================
// SCROLL ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer pour les animations au scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec classe d'animation
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });

  // ========================================
  // HEADER SCROLLED
  // ========================================
  
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Fermer le menu au clic sur un lien
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

  // ========================================
  // SMART CONTACT FORM
  // ========================================

  const contactForm = document.getElementById('contactForm');
  const profileSelect = document.getElementById('profile');

  if (contactForm && profileSelect) {
    const dynamicFields = document.querySelector('.dynamic-fields');
    const companyField = document.getElementById('company');
    const functionField = document.getElementById('function');

    profileSelect.addEventListener('change', function() {
      const profile = this.value;

      // Reset dynamic fields
      if (dynamicFields) {
        dynamicFields.innerHTML = '';

        if (profile === 'entreprise') {
          dynamicFields.innerHTML = `
            <div class="form-group">
              <label for="company">Nom de l'entreprise *</label>
              <input type="text" id="company" name="company" required>
            </div>
            <div class="form-group">
              <label for="function">Votre fonction *</label>
              <input type="text" id="function" name="function" required>
            </div>
            <div class="form-group">
              <label for="employees">Nombre de collaborateurs</label>
              <select id="employees" name="employees">
                <option value="">Sélectionnez...</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
          `;
        } else if (profile === 'association') {
          dynamicFields.innerHTML = `
            <div class="form-group">
              <label for="company">Nom de l'association *</label>
              <input type="text" id="company" name="company" required>
            </div>
            <div class="form-group">
              <label for="members">Nombre de membres</label>
              <input type="number" id="members" name="members" placeholder="Nombre de membres">
            </div>
          `;
        } else if (profile === 'particulier') {
          dynamicFields.innerHTML = `
            <div class="form-group">
              <label for="project">Type de projet *</label>
              <select id="project" name="project" required>
                <option value="">Sélectionnez...</option>
                <option value="conseil">Conseil stratégique</option>
                <option value="formation">Formation IA</option>
                <option value="conférence">Conférence</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          `;
        }

        // Réappliquer les événements aux nouveaux champs
        addFormValidation();
      }
    });
  }

  // ========================================
  // FORM VALIDATION
  // ========================================

  function addFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Simuler l'envoi du formulaire
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = 'Message envoyé !';
          submitBtn.style.background = '#10b981';
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            form.reset();
            document.querySelector('.dynamic-fields').innerHTML = '';
          }, 2000);
        }, 1500);
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Reset
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Ce champ est obligatoire';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse email valide';
      }
    }

    // Phone validation (optional)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-+()]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer un numéro de téléphone valide';
      }
    }

    if (!isValid) {
      field.classList.add('error');
      field.style.borderColor = '#ef4444';
      
      const errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
      errorEl.textContent = errorMessage;
      field.parentNode.appendChild(errorEl);
    } else {
      field.style.borderColor = '#10b981';
    }

    return isValid;
  }

  // Initialiser la validation
  addFormValidation();

  // ========================================
  // COUNTER ANIMATION
  // ========================================

  const counters = document.querySelectorAll('.hero-stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + suffix;
          }
        }, stepTime);

        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // ========================================
  // SCROLL PROGRESS (optionnel)
  // ========================================

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Peut être utilisé pour une barre de progression
    // document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
  });

  // ========================================
  // DEBOUNCE FUNCTION
  // ========================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
