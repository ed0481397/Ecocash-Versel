/**
 * EcoCash - Lógica Principal de la Aplicación
 * Gestiona navegación, renderizado dinámico, interacción con IA, Mercado, DIY y Comentarios
 */

const AppState = {
  materials: [...INITIAL_MATERIALS_WIKI],
  marketPosts: [],
  diyProjects: [],
  comments: [],
  selectedPost: null,
  selectedSticker: 'brote',
  currentTab: 'market',
  marketTypeFilter: 'all',
  marketCategoryFilter: 'all',
  marketSearchQuery: '',
  diyFilter: 'all',
  onlyMyPosts: false,

  init() {
    // Cargar datos persistidos en localStorage o usar semillas
    const savedPosts = localStorage.getItem('ecocash_market_posts');
    this.marketPosts = savedPosts ? JSON.parse(savedPosts) : [...INITIAL_MARKET_POSTS];

    const savedDIY = localStorage.getItem('ecocash_diy_projects');
    this.diyProjects = savedDIY ? JSON.parse(savedDIY) : [...INITIAL_DIY_PROJECTS];

    const savedComments = localStorage.getItem('ecocash_comments');
    this.comments = savedComments ? JSON.parse(savedComments) : [...INITIAL_COMMENTS];

    // Inicializar autenticación
    EcoAuth.init();
    EcoAuth.onAuthChange(() => {
      this.renderUserNav();
      this.renderMarket();
      this.renderDIY();
      if (this.selectedPost) {
        this.renderPostComments(this.selectedPost.id);
      }
    });

    // Renderizados iniciales
    this.renderStickerPickers();
    this.renderWikiMaterials();
    this.renderMarket();
    this.renderDIY();
    this.renderCommunityComments();

    console.log("EcoCash App inicializada con éxito.");
  },

  saveMarket() {
    localStorage.setItem('ecocash_market_posts', JSON.stringify(this.marketPosts));
  },

  saveDIY() {
    localStorage.setItem('ecocash_diy_projects', JSON.stringify(this.diyProjects));
  },

  saveComments() {
    localStorage.setItem('ecocash_comments', JSON.stringify(this.comments));
  },

  // Navegación por pestañas
  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active', 'text-emerald-600'));

    const activeSection = document.getElementById(`section-${tabName}`);
    if (activeSection) activeSection.classList.remove('hidden');

    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active', 'text-emerald-600');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Barra de usuario y perfil
  renderUserNav() {
    const user = EcoAuth.currentUser;
    const authContainer = document.getElementById('user-auth-widget');
    if (!authContainer) return;

    if (user) {
      authContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="relative group cursor-pointer" onclick="AppUI.openModal('modal-auth')">
            <div class="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200">
              <img src="${user.photoURL}" alt="${user.name}" class="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300">
              <div class="text-left hidden sm:block">
                <span class="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">${user.name}</span>
                <span class="block text-[10px] text-emerald-600 font-medium">${user.role || 'Conectado'}</span>
              </div>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <button onclick="AppUI.openModal('modal-create-post')" class="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all">
            <span>➕</span> Publicar
          </button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button onclick="AppUI.openModal('modal-auth')" class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all">
          <span>👤</span> Iniciar Sesión / Google
        </button>
      `;
    }
  },

  // Renderizado del Selector de Stickers Ecológicos
  renderStickerPickers() {
    const containers = [
      document.getElementById('market-comment-stickers'),
      document.getElementById('community-comment-stickers')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = ECOLOGICAL_STICKERS.map(s => `
        <button type="button" 
          onclick="AppState.selectSticker('${s.id}')"
          title="${s.label}: ${s.meaning}"
          class="sticker-item p-1.5 sm:p-2 rounded-xl text-lg sm:text-xl border transition-all ${this.selectedSticker === s.id ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400' : 'bg-slate-50 border-slate-200 hover:bg-white'}">
          ${s.emoji}
        </button>
      `).join('');
    });
  },

  selectSticker(stickerId) {
    this.selectedSticker = stickerId;
    this.renderStickerPickers();
    const sticker = ECOLOGICAL_STICKERS.find(s => s.id === stickerId);
    if (sticker) {
      AppUI.showToast(`Sticker: ${sticker.emoji} ${sticker.label}`, sticker.meaning, 'info');
    }
  },

  // ==========================================
  // SECCIÓN 1: ECO-WIKI Y ASESOR IA
  // ==========================================
  renderWikiMaterials() {
    const grid = document.getElementById('wiki-materials-grid');
    if (!grid) return;

    grid.innerHTML = this.materials.map(m => `
      <div class="glass-card rounded-2xl p-5 glass-card-hover border border-slate-200/80 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <span class="text-3xl p-2 rounded-xl bg-slate-100">${m.icon}</span>
            <span class="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ${m.code}
            </span>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">${m.name}</h4>
            <p class="text-xs text-slate-500 font-medium">${m.type}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
            <p><strong class="text-slate-700">Ejemplos:</strong> <span class="text-slate-600">${m.examples}</span></p>
            <p><strong class="text-slate-700">Preparación:</strong> <span class="text-slate-600">${m.preparation}</span></p>
            <p><strong class="text-slate-700">Dónde llevar:</strong> <span class="text-emerald-700 font-semibold">${m.whereToTake}</span></p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-400 font-medium">Cotización:</span>
          <span class="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">${m.estimatedValue}</span>
        </div>
      </div>
    `).join('');
  },

  async handleWikiSearch(e) {
    e.preventDefault();
    const queryInput = document.getElementById('wiki-search-input');
    const query = queryInput.value.trim();
    if (!query) return;

    const loading = document.getElementById('wiki-loading');
    const resultBox = document.getElementById('wiki-search-result');
    const titleEl = document.getElementById('wiki-result-title');
    const bodyEl = document.getElementById('wiki-result-body');

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
      const data = await EcoAI.searchWiki(query);
      titleEl.innerText = `Guía Ecológica: ${query}`;
      bodyEl.innerHTML = data.summary;
      resultBox.classList.remove('hidden');
    } catch (err) {
      AppUI.showToast("Error en Eco-Wiki", "No se pudo completar la consulta con la IA.", "error");
    } finally {
      loading.classList.add('hidden');
    }
  },

  async handleAskAdvisor(e) {
    e.preventDefault();
    const input = document.getElementById('advisor-input');
    const query = input.value.trim();
    if (!query) return;

    const loading = document.getElementById('advisor-loading');
    const card = document.getElementById('advisor-result-card');

    loading.classList.remove('hidden');
    card.classList.add('hidden');

    try {
      const res = await EcoAI.askAdvisor(query);
      
      document.getElementById('advisor-res-item').innerText = res.item || query;
      document.getElementById('advisor-res-recycle').innerText = res.canRecycle;
      document.getElementById('advisor-res-prep').innerText = res.preparation;
      document.getElementById('advisor-res-where').innerText = res.whereToTake;
      document.getElementById('advisor-res-diy').innerText = res.upcycleIdea;
      document.getElementById('advisor-res-impact').innerText = res.environmentalImpact || 'Ahorro de materias primas vírgenes.';
      
      const badge = document.getElementById('advisor-res-badge');
      if (res.canRecycle.toLowerCase().includes('sí') || res.canRecycle.toLowerCase().includes('si')) {
        badge.className = "px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300";
        badge.innerText = "✅ Reciclable";
      } else if (res.canRecycle.toLowerCase().includes('peligroso') || res.canRecycle.toLowerCase().includes('especial')) {
        badge.className = "px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-300";
        badge.innerText = "⚠️ Manejo Especial / Peligroso";
      } else {
        badge.className = "px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300";
        badge.innerText = "ℹ️ Condicional";
      }

      card.classList.remove('hidden');
    } catch (err) {
      AppUI.showToast("Error en Asesor IA", "No se pudo obtener el diagnóstico del residuo.", "error");
    } finally {
      loading.classList.add('hidden');
    }
  },

  // ==========================================
  // SECCIÓN 2: ECO-MARKET
  // ==========================================
  renderMarket() {
    const grid = document.getElementById('market-grid');
    if (!grid) return;

    let filtered = [...this.marketPosts];

    if (this.onlyMyPosts && EcoAuth.currentUser) {
      filtered = filtered.filter(p => p.authorUid === EcoAuth.currentUser.uid);
    }

    if (this.marketTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === this.marketTypeFilter);
    }

    if (this.marketCategoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category.includes(this.marketCategoryFilter));
    }

    if (this.marketSearchQuery) {
      const q = this.marketSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <span class="text-5xl">📦</span>
          <h4 class="text-xl font-bold text-slate-800">No hay publicaciones con estos filtros</h4>
          <p class="text-sm text-slate-500 max-w-md mx-auto">Prueba cambiando los filtros o sé el primero en publicar un residuo para reciclar o vender en la escuela.</p>
          <button onclick="AppUI.openModal('modal-create-post')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
            Crear Publicación
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(post => {
      const isOwner = EcoAuth.isOwner(post);
      const typeBadge = post.type === 'Venta' 
        ? `<span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px] border border-emerald-200">💰 En Venta</span>`
        : post.type === 'Donacion'
        ? `<span class="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[11px] border border-blue-200">🎁 Donación / Regalo</span>`
        : `<span class="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full text-[11px] border border-purple-200">🏢 Punto de Acopio</span>`;

      return `
        <div class="glass-card rounded-3xl overflow-hidden glass-card-hover border border-slate-200/90 flex flex-col justify-between">
          <div>
            <!-- Imagen con badge de precio -->
            <div class="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'">
              <div class="absolute top-3 left-3 flex gap-2">
                ${typeBadge}
              </div>
              <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-lg">
                ${post.price}
              </div>
              ${isOwner ? `
                <div class="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <span>⭐</span> Tu publicación
                </div>
              ` : ''}
            </div>

            <!-- Contenido -->
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">${post.category}</span>
                <span>${post.date}</span>
              </div>
              
              <h3 class="font-bold text-slate-900 text-lg leading-snug line-clamp-2">${post.title}</h3>
              <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">${post.description}</p>
              
              <div class="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span>📍</span> <span class="truncate">${post.location}</span>
              </div>
            </div>
          </div>

          <!-- Pie y Acciones de Autor -->
          <div class="p-5 pt-3 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <img src="${post.authorAvatar}" alt="${post.authorName}" class="w-7 h-7 rounded-full bg-slate-200">
                <span class="font-medium text-slate-700 truncate max-w-[130px]">${post.authorName}</span>
              </div>
              <span class="text-slate-400 font-medium">💬 ${this.getPostCommentsCount(post.id)}</span>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button onclick="AppState.openCommentsModal('${post.id}')" class="flex-grow bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5">
                <span>💬</span> Ver y Comentar
              </button>
              
              ${isOwner ? `
                <button onclick="AppState.confirmDeletePost('${post.id}')" title="Solo tú como creador puedes eliminar esta publicación" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs py-2.5 px-3 rounded-xl font-bold transition-all flex items-center gap-1">
                  <span>🗑️</span> Borrar
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  getPostCommentsCount(postId) {
    return this.comments.filter(c => c.postId === postId).length;
  },

  handleCreateMarketPost(e) {
    e.preventDefault();
    if (!EcoAuth.currentUser) {
      AppUI.showToast("Inicia Sesión", "Debes ingresar con tu cuenta para publicar.", "warning");
      AppUI.openModal('modal-auth');
      return;
    }

    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const type = document.getElementById('post-type').value;
    const price = document.getElementById('post-price').value.trim() || '¡GRATIS!';
    const location = document.getElementById('post-location').value.trim();
    const description = document.getElementById('post-desc').value.trim();
    const contact = document.getElementById('post-contact').value.trim();
    const imageInput = document.getElementById('post-image').value.trim();

    const fallbackImages = {
      'Plásticos': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      'Metales / Chatarra': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'Papel y Cartón': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      'Vidrio': 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=600&q=80',
      'Electrónicos': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      'Orgánicos': 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80'
    };

    const newPost = {
      id: `post-${Date.now()}`,
      title,
      category,
      type,
      price,
      location,
      description,
      contact,
      image: imageInput || fallbackImages[category] || fallbackImages['Plásticos'],
      authorUid: EcoAuth.currentUser.uid,
      authorName: EcoAuth.currentUser.name,
      authorAvatar: EcoAuth.currentUser.photoURL,
      date: 'Recién publicado'
    };

    this.marketPosts.unshift(newPost);
    this.saveMarket();
    this.renderMarket();
    AppUI.closeModal('modal-create-post');
    document.getElementById('form-create-post').reset();
    AppUI.showToast("¡Publicación Creada!", "Tu material ya está disponible en el Eco-Market.", "success");
  },

  confirmDeletePost(postId) {
    const post = this.marketPosts.find(p => p.id === postId);
    if (!post) return;

    // Control estricto de permisos
    if (!EcoAuth.isOwner(post)) {
      AppUI.showToast("Acceso Denegado", "Solo el creador original de esta publicación tiene permiso para eliminarla.", "error");
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar tu publicación "${post.title}"? Esta acción no se puede deshacer.`)) {
      this.marketPosts = this.marketPosts.filter(p => p.id !== postId);
      this.saveMarket();
      this.renderMarket();
      AppUI.showToast("Publicación Eliminada", "Se ha removido el elemento del mercado.", "info");
    }
  },

  // ==========================================
  // SECCIÓN 3: COMENTARIOS Y DETECTOR IA ANTI-BULLSHIT
  // ==========================================
  openCommentsModal(postId) {
    const post = this.marketPosts.find(p => p.id === postId);
    if (!post) return;
    this.selectedPost = post;

    document.getElementById('modal-comment-post-title').innerText = post.title;
    document.getElementById('modal-comment-post-desc').innerText = post.description;
    document.getElementById('modal-comment-post-meta').innerText = `${post.category} • ${post.price} • ${post.location}`;
    document.getElementById('modal-comment-post-contact').innerText = `Contacto: ${post.contact || 'En comentarios'}`;

    this.renderPostComments(postId);
    AppUI.openModal('modal-comments');
  },

  renderPostComments(postId) {
    const list = document.getElementById('post-comments-list');
    if (!list) return;

    const postComments = this.comments.filter(c => c.postId === postId);

    if (postComments.length === 0) {
      list.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs">
          <span>🌱</span> Aún no hay comentarios. ¡Sé el primero en iniciar la conversación ecológica!
        </div>
      `;
      return;
    }

    list.innerHTML = postComments.map(c => {
      const isOwner = EcoAuth.currentUser && EcoAuth.currentUser.uid === c.authorUid;
      const sticker = ECOLOGICAL_STICKERS.find(s => s.id === c.stickerId);

      return `
        <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="${c.authorAvatar}" alt="${c.authorName}" class="w-6 h-6 rounded-full bg-slate-100">
              <span class="text-xs font-bold text-slate-800">${c.authorName}</span>
              ${c.aiVerified ? `
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200" title="Verificado por el filtro Anti-Bullshit y Ética Escolar">
                  <span class="ai-pulse-dot">🛡️</span> Eco-AI Verificado
                </span>
              ` : ''}
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-400">${c.timestamp || 'Hoy'}</span>
              ${isOwner ? `
                <button onclick="AppState.deleteComment('${c.id}')" title="Eliminar mi comentario" class="text-slate-400 hover:text-red-500 text-xs transition-colors">
                  ✕
                </button>
              ` : ''}
            </div>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed">${c.text}</p>

          ${sticker ? `
            <div class="pt-1">
              <span class="sticker-badge ${sticker.bg} border">
                <span>${sticker.emoji}</span> ${sticker.label}
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  async handlePostComment(e, isCommunity = false) {
    e.preventDefault();
    if (!EcoAuth.currentUser) {
      AppUI.showToast("Identificación Requerida", "Inicia sesión con tu cuenta escolar o Google para comentar.", "warning");
      AppUI.openModal('modal-auth');
      return;
    }

    const inputId = isCommunity ? 'community-comment-input' : 'market-comment-input';
    const input = document.getElementById(inputId);
    const text = input.value.trim();
    if (!text) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-1">⌛</span> Analizando con Eco-AI...`;

    try {
      // LLAMADA AL DETECTOR ANTI-BULLSHIT Y GROSERÍAS CON IA
      const moderation = await EcoAI.moderateComment(text, EcoAuth.currentUser.name);

      if (!moderation.approved) {
        // Bloqueo constructivo con explicación de la IA
        AppUI.showToast("🚫 Comentario Bloqueado por Eco-AI", moderation.reason, "error");
        input.classList.add('ring-2', 'ring-red-500', 'bg-red-50');
        setTimeout(() => input.classList.remove('ring-2', 'ring-red-500', 'bg-red-50'), 3000);
        return;
      }

      // Si fue aprobado por la IA, creamos el comentario
      const newComment = {
        id: `comm-${Date.now()}`,
        postId: isCommunity ? 'community_general' : this.selectedPost.id,
        authorUid: EcoAuth.currentUser.uid,
        authorName: EcoAuth.currentUser.name,
        authorAvatar: EcoAuth.currentUser.photoURL,
        text: moderation.cleanText || text,
        stickerId: this.selectedSticker,
        aiVerified: true,
        aiTag: moderation.reason || 'Aprobado',
        timestamp: 'Hace un instante'
      };

      this.comments.unshift(newComment);
      this.saveComments();

      if (isCommunity) {
        this.renderCommunityComments();
      } else {
        this.renderPostComments(this.selectedPost.id);
        this.renderMarket();
      }

      input.value = '';
      AppUI.showToast("✅ Publicado con Éxito", "Comentario verificado y publicado.", "success");
    } catch (err) {
      console.error(err);
      AppUI.showToast("Error", "Ocurrió un problema al procesar el comentario.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  },

  deleteComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!EcoAuth.currentUser || EcoAuth.currentUser.uid !== comment.authorUid) {
      AppUI.showToast("Sin Permisos", "Solo el autor puede eliminar este comentario.", "error");
      return;
    }

    this.comments = this.comments.filter(c => c.id !== commentId);
    this.saveComments();
    if (this.selectedPost) this.renderPostComments(this.selectedPost.id);
    this.renderCommunityComments();
    this.renderMarket();
    AppUI.showToast("Comentario Eliminado", "Tu comentario ha sido retirado.", "info");
  },

  renderCommunityComments() {
    const list = document.getElementById('community-comments-list');
    if (!list) return;

    const comms = this.comments.filter(c => c.postId === 'community_general' || !c.postId);

    if (comms.length === 0) {
      list.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs">
          <span>🌿</span> El tablón comunitario está listo. ¡Comparte tus ideas o preguntas sobre reciclaje escolar!
        </div>
      `;
      return;
    }

    list.innerHTML = comms.map(c => {
      const isOwner = EcoAuth.currentUser && EcoAuth.currentUser.uid === c.authorUid;
      const sticker = ECOLOGICAL_STICKERS.find(s => s.id === c.stickerId);

      return `
        <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="${c.authorAvatar}" alt="${c.authorName}" class="w-7 h-7 rounded-full bg-slate-100">
              <div>
                <span class="text-xs font-bold text-slate-900 block leading-tight">${c.authorName}</span>
                <span class="text-[10px] text-slate-400">${c.timestamp || 'Hoy'}</span>
              </div>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span class="ai-pulse-dot">🛡️</span> Eco-AI
              </span>
            </div>
            ${isOwner ? `
              <button onclick="AppState.deleteComment('${c.id}')" class="text-slate-400 hover:text-red-500 text-xs font-bold transition-colors">
                🗑️
              </button>
            ` : ''}
          </div>

          <p class="text-xs text-slate-700 leading-relaxed">${c.text}</p>

          ${sticker ? `
            <div class="pt-1">
              <span class="sticker-badge ${sticker.bg} border">
                <span>${sticker.emoji}</span> ${sticker.label} • <span class="font-normal opacity-80">${sticker.meaning}</span>
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  // ==========================================
  // SECCIÓN 4: TIPS Y DIY (UPCYCLING)
  // ==========================================
  renderDIY() {
    const grid = document.getElementById('diy-grid');
    if (!grid) return;

    let filtered = [...this.diyProjects];
    if (this.diyFilter !== 'all') {
      filtered = filtered.filter(d => d.difficulty === this.diyFilter || d.material.includes(this.diyFilter));
    }

    grid.innerHTML = filtered.map(d => {
      const isOwner = EcoAuth.isOwner(d);
      return `
        <div class="glass-card rounded-3xl overflow-hidden glass-card-hover border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img src="${d.image}" alt="${d.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'">
              <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                ⏱️ ${d.time}
              </div>
              <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                ${d.difficulty}
              </div>
              ${isOwner ? `
                <div class="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  ⭐ Tu DIY
                </div>
              ` : ''}
            </div>

            <div class="p-5 space-y-3">
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                ${d.material}
              </span>
              <h3 class="font-bold text-slate-900 text-lg leading-snug">${d.title}</h3>
              
              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-bold text-slate-700 block">Materiales necesarios:</span>
                <ul class="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  ${d.materialsNeeded.map(m => `<li>${m}</li>`).join('')}
                </ul>
              </div>

              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-bold text-slate-700 block">Paso a paso:</span>
                <ol class="text-xs text-slate-600 list-decimal list-inside space-y-1">
                  ${d.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
              </div>
            </div>
          </div>

          <div class="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <img src="${d.authorAvatar}" alt="${d.authorName}" class="w-6 h-6 rounded-full bg-slate-100">
              <span class="text-slate-600 font-medium truncate max-w-[120px]">${d.authorName}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="AppState.likeDIY('${d.id}')" class="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                <span>💚</span> <span>${d.likes || 0}</span>
              </button>
              ${isOwner ? `
                <button onclick="AppState.confirmDeleteDIY('${d.id}')" title="Solo el creador puede eliminar esta guía DIY" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg border border-red-200 transition-colors">
                  🗑️
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  likeDIY(diyId) {
    const diy = this.diyProjects.find(d => d.id === diyId);
    if (!diy) return;
    diy.likes = (diy.likes || 0) + 1;
    this.saveDIY();
    this.renderDIY();
  },

  handleCreateDIY(e) {
    e.preventDefault();
    if (!EcoAuth.currentUser) {
      AppUI.showToast("Inicia Sesión", "Debes ingresar para compartir un proyecto DIY.", "warning");
      AppUI.openModal('modal-auth');
      return;
    }

    const title = document.getElementById('diy-title').value.trim();
    const material = document.getElementById('diy-material').value.trim();
    const difficulty = document.getElementById('diy-difficulty').value;
    const time = document.getElementById('diy-time').value.trim() || '20 minutos';
    const materialsStr = document.getElementById('diy-materials-list').value.trim();
    const stepsStr = document.getElementById('diy-steps-list').value.trim();
    const imageInput = document.getElementById('diy-image').value.trim();

    const materialsNeeded = materialsStr.split('\n').filter(s => s.trim().length > 0);
    const steps = stepsStr.split('\n').filter(s => s.trim().length > 0);

    const newDIY = {
      id: `diy-${Date.now()}`,
      title,
      material,
      difficulty,
      time,
      materialsNeeded: materialsNeeded.length > 0 ? materialsNeeded : ['Materiales reciclables de casa'],
      steps: steps.length > 0 ? steps : ['Limpia los materiales y ármalos con creatividad.'],
      image: imageInput || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
      authorUid: EcoAuth.currentUser.uid,
      authorName: EcoAuth.currentUser.name,
      authorAvatar: EcoAuth.currentUser.photoURL,
      likes: 1
    };

    this.diyProjects.unshift(newDIY);
    this.saveDIY();
    this.renderDIY();
    AppUI.closeModal('modal-create-diy');
    document.getElementById('form-create-diy').reset();
    AppUI.showToast("¡Proyecto DIY Publicado!", "Tu guía ayudará a otros a reutilizar su basura.", "success");
  },

  confirmDeleteDIY(diyId) {
    const diy = this.diyProjects.find(d => d.id === diyId);
    if (!diy) return;

    if (!EcoAuth.isOwner(diy)) {
      AppUI.showToast("Sin Permisos", "Solo el autor de esta guía DIY puede eliminarla.", "error");
      return;
    }

    if (confirm(`¿Eliminar tu proyecto "${diy.title}"?`)) {
      this.diyProjects = this.diyProjects.filter(d => d.id !== diyId);
      this.saveDIY();
      this.renderDIY();
      AppUI.showToast("Guía Eliminada", "El proyecto DIY fue retirado.", "info");
    }
  },

  // ==========================================
  // SECCIÓN 5: COTIZADOR IA DE MATERIALES
  // ==========================================
  async handleCotizador(e) {
    e.preventDefault();
    const material = document.getElementById('cot-material').value.trim();
    const cantidad = document.getElementById('cot-cantidad').value;
    const medida = document.getElementById('cot-medida').value;

    const resBox = document.getElementById('cot-result-box');
    const loading = document.getElementById('cot-loading');

    loading.classList.remove('hidden');
    resBox.classList.add('hidden');

    try {
      const data = await EcoAI.getValuation(material, cantidad, medida);

      document.getElementById('cot-res-title').innerText = `${material} (${cantidad} ${medida})`;
      document.getElementById('cot-res-total').innerText = `$${Number(data.totalEstimadoMXN || 0).toFixed(2)} MXN`;
      document.getElementById('cot-res-explain').innerText = data.explicacion;
      document.getElementById('cot-res-ecotip').innerText = data.ecoTip || 'Mantén los materiales limpios y secos para obtener el mayor precio de compra.';
      
      document.getElementById('cot-res-kg').innerText = `$${Number(data.valorPorKgMXN || 0).toFixed(2)} MXN`;
      document.getElementById('cot-res-l').innerText = `$${Number(data.valorPorLMXN || 0).toFixed(2)} MXN`;
      document.getElementById('cot-res-onz').innerText = `$${Number(data.valorPorOnzMXN || 0).toFixed(2)} MXN`;

      resBox.classList.remove('hidden');
    } catch (err) {
      AppUI.showToast("Error en Cotizador", "No se pudo obtener la estimación del material.", "error");
    } finally {
      loading.classList.add('hidden');
    }
  }
};

// Controladores visuales de la interfaz (Modales, Toasts)
const AppUI = {
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.remove('hidden-modal');
    document.body.style.overflow = 'hidden';
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.add('hidden-modal');
    document.body.style.overflow = '';
  },

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: '✅',
      error: '🚫',
      warning: '⚠️',
      info: '💡'
    };

    const borderColors = {
      success: 'border-emerald-500 bg-white text-slate-800',
      error: 'border-red-500 bg-white text-slate-800',
      warning: 'border-amber-500 bg-white text-slate-800',
      info: 'border-blue-500 bg-white text-slate-800'
    };

    const toast = document.createElement('div');
    toast.className = `toast-msg max-w-sm p-4 rounded-2xl border-l-4 shadow-xl text-xs space-y-1 ${borderColors[type] || borderColors.info}`;
    toast.innerHTML = `
      <div class="flex items-center gap-2 font-bold">
        <span>${icons[type] || '🌱'}</span>
        <span>${title}</span>
      </div>
      <p class="text-slate-600 leading-relaxed">${message}</p>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
});
