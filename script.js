/* ====================================================
   DOM CASMURRO — Scripts Principais
==================================================== */

/* ====================================================
   CURSOR PERSONALIZADO
==================================================== */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ====================================================
   NAVEGAÇÃO — estado "scrolled"
==================================================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ====================================================
   SCROLL REVEAL — IntersectionObserver
==================================================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ====================================================
   PARALLAX NAS FAIXAS
==================================================== */
const bands = document.querySelectorAll('.parallax-band');
window.addEventListener('scroll', () => {
  bands.forEach(band => {
    const rect     = band.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const inner    = band.querySelector('.parallax-inner');
    if (inner) inner.style.transform = `translateY(${(progress - 0.5) * 50}px)`;
  });
}, { passive: true });

/* ====================================================
   CONTADOR ANIMADO DE ESTATÍSTICAS
==================================================== */
function animateCounter(el, target) {
  const duration  = 1800;
  const startTime = performance.now();
  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const val = parseInt(el.dataset.target, 10);
      if (!isNaN(val)) animateCounter(el, val);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => {
  el.dataset.target = el.textContent.trim();
  el.textContent    = '0';
  statObserver.observe(el);
});

/* ====================================================
   MODAL DE RESUMO — Dados dos livros
==================================================== */
const bookData = {
  'Dom Casmurro': {
    year: '1899',
    genre: 'Romance · Realismo',
    colorClass: 'book-1',
    ornament: '✦',
    prompt: `Escreva um resumo literário rico e envolvente de "Dom Casmurro" de Machado de Assis (1899), em português brasileiro. Inclua: a sinopse central (o dilema Bentinho/Capitu), o narrador não confiável como recurso literário, a ambiguidade dos "olhos de ressaca" e o que torna o livro uma obra-prima imortal. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  },
  'Memórias Póstumas de Brás Cubas': {
    year: '1881',
    genre: 'Romance · Realismo',
    colorClass: 'book-2',
    ornament: '◆',
    prompt: `Escreva um resumo literário rico e envolvente de "Memórias Póstumas de Brás Cubas" de Machado de Assis (1881), em português brasileiro. Inclua: o narrador defunto, a ironia corrosiva, a ruptura com o Romantismo e a inauguração do Realismo brasileiro, e o que torna o livro revolucionário. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  },
  'Quincas Borba': {
    year: '1891',
    genre: 'Romance · Realismo',
    colorClass: 'book-3',
    ornament: '✧',
    prompt: `Escreva um resumo literário rico e envolvente de "Quincas Borba" de Machado de Assis (1891), em português brasileiro. Inclua: a filosofia do Humanitismo, o personagem Rubião, a crítica social machadiana, e a tragédia da ingenuidade diante da malícia. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  },
  'Várias Histórias': {
    year: '1896',
    genre: 'Contos · Realismo',
    colorClass: 'book-4',
    ornament: '◉',
    prompt: `Escreva um resumo literário rico e envolvente de "Várias Histórias" de Machado de Assis (1896), em português brasileiro. Inclua: os temas centrais dos contos, a maestria do conto machadiano, a ironia e a psicologia dos personagens, e os contos mais célebres da coletânea. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  },
  'Esaú e Jacó': {
    year: '1904',
    genre: 'Romance · Realismo',
    colorClass: 'book-5',
    ornament: '⊕',
    prompt: `Escreva um resumo literário rico e envolvente de "Esaú e Jacó" de Machado de Assis (1904), em português brasileiro. Inclua: os irmãos gêmeos Pedro e Paulo, a alegoria política da monarquia e república, o narrador Conselheiro Aires e o que o livro revela sobre o Brasil de seu tempo. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  },
  'Memorial de Aires': {
    year: '1908',
    genre: 'Romance · Diário íntimo',
    colorClass: 'book-6',
    ornament: '✦',
    prompt: `Escreva um resumo literário rico e envolvente de "Memorial de Aires" de Machado de Assis (1908), em português brasileiro. Inclua: o formato de diário do Conselheiro Aires, a história de amor de Fidélia e Tristão, a melancolia do livro de despedida, e seu significado como último romance de Machado. Tom: elegante, culto, apaixonado pela literatura. Máximo 220 palavras. Não use títulos ou markdown.`
  }
};

/* ====================================================
   CRIAR MODAL NO DOM
==================================================== */
function createModal() {
  const overlay = document.createElement('div');
  overlay.id = 'book-modal-overlay';
  overlay.innerHTML = `
    <div id="book-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button id="modal-close" aria-label="Fechar">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <div id="modal-book-cover">
        <div id="modal-spine"></div>
        <div id="modal-ornament"></div>
        <div id="modal-year-badge"></div>
        <div id="modal-cover-title"></div>
        <div class="book-author">Machado de Assis</div>
      </div>
      <div id="modal-content">
        <div id="modal-meta">
          <span id="modal-year-tag"></span>
          <span id="modal-genre-tag"></span>
        </div>
        <h2 id="modal-title"></h2>
        <div id="modal-divider"></div>
        <div id="modal-body">
          <div id="modal-loading">
            <div class="modal-loading-dot"></div>
            <div class="modal-loading-dot"></div>
            <div class="modal-loading-dot"></div>
          </div>
          <p id="modal-text"></p>
        </div>
        <div id="modal-footer">
          <span id="modal-footer-label">Resumo gerado por IA · Machado de Assis</span>
          <div id="modal-footer-ornament">✦</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  return overlay;
}

function closeModal() {
  const overlay = document.getElementById('book-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
  }
  document.body.style.overflow = '';
}

/* ====================================================
   ABRIR MODAL E BUSCAR RESUMO VIA API
==================================================== */
const summaryCache = {};

async function openBookModal(title) {
  const book = bookData[title];
  if (!book) return;

  let overlay = document.getElementById('book-modal-overlay');
  if (!overlay) overlay = createModal();

  // Resetar estado
  const modalText    = document.getElementById('modal-text');
  const modalLoading = document.getElementById('modal-loading');
  modalText.textContent = '';
  modalText.style.opacity = '0';
  modalLoading.style.display = 'flex';

  // Preencher campos fixos
  const coverEl = document.getElementById('modal-book-cover');
  coverEl.className = `book-cover ${book.colorClass}`;
  document.getElementById('modal-ornament').textContent = book.ornament;
  document.getElementById('modal-ornament').className = 'book-ornament';
  document.getElementById('modal-year-badge').textContent = book.year;
  document.getElementById('modal-year-badge').className = 'book-year-badge';

  const coverTitleEl = document.getElementById('modal-cover-title');
  const parts = title.split(/(?<=[a-záàâãéêíóôõúç])\s+(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/);
  if (parts.length > 1) {
    coverTitleEl.innerHTML = `${parts[0]}<em>${parts.slice(1).join(' ')}</em>`;
  } else {
    coverTitleEl.innerHTML = `<em>${title}</em>`;
  }
  coverTitleEl.className = 'book-title';

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-year-tag').textContent = book.year;
  document.getElementById('modal-genre-tag').textContent = book.genre;

  // Exibir modal
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Usar cache se disponível
  if (summaryCache[title]) {
    renderSummary(summaryCache[title]);
    return;
  }


  // Buscar da API via OpenRouter (sem streaming — compatível com modelos reasoning)
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Dom Casmurro'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        max_tokens: 1000,
        stream: false,
        messages: [{ role: 'user', content: book.prompt }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errBody}`);
    }

    const data = await response.json();

    // Modelos reasoning retornam o texto em message.content
    // Alguns retornam <think>...</think> antes do conteúdo real — removemos
    const raw =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.message?.reasoning ||
      '';

    if (!raw) throw new Error('Resposta vazia da API');

    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    modalLoading.style.display = 'none';
    modalText.style.opacity = '1';
    modalText.textContent = cleaned;
    summaryCache[title] = cleaned;

  } catch (err) {
    console.error('[Dom Casmurro] Erro na API:', err);
    modalLoading.style.display = 'none';
    modalText.style.opacity = '1';
    modalText.textContent = 'Não foi possível carregar o resumo. Erro: ' + err.message;
  }
}

function renderSummary(text) {
  const modalText    = document.getElementById('modal-text');
  const modalLoading = document.getElementById('modal-loading');
  modalLoading.style.display = 'none';
  modalText.textContent = text;
  modalText.style.opacity = '1';
}

/* ====================================================
   INJETAR ESTILOS DO MODAL
==================================================== */
const modalStyles = document.createElement('style');
modalStyles.textContent = `
#book-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(14,11,7,0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: background 0.45s cubic-bezier(0.16,1,0.3,1),
              backdrop-filter 0.45s cubic-bezier(0.16,1,0.3,1);
}
#book-modal-overlay.open {
  background: rgba(14,11,7,0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
#book-modal {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  background: var(--parchment, #f5f0e8);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(28px) scale(0.97);
  transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1),
              transform 0.45s cubic-bezier(0.16,1,0.3,1);
}
#book-modal-overlay.open #book-modal {
  opacity: 1;
  transform: translateY(0) scale(1);
}
#modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(184,149,58,0.3);
  background: rgba(245,240,232,0.08);
  color: rgba(245,240,232,0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.2s;
}
#modal-close:hover {
  background: rgba(184,149,58,0.2);
  color: var(--gold-light, #d4af5c);
  border-color: rgba(184,149,58,0.6);
  transform: rotate(90deg);
}
#modal-book-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 1.5rem;
  min-height: 400px;
}
#modal-content {
  padding: 2.5rem 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--parchment, #f5f0e8);
}
#modal-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
#modal-year-tag,
#modal-genre-tag {
  font-family: var(--f-sc, 'Cormorant SC', Georgia, serif);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  padding: 0.3rem 0.75rem;
  text-transform: uppercase;
}
#modal-year-tag {
  background: rgba(184,149,58,0.12);
  color: var(--gold, #b8953a);
  border: 1px solid rgba(184,149,58,0.3);
}
#modal-genre-tag {
  background: rgba(14,11,7,0.06);
  color: #7a6e60;
  border: 1px solid rgba(14,11,7,0.1);
}
#modal-title {
  font-family: var(--f-display, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--ink, #0e0b07);
  margin-bottom: 1.25rem;
  letter-spacing: -0.01em;
}
#modal-divider {
  width: 40px;
  height: 2px;
  background: var(--gold, #b8953a);
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}
#modal-body {
  flex: 1;
  position: relative;
  min-height: 140px;
}
#modal-loading {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 1.5rem 0;
}
.modal-loading-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold, #b8953a);
  opacity: 0.4;
  animation: dotPulse 1.4s ease-in-out infinite;
}
.modal-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.modal-loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotPulse {
  0%, 100% { opacity: 0.2; transform: scale(0.85); }
  50%       { opacity: 1;   transform: scale(1); }
}
#modal-text {
  font-family: var(--f-body, 'Spectral', Georgia, serif);
  font-size: 1rem;
  line-height: 1.85;
  font-weight: 300;
  color: #3a3028;
  font-style: italic;
  transition: opacity 0.4s ease;
  white-space: pre-wrap;
}
#modal-footer {
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(184,149,58,0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
#modal-footer-label {
  font-family: var(--f-sc, 'Cormorant SC', Georgia, serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(90,78,66,0.5);
  text-transform: uppercase;
}
#modal-footer-ornament {
  font-size: 0.75rem;
  color: rgba(184,149,58,0.4);
}

/* GALERIA — cursor pointer e micro interação */
.gallery-card { cursor: pointer; }
.gallery-card:active { transform: scale(0.98); }

@media (max-width: 680px) {
  #book-modal { grid-template-columns: 1fr; max-height: 95vh; }
  #modal-book-cover { min-height: 220px; }
  #modal-content { padding: 1.75rem 1.5rem 1.5rem; }
  #modal-title { font-size: 1.8rem; }
}
`;
document.head.appendChild(modalStyles);

/* ====================================================
   VINCULAR CLIQUES NOS CARDS DA GALERIA
==================================================== */
function bindGalleryCards() {
  document.querySelectorAll('.gallery-card').forEach(card => {
    const titleEl = card.querySelector('.book-title');
    if (!titleEl) return;
    // Extrair texto limpo (removendo tags <em>)
    const rawText = titleEl.innerText || titleEl.textContent;
    const title   = rawText.replace(/\s+/g, ' ').trim();

    // Verificar se corresponde a alguma entrada conhecida
    const matchedTitle = Object.keys(bookData).find(k =>
      title.toLowerCase().includes(k.toLowerCase().split(' ')[0]) &&
      title.toLowerCase().includes(k.toLowerCase().split(' ').slice(-1)[0])
    );

    if (matchedTitle) {
      card.setAttribute('data-book', matchedTitle);
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver resumo de ${matchedTitle}`);
      card.addEventListener('click', (e) => {
        // Prevenir que o marquee pause interfira
        e.stopPropagation();
        openBookModal(matchedTitle);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openBookModal(matchedTitle);
        }
      });
    }
  });
}

// Aguardar DOM completo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindGalleryCards);
} else {
  bindGalleryCards();
}
