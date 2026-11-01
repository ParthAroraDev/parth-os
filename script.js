/**
 * PARTH ARORA — FUTURISTIC PERSONAL PORTFOLIO
 * Vanilla JavaScript (ES6+) — Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initCustomCursor();
  initNavigation();
  initTechStackDrawer();
  initProjectFilters();
  initProjectModals();
  initAmbientSynth();
  initContactActions();
  initScrollAnimations();
});

/* ==========================================================================
   1. BACKGROUND PARTICLES & CYBER MATRIX CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 150 };
  let animationFrameId;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    resize();
    animate();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.6 ? 'rgba(0, 217, 255, ' : 'rgba(128, 103, 255, ';
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion/glow
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.5;
        this.y -= Math.sin(angle) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. CUSTOM ANIMATED CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!dot || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  // Hover states on interactive items
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .tech-item-btn, .channel-card, .timeline-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });
}

/* ==========================================================================
   3. NAVIGATION, SCROLLSPY & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveSection();
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
        menuToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // Scrollspy active state
  function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Scroll to top button
  const scrollTopBtn = document.querySelector('.btn-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   4. TECH STACK INTERACTIVE DRAWER
   ========================================================================== */
const TECH_DETAILS = {
  python: {
    title: 'Python Development',
    status: 'Actively Exploring & Building',
    desc: 'My primary language for rapid prototyping, computational logic, game development experiments with Pygame, and hackathon prototypes like AVANI with Streamlit and Gemini API.',
    quote: '"Building logic and scripts that turn complex ideas into accessible prototypes."'
  },
  cpp: {
    title: 'C++ & Problem Solving',
    status: 'Core Academic & DSA Track',
    desc: 'Focusing on standard template library (STL), algorithmic thinking, memory concepts, and time/space complexity optimization as part of my 1st-year computer science coursework.',
    quote: '"Learning how computing actually works at the memory and performance level."'
  },
  htmlcss: {
    title: 'Modern HTML5 & CSS3',
    status: 'Semantic Layout & Design Craft',
    desc: 'Building responsive interfaces from the ground up without heavy bloated frameworks. Mastering flexbox, CSS grid, custom animations, accessible markup, and clean design systems.',
    quote: '"Design is not just how it looks, but how cleanly it translates into structural code."'
  },
  javascript: {
    title: 'Vanilla JavaScript (ES6+)',
    status: 'DOM Mastery & Browser APIs',
    desc: 'Writing clean, asynchronous JavaScript. Exploring the Canvas API, Web Audio API, event loops, local state management, and real client-side interactions.',
    quote: '"Mastering the native platform before reaching for external dependencies."'
  },
  git: {
    title: 'Git & GitHub',
    status: 'Workflow & Version Control',
    desc: 'Using Git for branch management, commit hygiene, open-source exploration, and tracking iterative progress across college experiments and collaborative projects.',
    quote: '"Every commit is a snapshot of curiosity and learning in progress."'
  },
  streamlit: {
    title: 'Streamlit Platform',
    status: 'Rapid Data & AI Prototyping',
    desc: 'Utilized in the AVANI Smart India Hackathon weather project to deploy data-driven interfaces and conversational models quickly in pure Python.',
    quote: '"Connecting backend Python logic to usable web dashboards in record time."'
  },
  aiml: {
    title: 'Artificial Intelligence & LLMs',
    status: 'Prompt Engineering & API Exploration',
    desc: 'Experimenting with modern LLM APIs (like Google Gemini) and open weather models. Exploring how conversational interfaces can simplify complex multi-source data.',
    quote: '"Excited to explore how intelligent systems can augment human decision-making."'
  },
  gamedev: {
    title: 'Game Development (Pygame)',
    status: 'Core Loops & Collision Physics',
    desc: 'Developing classic games like Snake and Pong from scratch. Exploring game state loops, frame rate capping, 2D vector collisions, and basic heuristic computer opponents.',
    quote: '"Games are the most unforgiving test of clean event loops and input handling."'
  },
  creative: {
    title: 'Creative Technology & Audio',
    status: 'Interactive Web Experiments',
    desc: 'Combining visual design, typography, canvas animations, and Web Audio API synthesis. Bridging visual storytelling and programmatic digital experiences.',
    quote: '"Where code ceases to be just technical and becomes an expressive canvas."'
  }
};

function initTechStackDrawer() {
  const techButtons = document.querySelectorAll('.tech-item-btn');
  const drawer = document.getElementById('tech-detail-drawer');
  if (!drawer) return;

  const titleEl = drawer.querySelector('.tech-drawer-title');
  const statusEl = drawer.querySelector('.tech-drawer-status');
  const bodyEl = drawer.querySelector('.tech-drawer-body');
  const closeBtn = drawer.querySelector('.tech-drawer-close');

  techButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tech');
      const data = TECH_DETAILS[key];
      if (!data) return;

      techButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      titleEl.innerHTML = `${data.title} <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: normal;">[${data.status}]</span>`;
      bodyEl.innerHTML = `<p style="margin-bottom: 0.75rem;">${data.desc}</p><p style="color: var(--accent-cyan); font-style: italic; font-size: 0.875rem;">${data.quote}</p>`;
      
      drawer.classList.add('visible');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('visible');
      techButtons.forEach((b) => b.classList.remove('active'));
    });
  }
}

/* ==========================================================================
   5. PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT MODALS & LIVE PLAYABLE DEMOS
   ========================================================================== */
const PROJECT_DATA = {
  avani: {
    title: 'AVANI — Weather Intelligence Platform',
    category: 'Hackathon Project · SIH Problem Statement',
    badge: 'SIH Solution',
    tech: ['Python', 'Streamlit', 'Gemini API', 'Open-Meteo API'],
    description: 'A weather-focused conversational intelligence platform developed around a Smart India Hackathon problem statement. AVANI addresses the challenge of making technical meteorological data genuinely actionable for ordinary citizens, farmers, and travelers.',
    learnings: [
      'API Integration: Bridging real-time Open-Meteo weather forecasts with generative AI reasoning.',
      'Conversational UX: Prompt structure allowing the model to summarize humidity, precipitation chances, and agricultural warnings concisely.',
      'Streamlit Deployment: Architecting reactive components and session states in pure Python.'
    ],
    interactiveType: 'weather_sim',
    github: 'https://github.com/ParthAroraDev/'
  },
  histara: {
    title: 'HISTARA — Heritage Experience Concept',
    category: 'Product Concept & Travel Tech',
    badge: 'Product Concept',
    tech: ['System Design', 'UX Architecture', 'Location APIs', 'QR Systems'],
    description: 'An integrated heritage exploration concept designed to revolutionize how tourists and history enthusiasts engage with cultural monuments and destinations.',
    learnings: [
      'Physical-Digital Bridges: Formulating QR access points at monument nodes to unlock contextual bite-sized historical narratives.',
      'Crowd Dynamics: Conceptualizing live density heatmaps to distribute visitor congestion evenly across historic complexes.',
      'Accessibility: Designing multi-lingual audio tour architectures without requiring bulky hardware rentals.'
    ],
    interactiveType: 'heritage_sim',
    github: 'https://github.com/ParthAroraDev/'
  },
  snake: {
    title: 'Retro Snake Game',
    category: 'Game Development Experiment',
    badge: 'Playable Mini-Game',
    tech: ['Python', 'Pygame', 'Game Loops', '2D Coordinate Grids'],
    description: 'A recreation of the iconic classic Snake game, built from scratch as part of my programming foundation journey. Implemented in Python with Pygame, and ported here to Canvas for live in-browser testing!',
    learnings: [
      'Deterministic Game Loops: Fixed timestamp updates for smooth grid motion independent of frame rate.',
      'Queue-Based Body Mechanics: Managing coordinate arrays that shift dynamically on food ingestion.',
      'Collision Physics: Boundary detection and self-intersect checking.'
    ],
    interactiveType: 'snake_game',
    github: 'https://github.com/ParthAroraDev/'
  },
  pong: {
    title: 'Pong Arcade Simulator',
    category: 'Arcade Game Development',
    badge: 'Playable Arcade',
    tech: ['Python', 'Pygame', 'Physics Loops', 'Heuristic AI'],
    description: 'A dual-paddle arcade simulator featuring real-time collision dynamics, paddle deflection angles based on impact points, and an adjustable AI opponent.',
    learnings: [
      'Elastic Collision Math: Calculating deflection vectors according to offset distance from paddle center.',
      'Heuristic AI Opponent: Implementing predictive tracking logic with intentional reaction delay to maintain gameplay fun.',
      'Score State Management: Continuous win-condition evaluation and round resets.'
    ],
    interactiveType: 'pong_game',
    github: 'https://github.com/ParthAroraDev/'
  },
  recipescaler: {
    title: 'Dynamic Recipe Ingredient Scaler',
    category: 'Web Development / Competition',
    badge: 'Live Interactive App',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
    description: 'A responsive utility built for a no-code / rapid development competition that computes exact metric and imperial culinary ingredient ratios based on user-adjusted serving counts.',
    learnings: [
      'Input Validation: Sanitizing numeric inputs and handling fractional culinary measures (e.g., 1/2 tsp to grams).',
      'Local Persistence: Caching custom recipes into browser localStorage without requiring a backend.',
      'State Reactivity: Instant calculations triggering zero-flicker DOM updates.'
    ],
    interactiveType: 'recipe_scaler',
    github: 'https://github.com/ParthAroraDev/'
  },
  swiggy: {
    title: 'Swiggy UI Clone Experiment',
    category: 'Frontend Engineering Practice',
    badge: 'Interface Recreation',
    tech: ['HTML5', 'CSS Grid', 'Flexbox', 'Responsive Design'],
    description: 'A deep-dive frontend layout study exploring the intricate design patterns of India\'s largest food delivery platform. Recreated key layout components, responsive restaurant cards, filtering headers, and checkout mockups.',
    learnings: [
      'Complex Layout Systems: Coordinating multi-tier CSS Grid and Flexbox hierarchies across varying viewports.',
      'Mobile-First Responsiveness: Crafting bottom-navigation and drawer trays for thumb accessibility.',
      'Visual Consistency: Matching spacing rhythms, typography weights, and card shadow elevations.'
    ],
    interactiveType: 'swiggy_sim',
    github: 'https://github.com/ParthAroraDev/'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const titleEl = modalOverlay.querySelector('.modal-title');
  const kickerEl = modalOverlay.querySelector('.modal-category-kicker');
  const descEl = modalOverlay.querySelector('.modal-desc');
  const techContainer = modalOverlay.querySelector('.modal-tech-tags');
  const learningsList = modalOverlay.querySelector('.modal-learnings-list');
  const interactiveArea = modalOverlay.querySelector('.modal-interactive-canvas-container');
  const githubBtn = modalOverlay.querySelector('.modal-github-btn');

  function openModal(projectId) {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    titleEl.textContent = data.title;
    kickerEl.textContent = data.category;
    descEl.textContent = data.description;
    
    // Tech tags
    techContainer.innerHTML = '';
    data.tech.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      techContainer.appendChild(span);
    });

    // Learnings
    learningsList.innerHTML = '';
    data.learnings.forEach((l) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';
      li.style.fontSize = '0.875rem';
      li.style.color = 'var(--text-secondary)';
      li.innerHTML = `<strong style="color: var(--text-primary);">${l.split(':')[0]}:</strong>${l.split(':')[1] || ''}`;
      learningsList.appendChild(li);
    });

    if (githubBtn) {
      githubBtn.href = data.github;
    }

    // Render interactive simulation/game
    renderInteractiveWidget(data.interactiveType, interactiveArea);

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (window.activeGameLoop) {
      cancelAnimationFrame(window.activeGameLoop);
      window.activeGameLoop = null;
    }
  }

  // Trigger buttons
  document.querySelectorAll('[data-project-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-project-trigger');
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Render Live Interactive Features in Modal
 */
function renderInteractiveWidget(type, container) {
  if (!container) return;
  if (window.activeGameLoop) {
    cancelAnimationFrame(window.activeGameLoop);
    window.activeGameLoop = null;
  }
  container.innerHTML = '';

  if (type === 'snake_game') {
    renderPlayableSnake(container);
  } else if (type === 'pong_game') {
    renderPlayablePong(container);
  } else if (type === 'recipe_scaler') {
    renderLiveRecipeScaler(container);
  } else if (type === 'weather_sim') {
    renderWeatherSimulator(container);
  } else if (type === 'heritage_sim') {
    renderHeritageSimulator(container);
  } else if (type === 'swiggy_sim') {
    renderSwiggyInspector(container);
  }
}

/* --- PLAYABLE SNAKE GAME --- */
function renderPlayableSnake(container) {
  container.innerHTML = `
    <div style="padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
      <div style="display: flex; justify-content: space-between; width: 100%; max-width: 400px; font-family: var(--font-mono); font-size: 0.8125rem;">
        <span style="color: var(--accent-cyan);">SNAKE ARCADE SIMULATOR</span>
        <span style="color: var(--text-primary);">SCORE: <strong id="snake-score" style="color: #38ef7d;">0</strong></span>
      </div>
      <canvas id="snake-canvas" width="400" height="280" style="background: #04070D; border: 1px solid var(--border-subtle); border-radius: 8px; max-width: 100%;"></canvas>
      <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.25rem;">
        <button id="snake-restart-btn" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.75rem;">Start / Reset Game</button>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">Use Arrow Keys or WASD to navigate</span>
      </div>
    </div>
  `;

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('snake-score');
  const restartBtn = document.getElementById('snake-restart-btn');

  const gridSize = 16;
  const tileCountX = canvas.width / gridSize;
  const tileCountY = canvas.height / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 10 };
  let dx = 1, dy = 0;
  let nextDx = 1, nextDy = 0;
  let score = 0;
  let gameRunning = true;
  let lastTime = 0;
  const speed = 100; // ms per move

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
  }

  function handleKey(e) {
    if (['ArrowUp', 'KeyW'].includes(e.code) && dy === 0) { nextDx = 0; nextDy = -1; e.preventDefault(); }
    if (['ArrowDown', 'KeyS'].includes(e.code) && dy === 0) { nextDx = 0; nextDy = 1; e.preventDefault(); }
    if (['ArrowLeft', 'KeyA'].includes(e.code) && dx === 0) { nextDx = -1; nextDy = 0; e.preventDefault(); }
    if (['ArrowRight', 'KeyD'].includes(e.code) && dx === 0) { nextDx = 1; nextDy = 0; e.preventDefault(); }
  }
  window.addEventListener('keydown', handleKey);

  function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; dy = 0;
    nextDx = 1; nextDy = 0;
    score = 0;
    scoreEl.textContent = score;
    placeFood();
    gameRunning = true;
  }

  restartBtn.addEventListener('click', resetGame);

  function updateSnake(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > speed && gameRunning) {
      lastTime = timestamp;
      dx = nextDx;
      dy = nextDy;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall wrap
      if (head.x < 0) head.x = tileCountX - 1;
      if (head.x >= tileCountX) head.x = 0;
      if (head.y < 0) head.y = tileCountY - 1;
      if (head.y >= tileCountY) head.y = 0;

      // Self collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          gameRunning = false;
          break;
        }
      }

      if (gameRunning) {
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          score += 10;
          scoreEl.textContent = score;
          placeFood();
        } else {
          snake.pop();
        }
      }
    }

    // Render
    ctx.fillStyle = '#060A12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = '#FF4F70';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF4F70';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? '#00D9FF' : '#38EF7D';
      ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    if (!gameRunning) {
      ctx.fillStyle = 'rgba(4, 7, 12, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('COLLISION DETECTED! GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#00D9FF';
      ctx.fillText('Click Start to Retry', canvas.width / 2, canvas.height / 2 + 15);
    }

    window.activeGameLoop = requestAnimationFrame(updateSnake);
  }

  window.activeGameLoop = requestAnimationFrame(updateSnake);
}

/* --- PLAYABLE PONG GAME --- */
function renderPlayablePong(container) {
  container.innerHTML = `
    <div style="padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
      <div style="display: flex; justify-content: space-between; width: 100%; max-width: 440px; font-family: var(--font-mono); font-size: 0.8125rem;">
        <span style="color: var(--accent-cyan);">YOU: <strong id="player-score" style="color: #00D9FF;">0</strong></span>
        <span style="color: var(--text-muted);">PONG AI TESTBED</span>
        <span style="color: var(--accent-violet);">HEURISTIC AI: <strong id="ai-score" style="color: #8067FF;">0</strong></span>
      </div>
      <canvas id="pong-canvas" width="440" height="260" style="background: #04070D; border: 1px solid var(--border-subtle); border-radius: 8px; max-width: 100%;"></canvas>
      <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
        Move your mouse over the canvas to control the left paddle
      </div>
    </div>
  `;

  const canvas = document.getElementById('pong-canvas');
  const ctx = canvas.getContext('2d');
  const pScoreEl = document.getElementById('player-score');
  const aiScoreEl = document.getElementById('ai-score');

  let playerScore = 0;
  let aiScore = 0;

  const paddleWidth = 8, paddleHeight = 55;
  let playerY = canvas.height / 2 - paddleHeight / 2;
  let aiY = canvas.height / 2 - paddleHeight / 2;

  let ballX = canvas.width / 2, ballY = canvas.height / 2;
  let ballSpeedX = 4, ballSpeedY = 2.5;
  const ballSize = 7;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerY = (e.clientY - rect.top) - paddleHeight / 2;
    // Bound player
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
  });

  function resetBall(servingPlayer) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = servingPlayer === 'player' ? 4 : -4;
    ballSpeedY = (Math.random() - 0.5) * 5;
  }

  function loopPong() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top & Bottom walls
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    // AI movement (heuristic tracking)
    const targetY = ballY - paddleHeight / 2;
    aiY += (targetY - aiY) * 0.085;
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - paddleHeight) aiY = canvas.height - paddleHeight;

    // Player paddle hit
    if (ballX - ballSize < 15 + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
      ballSpeedX = Math.abs(ballSpeedX) * 1.05;
      const hitOffset = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
      ballSpeedY = hitOffset * 5;
    }

    // AI paddle hit
    if (ballX + ballSize > canvas.width - 15 - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
      ballSpeedX = -Math.abs(ballSpeedX) * 1.05;
      const hitOffset = (ballY - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
      ballSpeedY = hitOffset * 5;
    }

    // Goal checks
    if (ballX < 0) {
      aiScore++;
      aiScoreEl.textContent = aiScore;
      resetBall('player');
    } else if (ballX > canvas.width) {
      playerScore++;
      pScoreEl.textContent = playerScore;
      resetBall('ai');
    }

    // Render
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center divider
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player Paddle
    ctx.fillStyle = '#00D9FF';
    ctx.fillRect(15, playerY, paddleWidth, paddleHeight);

    // AI Paddle
    ctx.fillStyle = '#8067FF';
    ctx.fillRect(canvas.width - 15 - paddleWidth, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    window.activeGameLoop = requestAnimationFrame(loopPong);
  }

  window.activeGameLoop = requestAnimationFrame(loopPong);
}

/* --- LIVE RECIPE SCALER WIDGET --- */
function renderLiveRecipeScaler(container) {
  const defaultRecipe = {
    name: 'Hackathon Energizer Brownies',
    baseServings: 4,
    ingredients: [
      { name: 'Dark Cocoa Powder', amount: 60, unit: 'g' },
      { name: 'Granulated Sugar', amount: 150, unit: 'g' },
      { name: 'Unsalted Butter', amount: 100, unit: 'g' },
      { name: 'All-Purpose Flour', amount: 80, unit: 'g' },
      { name: 'Whole Eggs', amount: 2, unit: 'pcs' },
      { name: 'Espresso Powder', amount: 1, unit: 'tsp' }
    ]
  };

  container.innerHTML = `
    <div style="padding: 1.5rem; background: #080C16;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.2rem;">${defaultRecipe.name}</h4>
          <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono);">Client-Side Reactive Scaling Engine</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 0.8125rem; color: var(--text-muted);">Servings:</span>
          <button id="serv-minus" style="width: 28px; height: 28px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: white; border-radius: 4px; cursor: pointer;">-</button>
          <span id="serv-count" style="font-family: var(--font-mono); font-weight: bold; min-width: 20px; text-align: center; color: var(--accent-cyan);">4</span>
          <button id="serv-plus" style="width: 28px; height: 28px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: white; border-radius: 4px; cursor: pointer;">+</button>
        </div>
      </div>
      <div id="recipe-ingredients-table" style="display: grid; gap: 0.5rem;"></div>
    </div>
  `;

  let currentServings = 4;
  const countEl = container.querySelector('#serv-count');
  const tableEl = container.querySelector('#recipe-ingredients-table');

  function renderRows() {
    countEl.textContent = currentServings;
    const factor = currentServings / defaultRecipe.baseServings;

    tableEl.innerHTML = defaultRecipe.ingredients.map((ing) => {
      const scaled = (ing.amount * factor).toFixed(factor % 1 === 0 ? 0 : 1);
      return `
        <div style="display: flex; justify-content: space-between; padding: 0.6rem 0.85rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 6px; font-size: 0.875rem;">
          <span style="color: var(--text-secondary);">${ing.name}</span>
          <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 600;">${scaled} ${ing.unit}</span>
        </div>
      `;
    }).join('');
  }

  container.querySelector('#serv-minus').addEventListener('click', () => {
    if (currentServings > 1) {
      currentServings--;
      renderRows();
    }
  });

  container.querySelector('#serv-plus').addEventListener('click', () => {
    if (currentServings < 32) {
      currentServings++;
      renderRows();
    }
  });

  renderRows();
}

/* --- AVANI WEATHER SIMULATOR --- */
function renderWeatherSimulator(container) {
  const PRESET_QUERIES = [
    { label: 'Faridabad Current', query: 'What is the current atmospheric condition in Faridabad?' },
    { label: 'Monsoon Alert', query: 'Assess weekend rainfall risk for Haryana agricultural belt' },
    { label: 'Travel Advisory', query: 'Will afternoon smog impact Delhi-Faridabad commute?' }
  ];

  container.innerHTML = `
    <div style="padding: 1.5rem; background: #080D18;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">AVANI WEATHER INTELLIGENCE KERNEL</span>
        <span style="font-size: 0.6875rem; color: #38ef7d; font-family: var(--font-mono);">LIVE SIMULATION MODE</span>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
        ${PRESET_QUERIES.map((p, idx) => `
          <button class="avani-query-btn" data-query="${p.query}" style="font-size: 0.75rem; background: rgba(0,217,255,0.08); border: 1px solid var(--border-accent); color: var(--accent-cyan); padding: 0.35rem 0.75rem; border-radius: 4px; cursor: pointer;">
            ${p.label}
          </button>
        `).join('')}
      </div>
      <div id="avani-chat-output" style="background: rgba(4,7,12,0.8); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1rem; min-height: 120px; font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
        Select a query prompt above or type to test AVANI's conversational meteorological logic.
      </div>
    </div>
  `;

  const output = container.querySelector('#avani-chat-output');
  container.querySelectorAll('.avani-query-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      output.innerHTML = `
        <div style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.75rem;">Query: "${q}"</div>
        <div style="color: var(--accent-cyan); font-weight: 600; margin-bottom: 0.25rem;">[AVANI Intelligence Dispatch]:</div>
        <div>
          Temperature: <strong>26.4°C</strong> · Relative Humidity: <strong>48%</strong> · AQI: <strong>142 (Moderate)</strong><br>
          <em>Analysis: Stable pressure gradient across NCR. Low convective precipitation probability (<10%) over the next 36 hours. Recommended: Standard irrigation schedules can proceed unhampered.</em>
        </div>
      `;
    });
  });
}

/* --- HISTARA HERITAGE SIMULATOR --- */
function renderHeritageSimulator(container) {
  container.innerHTML = `
    <div style="padding: 1.5rem; background: #080D18; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
      <div style="border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.02);">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-violet);">QR LOCATION BEACON</span>
        <div style="margin: 0.75rem 0; padding: 1rem; background: #030509; border: 1px dashed var(--accent-violet); border-radius: 6px; text-align: center; color: var(--text-muted); font-size: 0.8125rem;">
          [Monument ID: QUTB-MINAR-N04]<br>
          <span style="color: var(--accent-cyan); font-size: 0.75rem;">GPS: 28.5244° N, 77.1855° E</span>
        </div>
        <button id="histara-trigger-audio" style="width: 100%; padding: 0.5rem; background: var(--accent-violet); color: white; border: none; border-radius: 4px; font-weight: 600; font-size: 0.75rem; cursor: pointer;">
          Simulate Story Narrative Playback
        </button>
      </div>
      <div id="histara-narrative-display" style="border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 8px; background: rgba(4,7,12,0.8); font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6;">
        Tap the simulation button to experience HISTARA's proximity-triggered historical narration engine.
      </div>
    </div>
  `;

  const trigger = container.querySelector('#histara-trigger-audio');
  const display = container.querySelector('#histara-narrative-display');

  trigger.addEventListener('click', () => {
    display.innerHTML = `
      <div style="color: var(--accent-violet); font-weight: 600; margin-bottom: 0.4rem; font-family: var(--font-mono); font-size: 0.75rem;">
        PLAYING: IRON PILLAR OF DELHI (4TH CENTURY CE)
      </div>
      <p style="margin-bottom: 0.5rem;">
        "Standing before you is a 7.21-meter metallurgical marvel. Cast during the Gupta Empire, its high phosphorus content and formation of an amorphous protective iron-hydrogen-phosphate film has prevented rust for over 1,600 monsoons..."
      </p>
      <div style="display: flex; gap: 0.5rem; font-size: 0.6875rem; color: var(--text-muted);">
        <span>Crowd Density: Low (18%)</span> · <span>Next Stop: Alai Minar (120m)</span>
      </div>
    `;
  });
}

/* --- SWIGGY INSPECTOR --- */
function renderSwiggyInspector(container) {
  container.innerHTML = `
    <div style="padding: 1.5rem; background: #080D18;">
      <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">RESPONSIVE LAYOUT MECHANICS STUDY</span>
      <p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0.5rem 0 1rem;">
        Interactive dissection of the restaurant card and navigation grid hierarchy implemented in this layout practice project.
      </p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; font-size: 0.75rem;">
        <div style="border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 6px; background: rgba(255,255,255,0.02);">
          <strong style="color: var(--accent-cyan); display: block; margin-bottom: 0.25rem;">CSS Grid Ratio</strong>
          12-column adaptive layout scaling down to 1-column mobile sheet without layout shifts.
        </div>
        <div style="border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 6px; background: rgba(255,255,255,0.02);">
          <strong style="color: var(--accent-cyan); display: block; margin-bottom: 0.25rem;">Image Aspect Math</strong>
          Consistent 16:9 banner framing with linear gradient scrim for text contrast compliance.
        </div>
        <div style="border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 6px; background: rgba(255,255,255,0.02);">
          <strong style="color: var(--accent-cyan); display: block; margin-bottom: 0.25rem;">Filter Bar Sticks</strong>
          Sticky category bar with CSS scroll-padding and native smooth horizontal touch sliding.
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   7. AMBIENT AUDIO SYNTH (WEB AUDIO API)
   ========================================================================== */
function initAmbientSynth() {
  const toggleBtn = document.getElementById('toggle-synth-btn');
  const statusEl = document.getElementById('synth-status-text');
  const canvas = document.getElementById('synth-visualizer');
  if (!toggleBtn || !canvas) return;

  const ctx = canvas.getContext('2d');
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];
  let analyser = null;
  let animId = null;

  function startSynth() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.5);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    // Harmonic sci-fi drone chord: A2 (110Hz), E3 (164.81Hz), A3 (220Hz), C#4 (277.18Hz)
    const freqs = [110, 164.81, 220, 277.18];
    oscillators = freqs.map((freq, i) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle detune for rich celestial warmth
      osc.detune.setValueAtTime((i - 1.5) * 4, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      return osc;
    });

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    isPlaying = true;
    toggleBtn.innerHTML = `<span>■ Pause Ambient Sound</span>`;
    toggleBtn.style.background = 'var(--accent-violet)';
    toggleBtn.style.color = '#FFFFFF';
    statusEl.textContent = 'STATUS: HARMONIC DRONE ACTIVE (432Hz HARMONICS)';
    drawVisualizer();
  }

  function stopSynth() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        oscillators.forEach(o => o.stop());
        oscillators = [];
        audioCtx.close();
        audioCtx = null;
      }, 850);
    }
    isPlaying = false;
    toggleBtn.innerHTML = `<span>▶ Play Ambient Focus Drone</span>`;
    toggleBtn.style.background = '';
    toggleBtn.style.color = '';
    statusEl.textContent = 'STATUS: STANDBY (WEB AUDIO API)';
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawVisualizer() {
    if (!isPlaying || !analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      ctx.fillStyle = `rgba(128, 103, 255, ${0.3 + (dataArray[i] / 255) * 0.7})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }

    animId = requestAnimationFrame(drawVisualizer);
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  });
}

/* ==========================================================================
   8. CONTACT FORM & ONE-CLICK EMAIL ACTIONS
   ========================================================================== */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('copy-toast');
  const emailVal = 'partharora.techie@gmail.com';

  if (copyBtn && toast) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailVal).then(() => {
        toast.textContent = 'COPIED TO CLIPBOARD: ' + emailVal;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }).catch(() => {
        toast.textContent = 'EMAIL: ' + emailVal;
        toast.classList.add('show');
      });
    });
  }

  // Functional client-side message composer: prepares mailto cleanly
  const form = document.getElementById('composer-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const senderEmail = document.getElementById('sender-email').value.trim();
      const topic = document.getElementById('sender-topic').value.trim() || 'Connecting via Parth Arora Portfolio';
      const message = document.getElementById('sender-msg').value.trim();

      const bodyText = `Hi Parth,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ABest regards,%0D%0A${encodeURIComponent(name)} (${encodeURIComponent(senderEmail)})`;
      const mailtoUrl = `mailto:${emailVal}?subject=${encodeURIComponent(topic)}&body=${bodyText}`;

      window.location.href = mailtoUrl;

      if (toast) {
        toast.textContent = 'OPENING YOUR EMAIL CLIENT...';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }
    });
  }
}

/* ==========================================================================
   9. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.project-card, .timeline-entry, .beyond-card, .info-card, .tech-column');
  
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    observer.observe(el);
  });
}
