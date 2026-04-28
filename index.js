/* ============================================
   PORTFOLIO – index.js v3 (modifié)
============================================ */

/* ── Custom cursor ── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = mouseX+'px'; cursorDot.style.top = mouseY+'px'; }
});
function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (cursorRing) { cursorRing.style.left = ringX+'px'; cursorRing.style.top = ringY+'px'; }
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .comp-card, .fw-item, .proj-card, .c-node, .timeline-item, .cert-card, .veille-article, .highlight-item, .hero-social-icon, .cert-arrow, .transversal-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hover'));
});

/* ── Scroll progress ── */
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

/* ── Header scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Intersection Observer: reveal ── */
const revealEls = document.querySelectorAll('.reveal-up');
revealEls.forEach(el => {
    el.style.animationPlayState = 'paused';
    el.style.opacity = '0';
});
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ── Skill bar animation (compétences) ── */
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.comp-fill').forEach((fill, i) => {
                fill.style.animationDelay = (i * 0.08) + 's';
                fill.style.animationPlayState = 'running';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
const compGrid = document.querySelector('.comp-grid');
if (compGrid) {
    compGrid.querySelectorAll('.comp-fill').forEach(f => f.style.animationPlayState = 'paused');
    barObserver.observe(compGrid);
}

/* ── Compétences transversales: animation barres au scroll ── */
const transversalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.transversal-fill').forEach((fill, i) => {
                setTimeout(() => fill.classList.add('animated'), i * 100);
            });
            transversalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
const transversalWrap = document.querySelector('.transversal-wrap');
if (transversalWrap) {
    transversalObserver.observe(transversalWrap);
}

/* ── Filtres projets ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projCards.forEach(card => {
            const cat = card.dataset.cat;
            if (filter === 'all' || cat === filter) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = '';
                card.style.pointerEvents = '';
            } else {
                card.style.opacity = '0.2';
                card.style.transform = 'scale(0.97)';
                card.style.pointerEvents = 'none';
            }
        });
        const grid = document.querySelector('.proj-grid');
        const featured = document.querySelector('.proj-featured');
        if (featured && filter !== 'all') {
            if (featured.dataset.cat !== filter) {
                featured.style.gridRow = 'auto';
            } else {
                featured.style.gridRow = 'span 2';
            }
        } else if (featured) {
            featured.style.gridRow = 'span 2';
        }
    });
});

/* ── Modals ── */
window.openModal = id => {
    const m = document.getElementById('modal-' + id);
    if (!m) return;
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
};
window.closeModal = (event, id) => {
    event.stopPropagation();
    const m = document.getElementById('modal-' + id);
    if (!m) return;
    m.classList.remove('active');
    document.body.style.overflow = '';
};
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
            m.classList.remove('active'); document.body.style.overflow = '';
        });
    }
});

/* ── Smooth anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ── Parallax hero mesh ── */
const heroMesh = document.querySelector('.hero-mesh');
window.addEventListener('scroll', () => {
    if (!heroMesh) return;
    heroMesh.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}, { passive: true });

/* ── Nav active section ── */
const navLinks = document.querySelectorAll('.nav-links > li > a');
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.parentElement.classList.remove('nav-active');
                if (link.getAttribute('href') === '#' + id) {
                    link.parentElement.classList.add('nav-active');
                }
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── Contact form ── */
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-primary');
        const spanEl = btn.querySelector('span');
        const origText = spanEl ? spanEl.textContent : btn.textContent;
        if (spanEl) spanEl.textContent = '✓ Envoyé !';
        else btn.textContent = '✓ Envoyé !';
        btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
        btn.disabled = true;
        setTimeout(() => {
            if (spanEl) spanEl.textContent = origText;
            else btn.textContent = origText;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}

/* ── Constellation hover ── */
const constCenter = document.querySelector('.constellation-center');
const cNodes = document.querySelectorAll('.c-node');
if (constCenter) {
    cNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            constCenter.style.boxShadow = '0 0 0 20px rgba(167,139,250,.07), 0 0 70px rgba(167,139,250,.2)';
        });
        node.addEventListener('mouseleave', () => {
            constCenter.style.boxShadow = '';
        });
    });
}

/* ── Animation projets au scroll ── */
const projCardObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transition = `all .5s cubic-bezier(.175,.885,.32,1.275) ${i * 0.08}s`;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            projCardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.proj-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    projCardObserver.observe(card);
});

/* ── NOUVEAU: Carousel certifications avec flèches ── */
window.certScroll = function(direction) {
    const carousel = document.getElementById('certCarousel');
    if (!carousel) return;
    const cardWidth = carousel.querySelector('.cert-card')?.offsetWidth + 20 || 320;
    carousel.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
};

/* ── NOUVEAU: Upload PDF pour la veille ── */
window.handlePdfUpload = function(input, id) {
    const file = input.files[0];
    if (!file || file.type !== 'application/pdf') return;
    const url = URL.createObjectURL(file);
    const link = document.getElementById(id + '-link');
    if (link) {
        link.href = url;
        link.style.display = 'inline-flex';
        link.textContent = '📄 ' + file.name;
        // Feedback visuel sur le bouton
        const btn = input.closest('.btn-veille-pdf');
        if (btn) {
            const originalHTML = btn.innerHTML;
            const svgIcon = btn.querySelector('svg')?.outerHTML || '';
            btn.innerHTML = svgIcon + ' ✓ PDF chargé<input type="file" accept=".pdf" class="pdf-input" onchange="handlePdfUpload(this,\'' + id + '\')" style="position:absolute;inset:0;opacity:0;cursor:none;width:100%;height:100%">';
            btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
        }
    }
};

/* ── Effet parallax léger sur les cartes certifications au scroll ── */
const certCards = document.querySelectorAll('.cert-card');
window.addEventListener('scroll', () => {
    certCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            card.style.transform = `translateY(${(progress - 0.5) * -8}px)`;
        }
    });
}, { passive: true });


(function() {
  /* ── Carrousel ── */
  const track      = document.getElementById('carouselTrack');
  const prevBtn    = document.getElementById('carouselPrev');
  const nextBtn    = document.getElementById('carouselNext');
  const dotsEl     = document.getElementById('carouselDots');
  const counterEl  = document.getElementById('carouselCounter');
 
  let allCards     = [];   // toutes les cards (pas de filtre)
  let visibleCards = [];   // cards visibles (filtrées)
  let currentIdx   = 0;
 
  function getPerPage() {
    const w = window.innerWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }
 
  function refreshVisibleCards() {
    allCards = Array.from(track.querySelectorAll('.proj-card'));
    visibleCards = allCards.filter(c => c.style.display !== 'none');
    currentIdx = 0;
  }
 
  function maxIndex() {
    return Math.max(0, visibleCards.length - getPerPage());
  }
 
  function renderDots() {
    const per = getPerPage();
    const pages = Math.ceil(visibleCards.length / per);
    dotsEl.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === Math.floor(currentIdx / per) ? ' active' : '');
      d.setAttribute('aria-label', 'Page ' + (i+1));
      d.addEventListener('click', () => goTo(i * per));
      dotsEl.appendChild(d);
    }
  }
 
  function goTo(idx) {
    const per = getPerPage();
    currentIdx = Math.max(0, Math.min(idx, maxIndex()));
 
    // Calcul du décalage basé sur les cards visibles
    const cardWidth = track.querySelector('.proj-card')?.offsetWidth || 0;
    const gap = 20;
 
    // On utilise une approche basée sur le translateX des cartes visibles
    // On cache/montre via display, donc on recalcule l'offset
    const allInTrack = Array.from(track.querySelectorAll('.proj-card'));
    let offset = 0;
    let visCount = 0;
    for (const card of allInTrack) {
      if (card.style.display === 'none') continue;
      if (visCount < currentIdx) {
        offset += card.offsetWidth + gap;
      }
      visCount++;
    }
    track.style.transform = `translateX(-${offset}px)`;
 
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx >= maxIndex();
    counterEl.textContent = `${currentIdx + 1} – ${Math.min(currentIdx + per, visibleCards.length)} / ${visibleCards.length}`;
    renderDots();
  }
 
  prevBtn.addEventListener('click', () => goTo(currentIdx - getPerPage()));
  nextBtn.addEventListener('click', () => goTo(currentIdx + getPerPage()));
 
  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
  });
 
  // Filtres
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      allCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
      });
      track.style.transform = 'translateX(0)';
      refreshVisibleCards();
      goTo(0);
    });
  });
 
  window.addEventListener('resize', () => goTo(currentIdx));
 
  // Init
  refreshVisibleCards();
  goTo(0);
 
  /* ── Modales ── */
  // Ouvre la modale liée à data-modal de la card
  track.addEventListener('click', function(e) {
    const card = e.target.closest('.proj-card');
    if (!card) return;
    const modalId = card.dataset.modal;
    if (modalId) openModal(modalId);
  });
 
  window.openModal = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
 
  window.closeModal = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  };
 
  // Fermer en cliquant l'overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
 
  // Fermer avec Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
})();