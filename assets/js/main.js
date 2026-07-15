// MAAC — Prototipo visual: interacciones y efectos

document.addEventListener('DOMContentLoaded', () => {

  /* Header sticky con encogido y cambio de logo al hacer scroll */
  const header = document.getElementById('siteHeader');
  const headerLogoImg = header ? header.querySelector('.logo img') : null;
  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 40;
    if (header) {
      header.classList.toggle('scrolled', isScrolled);
    }
    if (headerLogoImg) {
      if (isScrolled) {
        headerLogoImg.src = 'assets/img/logo-dark.png';
      } else {
        headerLogoImg.src = 'assets/img/logo-light.png';
      }
    }
  });

  /* Menú móvil */
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  burger.addEventListener('click', () => nav.classList.toggle('mobile-open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('mobile-open')));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* Contadores animados */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 60));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterIO.observe(el));

  /* FAQ acordeón */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Tabs de proyectos (solo visual, sin cambio de contenido real todavía) */
  document.querySelectorAll('.projects-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.projects-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* Slider de testimonios */
  const slides = document.querySelectorAll('.testi-slide');
  let current = 0;
  const showSlide = (i) => {
    slides.forEach(s => s.classList.remove('active'));
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
  };
  document.getElementById('testiNext').addEventListener('click', () => showSlide(current + 1));
  document.getElementById('testiPrev').addEventListener('click', () => showSlide(current - 1));
  setInterval(() => showSlide(current + 1), 6000);

  /* Smooth scroll para anclas internas */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  });

  /* Formulario de contacto AJAX con Formspree */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const action = contactForm.action;
      
      // Deshabilitar botón durante el envío
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          formFeedback.textContent = '¡Gracias por contactarnos! Nos comunicaremos contigo en breve.';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();
        } else {
          throw new Error('Error al procesar el envío');
        }
      } catch (err) {
        formFeedback.textContent = 'Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo o llámanos directamente por teléfono.';
        formFeedback.className = 'form-feedback error';
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  /* Lightbox Video Modal */
  const playButtons = document.querySelectorAll('.play-cta, .play-circle-lg');
  
  if (playButtons.length > 0) {
    // Create Modal Elements dynamically
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close" aria-label="Cerrar video" style="background:none; border:0; color:#fff; font-size:32px; cursor:pointer; position:absolute; top:-40px; right:0; display:flex; align-items:center; gap:6px;">✕ <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-body);">Cerrar</span></button>
        <video src="assets/video/Maac Geosinteticos3.mp4" controls style="width:100%; height:100%; object-fit:contain;"></video>
      </div>
    `;
    document.body.appendChild(modal);
    
    const modalVideo = modal.querySelector('video');
    const closeBtn = modal.querySelector('.video-modal-close');
    
    const openModal = (e) => {
      e.preventDefault();
      modal.classList.add('active');
      modalVideo.play();
    };
    
    const closeModal = () => {
      modal.classList.remove('active');
      modalVideo.pause();
      modalVideo.currentTime = 0;
    };
    
    playButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  /* Filtros de portafolio de proyectos */
  const filterButtons = document.querySelectorAll('.portfolio-filters button');
  const projectCards = document.querySelectorAll('.portfolio-card');
  
  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.textContent.trim().toLowerCase();
        
        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-cat').toLowerCase();
          
          if (filterVal === 'todos') {
            card.style.display = 'flex';
          } else if (filterVal === 'infraestructura vial' && cardCat === 'infraestructura') {
            card.style.display = 'flex';
          } else if (filterVal === 'minería' && cardCat === 'mineria') {
            card.style.display = 'flex';
          } else if (filterVal === 'obra hidráulica' && cardCat === 'hidraulica') {
            card.style.display = 'flex';
          } else if (filterVal === 'saneamiento' && cardCat === 'saneamiento') {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
