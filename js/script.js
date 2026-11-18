document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    function closeMobileMenu() {
        if (!navbar || !hamburger) return;
        navbar.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (!icon) return;
            if (navbar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- Smooth Scrolling for in-page anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const headerEl = document.querySelector('.header');
            const headerHeight = headerEl ? headerEl.offsetHeight : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        });
    });

    // --- Swiper Configuration (Home Page only) ---
    if (typeof Swiper !== 'undefined') {
        if (document.querySelector('.mySwiper')) {
            new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }

        if (document.querySelector('.padariaSwiper')) {
            new Swiper('.padariaSwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: { slidesPerView: 2 }
                }
            });
        }
    }

    // --- Shared Configuration & Constants ---
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSyBOg1dpuG8Ql5LoGS0Rn6n52sfbTxfe6WVqST16rjClp52C-wqiO-jcjtW9PuQjf36bKyUSd8sBB_/pub?output=csv';
    const WHATSAPP_NUMBER = '5511988525518';
    const STORAGE_KEY = 'sacolao_shalom_cart_v1';
    const CSV_CACHE_KEY = 'sacolao_shalom_csv_cache_v1';
    const MIN_ORDER_VALUE = 60.00;
    const DELIVERY_FEE = 10.00;
    const KG_STEPS = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];

    const FALLBACK_CSV = [
        'Categoria,Produto,Preço,Unidade',
        'Padaria & Quitandas,Pão francês / Pão de sal,1.00,unidade',
        'Padaria & Quitandas,Pão carteiro,0.90,unidade',
        'Padaria & Quitandas,Pão de leite,0.90,unidade',
        'Padaria & Quitandas,Pão de milho,0.90,unidade',
        'Padaria & Quitandas,Rosquinhas / Pães doces,0.90,unidade',
        'Padaria & Quitandas,Pão de queijo,3.00,100g',
        'Padaria & Quitandas,Bolos caseiros (sabores do dia),Consultar sabor,unidade',
        'Legumes Raízes & Tubérculos,Abóbora cabotiá,6.49,kg',
        'Legumes Raízes & Tubérculos,Abobrinha italiana,6.99,kg',
        'Legumes Raízes & Tubérculos,Alho,3.39,100g',
        'Legumes Raízes & Tubérculos,Batata,7.99,kg',
        'Legumes Raízes & Tubérculos,Batata-doce,5.49,kg',
        'Legumes Raízes & Tubérculos,Cebola,12.99,kg',
        'Legumes Raízes & Tubérculos,Cebola roxa,12.99,kg',
        'Legumes Raízes & Tubérculos,Cenoura,6.99,kg',
        'Legumes Raízes & Tubérculos,Chuchu / Chuchu verde,2.99,kg',
        'Legumes Raízes & Tubérculos,Gengibre,8.99,kg',
        'Legumes Raízes & Tubérculos,Pepino japonês,7.99,kg',
        'Legumes Raízes & Tubérculos,Pimentão verde,15.99,kg',
        'Frutas,Abacate,7.90,kg',
        'Frutas,Banana nanica,10.00,dúzia',
        'Frutas,Banana prata,12.00,dúzia',
        'Frutas,Coco,7.99,kg',
        'Frutas,Kiwi,15.90,bandeja',
        'Frutas,Laranja,5.90,kg',
        'Frutas,Limão tahiti,8.99,kg',
        'Frutas,Maçã,2.00,unidade',
        'Frutas,Manga palmer,7.90,kg',
        'Frutas,Manga tommy,7.90,kg',
        'Frutas,Pera,2.20,unidade',
        'Frutas,Uva vitória (roxa sem semente),12.99,bandeja',
        'Frutas,Uva thompson (verde sem semente),12.99,bandeja',
        'Frutas,Morango,8.90,unidade',
        'Frutas,Melão,11.90,unidade',
        'Frutas,Mamão papaia,4.50,unidade',
        'Hortaliças & Verduras,Alface (crespa / comum),4.50,unidade',
        'Hortaliças & Verduras,Alface americana,4.50,unidade',
        'Hortaliças & Verduras,Coentro,5.00,maço',
        'Hortaliças & Verduras,Repolho (unidade grande),7.99,unidade',
        'Hortaliças & Verduras,Escarola,4.50,unidade',
        'Processados & Sobremesas,Legumes picados em pacotinho,7.99,pacotinho',
        'Processados & Sobremesas,Salada de frutas no potinho,7.00,pote',
        'Bebidas & Chás,Sucos naturais da casa (500 ml),8.00,garrafa',
        'Bebidas & Chás,Chás secos e ervas para infusão,3.50,pacotinho',
        'Ovos,Ovo caipira,28.90,cartela',
        'Ovos,Ovo de codorna,12.00,cartela',
        'Sais & Molhos,Sal de parrilla,8.99,unidade',
        'Sais & Molhos,Pimentas em vidro (150 ml),4.99,vidrinho',
        'Sais & Molhos,Molho de alho,4.99,unidade',
        'Temperos Secos (30g),Alho em pó,3.50,unidade',
        'Temperos Secos (30g),Alho frito,3.50,unidade',
        'Temperos Secos (30g),Ana Maria,3.50,unidade',
        'Temperos Secos (30g),Cebola e salsa,3.50,unidade',
        'Temperos Secos (30g),Cebola salsa e bacon,3.50,unidade',
        'Temperos Secos (30g),Cebola salsa e tomate,3.50,unidade',
        'Temperos Secos (30g),Colorau,3.50,unidade',
        'Temperos Secos (30g),Cominho,3.50,unidade',
        'Temperos Secos (30g),Edu Guedes,3.50,unidade',
        'Temperos Secos (30g),Páprica defumada,3.50,unidade',
        'Temperos Secos (30g),Páprica doce,3.50,unidade',
        'Temperos Secos (30g),Páprica picante,3.50,unidade',
        'Temperos Secos (30g),Pega esposo,3.50,unidade',
        'Temperos Secos (30g),Pega marido,3.50,unidade',
        'Temperos Secos (30g),Pimenta calabresa,3.50,unidade',
        'Temperos Secos (30g),Pimenta do Reino,3.50,unidade',
        'Temperos Secos (30g),Tempero baiano,3.50,unidade',
        'Temperos Secos (30g),Açafrão,3.50,unidade',
        'Temperos Secos (30g),Tempero para feijao,3.50,unidade',
        'Temperos Secos (30g),Tempero para bife,3.50,unidade',
        'Temperos Secos (30g),Tempero de frango,3.50,unidade',
        'Temperos Secos (30g),Bicarbonato,3.50,unidade',
        'Temperos Secos (30g),Vinagrete,3.50,unidade',
        'Temperos Secos (30g),Cravo da Índia,3.50,unidade',
        'Temperos Secos (30g),Tempero para churrasco,3.50,unidade',
        'Temperos Secos (30g),Canela em pó,3.50,unidade',
        'Temperos Secos (30g),Canela em pau,3.50,unidade',
        'Temperos Secos (30g),Orégano,3.50,unidade',
        'Temperos Secos (30g),Erva-doce,3.50,unidade',
        'Temperos Secos (30g),Hortelã,3.50,unidade',
        'Temperos Secos (30g),Alecrim,3.50,unidade',
        'Temperos Secos (30g),Camomila,3.50,unidade',
        'Temperos Secos (30g),Manjericão,3.50,unidade',
        'Temperos Secos (30g),Louro em folha,3.50,unidade'
    ].join('\n');

    const CATEGORY_META = [
        { match: 'padaria', icon: 'fas fa-bread-slice', thumbClass: 'thumb-padaria', fallbackEmoji: '🥖' },
        { match: 'legumes', icon: 'fas fa-carrot', thumbClass: 'thumb-legumes', fallbackEmoji: '🥕' },
        { match: 'frutas', icon: 'fas fa-apple-alt', thumbClass: 'thumb-frutas', fallbackEmoji: '🍎' },
        { match: 'hortali', icon: 'fas fa-leaf', thumbClass: 'thumb-hortalicas', fallbackEmoji: '🥬' },
        { match: 'verdura', icon: 'fas fa-leaf', thumbClass: 'thumb-hortalicas', fallbackEmoji: '🥬' },
        { match: 'processado', icon: 'fas fa-utensils', thumbClass: 'thumb-hortalicas', fallbackEmoji: '🥗' },
        { match: 'sobremesa', icon: 'fas fa-utensils', thumbClass: 'thumb-frutas', fallbackEmoji: '🍍' },
        { match: 'bebida', icon: 'fas fa-mug-hot', thumbClass: 'thumb-bebidas', fallbackEmoji: '🧃' },
        { match: 'cha', icon: 'fas fa-mug-hot', thumbClass: 'thumb-bebidas', fallbackEmoji: '🍵' },
        { match: 'ovo', icon: 'fas fa-egg', thumbClass: 'thumb-ovos', fallbackEmoji: '🥚' },
        { match: 'sal', icon: 'fas fa-pepper-hot', thumbClass: 'thumb-temperos', fallbackEmoji: '🧂' },
        { match: 'molho', icon: 'fas fa-pepper-hot', thumbClass: 'thumb-temperos', fallbackEmoji: '🌶️' },
        { match: 'tempero', icon: 'fas fa-seedling', thumbClass: 'thumb-temperos', fallbackEmoji: '🌿' }
    ];

    const PRODUCT_EMOJIS = [
        ['pao de queijo', '🧀'],
        ['rosquinha', '🍩'],
        ['bolo', '🍰'],
        ['frances', '🥖'],
        ['pao', '🍞'],
        ['abobora', '🎃'],
        ['abobrinha', '🥒'],
        ['pepino', '🥒'],
        ['alho', '🧄'],
        ['batata-doce', '🍠'],
        ['batata doce', '🍠'],
        ['batata', '🥔'],
        ['cebola', '🧅'],
        ['cenoura', '🥕'],
        ['chuchu', '🥬'],
        ['gengibre', '🌱'],
        ['pimentao', '🫑'],
        ['pimenta', '🌶️'],
        ['paprica', '🌶️'],
        ['abacate', '🥑'],
        ['banana', '🍌'],
        ['coco', '🥥'],
        ['kiwi', '🥝'],
        ['laranja', '🍊'],
        ['limao', '🍋'],
        ['maca', '🍎'],
        ['manga', '🥭'],
        ['mamao', '🥭'],
        ['pera', '🍐'],
        ['uva', '🍇'],
        ['morango', '🍓'],
        ['melao', '🍈'],
        ['salada de frutas', '🍍'],
        ['legumes picados', '🥗'],
        ['alface', '🥬'],
        ['repolho', '🥬'],
        ['escarola', '🥬'],
        ['coentro', '🌿'],
        ['oregano', '🌿'],
        ['erva-doce', '🌿'],
        ['hortela', '🌿'],
        ['alecrim', '🌿'],
        ['camomila', '🌿'],
        ['manjericao', '🌿'],
        ['louro', '🌿'],
        ['suco', '🧃'],
        ['cha', '🍵'],
        ['ovo', '🥚'],
        ['sal', '🧂'],
        ['tempero', '🧂'],
        ['acafrao', '🧂'],
        ['colorau', '🧂'],
        ['cominho', '🧂'],
        ['bicarbonato', '🧂'],
        ['vinagrete', '🧂'],
        ['cravo', '🧂'],
        ['canela', '🧂'],
        ['ana maria', '🧂'],
        ['edu guedes', '🧂'],
        ['pega ', '🧂']
    ];

    // DOM Elements (may be null depending on active HTML page)
    const navCartBadge = document.getElementById('navCartBadge');
    const cartBar = document.getElementById('cartBar');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartConsultNoteEl = document.getElementById('cartConsultNote');
    const cartMinOrderNoteEl = document.getElementById('cartMinOrderNote');

    const catalogContainer = document.getElementById('catalogContainer');
    const catalogStatus = document.getElementById('catalogStatus');
    const categoryTabsEl = document.getElementById('categoryTabs');
    const searchInput = document.getElementById('productSearch');
    const clearSearchBtn = document.getElementById('clearSearch');

    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartEmptyState = document.getElementById('cartEmptyState');
    const cartFilledContent = document.getElementById('cartFilledContent');
    const minOrderBox = document.getElementById('minOrderBox');
    const minOrderIcon = document.getElementById('minOrderIcon');
    const minOrderText = document.getElementById('minOrderText');
    const minOrderProgressTrack = document.getElementById('minOrderProgressTrack');
    const minOrderProgressBar = document.getElementById('minOrderProgressBar');
    const cartPageCountLabel = document.getElementById('cartPageCountLabel');
    const cartPageItemsEl = document.getElementById('cartPageItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDeliveryFeeEl = document.getElementById('cartDeliveryFee');
    const cartPageTotalEl = document.getElementById('cartPageTotal');
    const cartPageConsultNoteEl = document.getElementById('cartPageConsultNote');
    const checkoutMinWarning = document.getElementById('checkoutMinWarning');
    const checkoutMinWarningText = document.getElementById('checkoutMinWarningText');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const checkoutForm = document.getElementById('checkoutForm');

    let allProducts = [];
    const productsById = new Map();
    const cart = new Map();
    let activeCategory = 'Todos';
    let searchQuery = '';
    let searchTimer = null;

    function normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatCurrency(value) {
        return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
    }

    function roundMoney(value) {
        return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
    }

    function formatKgLabel(qty, zeroLabel = '0 kg (Peso)') {
        if (!qty || qty <= 0) return zeroLabel;
        if (qty === 0.5) return '0,5 kg (Meio quilo)';
        return `${Number(qty).toFixed(1).replace('.', ',')} kg`;
    }

    function getCategoryMeta(categoryName) {
        const normalized = normalizeText(categoryName);
        return CATEGORY_META.find(entry => normalized.includes(entry.match)) || {
            icon: 'fas fa-shopping-basket',
            thumbClass: '',
            fallbackEmoji: '🧺'
        };
    }

    function getProductEmoji(productName, categoryName) {
        const normName = normalizeText(productName);
        const matched = PRODUCT_EMOJIS.find(([keyword]) => normName.includes(keyword));
        if (matched) return matched[1];
        return getCategoryMeta(categoryName).fallbackEmoji;
    }

    function buildProductThumbHtml(product, extraClass = '') {
        const meta = getCategoryMeta(product.category);
        const emoji = escapeHtml(product.emoji || getProductEmoji(product.name, product.category));
        const thumbClasses = `product-thumb ${meta.thumbClass} ${extraClass}`.trim();

        if (product.imageUrl) {
            return `
                <div class="${thumbClasses}">
                    <img
                        src="${escapeHtml(product.imageUrl)}"
                        alt="${escapeHtml(product.name)}"
                        class="product-img"
                        loading="lazy"
                        decoding="async"
                        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                    >
                    <span class="product-emoji" style="display:none;" aria-hidden="true">${emoji}</span>
                </div>
            `;
        }

        return `
            <div class="${thumbClasses}" aria-hidden="true">
                <span class="product-emoji">${emoji}</span>
            </div>
        `;
    }

    function saveCartToStorage() {
        try {
            const serialized = Array.from(cart.entries());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
        } catch (err) {
            console.warn('Não foi possível salvar o carrinho no localStorage:', err);
        }
    }

    function loadCartFromStorage() {
        cart.clear();
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const entries = JSON.parse(raw);
            if (!Array.isArray(entries)) return;

            entries.forEach(entry => {
                if (!Array.isArray(entry) || entry.length < 2) return;
                const [id, item] = entry;
                if (!id || !item || !item.product || typeof item.qty !== 'number' || item.qty <= 0) return;
                cart.set(id, { product: item.product, qty: item.qty });
            });
        } catch (err) {
            console.warn('Não foi possível ler o carrinho do localStorage:', err);
        }
    }

    /** Parse a single RFC-4180 CSV line supporting quoted commas and escaped quotes. */
    function parseCSVLine(line) {
        const cells = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                cells.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        cells.push(current.trim());
        return cells;
    }

    /** Parse raw price strings (e.g. "0.90", "R$ 7,99", "Consultar sabor"). */
    function parsePrice(rawPrice) {
        const cleaned = String(rawPrice || '').trim();
        const candidate = cleaned.replace(/^R\$\s*/i, '').trim();

        if (/^\d+(?:[.,]\d{1,2})?$/.test(candidate)) {
            return {
                price: parseFloat(candidate.replace(',', '.')),
                isConsult: false,
                consultText: ''
            };
        }

        if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(candidate)) {
            return {
                price: parseFloat(candidate.replace(/\./g, '').replace(',', '.')),
                isConsult: false,
                consultText: ''
            };
        }

        return {
            price: 0,
            isConsult: true,
            consultText: cleaned || 'Consultar sabor'
        };
    }

    /** Convert Google Sheets CSV string into structured product objects. */
    function parseCatalogCSV(csvText) {
        const cleanText = String(csvText || '').replace(/^\uFEFF/, '');
        const lines = cleanText.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = parseCSVLine(lines[0]).map(h => normalizeText(h));
        const colIdx = {
            category: headers.findIndex(h => h.includes('categoria')),
            product: headers.findIndex(h => h.includes('produto') || h.includes('item') || h.includes('nome')),
            price: headers.findIndex(h => h.includes('preco') || h.includes('valor')),
            unit: headers.findIndex(h => h.includes('unidade') || h.includes('medida')),
            image: headers.findIndex(h => h.includes('imagem') || h.includes('foto') || h.includes('img') || h.includes('url'))
        };

        const idxCat = colIdx.category >= 0 ? colIdx.category : 0;
        const idxProd = colIdx.product >= 0 ? colIdx.product : 1;
        const idxPrice = colIdx.price >= 0 ? colIdx.price : 2;
        const idxUnit = colIdx.unit >= 0 ? colIdx.unit : 3;
        const idxImg = colIdx.image;

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);
            const category = cols[idxCat] || 'Outros';
            const name = cols[idxProd] || '';
            const rawPrice = cols[idxPrice] || '';
            const unit = cols[idxUnit] || 'unidade';
            const rawImage = idxImg >= 0 ? (cols[idxImg] || '').trim() : '';

            if (!name) continue;

            const priceInfo = parsePrice(rawPrice);
            const id = `prod-${i}-${normalizeText(name).replace(/[^a-z0-9]+/g, '-')}`;
            const isValidImageUrl = /^(https?:\/\/|assets\/)/i.test(rawImage);

            parsed.push({
                id,
                category,
                name,
                unit,
                isKg: normalizeText(unit) === 'kg',
                price: priceInfo.price,
                isConsult: priceInfo.isConsult,
                consultText: priceInfo.consultText,
                imageUrl: isValidImageUrl ? rawImage : '',
                emoji: getProductEmoji(name, category),
                searchText: normalizeText(`${name} ${category} ${unit}`)
            });
        }

        return parsed;
    }

    function buildProductControlsHtml(product, qty, isCartView = false) {
        const safeId = escapeHtml(product.id);
        const extraClass = isCartView ? 'cart-item-controls' : '';

        if (product.isKg) {
            const zeroLabel = isCartView ? 'Remover (0 kg)' : '0 kg (Peso)';
            const maxKg = KG_STEPS[KG_STEPS.length - 1];
            const optionsHtml = KG_STEPS.map(step => {
                const selected = Number(qty) === step ? 'selected' : '';
                return `<option value="${step}" ${selected}>${escapeHtml(formatKgLabel(step, zeroLabel))}</option>`;
            }).join('');

            return `
                <div class="kg-controls ${extraClass}">
                    <button type="button" class="qty-btn qty-btn-minus" data-action="decrease" data-id="${safeId}" aria-label="Diminuir 0,5 kg" ${qty <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <select class="kg-select" data-id="${safeId}" aria-label="Selecionar peso em kg de ${escapeHtml(product.name)}">
                        ${optionsHtml}
                    </select>
                    <button type="button" class="qty-btn qty-btn-plus" data-action="increase" data-id="${safeId}" aria-label="Aumentar 0,5 kg" ${qty >= maxKg ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
        }

        return `
            <div class="qty-controls ${extraClass}">
                <button type="button" class="qty-btn qty-btn-minus" data-action="decrease" data-id="${safeId}" aria-label="Remover uma unidade" ${qty <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty-value" aria-label="Quantidade">${qty}</span>
                <button type="button" class="qty-btn qty-btn-plus" data-action="increase" data-id="${safeId}" aria-label="Adicionar uma unidade">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }

    function renderCategoryTabs() {
        if (!categoryTabsEl) return;
        const uniqueCategories = ['Todos', ...new Set(allProducts.map(p => p.category))];

        categoryTabsEl.innerHTML = uniqueCategories.map(cat => {
            const isActive = cat === activeCategory;
            const iconClass = cat === 'Todos' ? 'fas fa-th-large' : getCategoryMeta(cat).icon;
            return `
                <button
                    type="button"
                    class="category-tab ${isActive ? 'active' : ''}"
                    data-category="${escapeHtml(cat)}"
                    role="tab"
                    aria-selected="${isActive ? 'true' : 'false'}"
                >
                    <i class="${iconClass}"></i>
                    <span>${escapeHtml(cat)}</span>
                </button>
            `;
        }).join('');
    }

    function renderCatalog() {
        if (!catalogContainer) return;

        const normalizedQuery = normalizeText(searchQuery);
        const filtered = allProducts.filter(product => {
            const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
            const matchesSearch = !normalizedQuery || product.searchText.includes(normalizedQuery);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            catalogContainer.innerHTML = `
                <div class="catalog-empty">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Não encontramos itens para a busca atual. Que tal limpar os filtros?</p>
                    <button type="button" class="btn btn-primary mt-2" id="resetFiltersBtn">
                        Ver Todos os Produtos
                    </button>
                </div>
            `;
            const resetBtn = document.getElementById('resetFiltersBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    activeCategory = 'Todos';
                    searchQuery = '';
                    if (searchInput) searchInput.value = '';
                    if (clearSearchBtn) clearSearchBtn.hidden = true;
                    renderCategoryTabs();
                    renderCatalog();
                });
            }
            return;
        }

        const grouped = new Map();
        filtered.forEach(product => {
            if (!grouped.has(product.category)) {
                grouped.set(product.category, []);
            }
            grouped.get(product.category).push(product);
        });

        let html = '';
        grouped.forEach((items, categoryName) => {
            const countLabel = items.length === 1 ? '1 item' : `${items.length} itens`;
            const meta = getCategoryMeta(categoryName);

            const cardsHtml = items.map(product => {
                const qty = cart.has(product.id) ? cart.get(product.id).qty : 0;
                const priceMarkup = product.isConsult
                    ? `<span class="product-price-consult">${escapeHtml(product.consultText)}</span> <span class="product-unit">/ ${escapeHtml(product.unit)}</span>`
                    : `<span class="product-price">${formatCurrency(product.price)}</span> <span class="product-unit">/ ${escapeHtml(product.unit)}</span>`;

                return `
                    <article class="product-card ${qty > 0 ? 'in-cart' : ''}" data-product-id="${escapeHtml(product.id)}">
                        <div class="product-card-main">
                            ${buildProductThumbHtml(product)}
                            <div class="product-info">
                                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                                <div class="product-meta">
                                    ${priceMarkup}
                                </div>
                            </div>
                        </div>
                        <div class="product-actions">
                            ${buildProductControlsHtml(product, qty, false)}
                        </div>
                    </article>
                `;
            }).join('');

            html += `
                <div class="category-group">
                    <div class="category-group-header">
                        <h2 class="category-group-title">
                            <i class="${meta.icon}"></i>
                            <span>${escapeHtml(categoryName)}</span>
                        </h2>
                        <span class="category-count">${countLabel}</span>
                    </div>
                    <div class="products-grid">
                        ${cardsHtml}
                    </div>
                </div>
            `;
        });

        catalogContainer.innerHTML = html;
    }

    function getCartSummary() {
        let totalItems = 0;
        let subtotalPrice = 0;
        let hasConsultItems = false;

        cart.forEach(({ product, qty }) => {
            totalItems += product.isKg ? 1 : qty;
            if (product.isConsult) {
                hasConsultItems = true;
            } else {
                subtotalPrice = roundMoney(subtotalPrice + roundMoney(product.price * qty));
            }
        });

        const deliveryFee = totalItems > 0 ? DELIVERY_FEE : 0;
        const totalWithDelivery = totalItems > 0 ? roundMoney(subtotalPrice + deliveryFee) : 0;
        const remainingForMin = Math.max(0, roundMoney(MIN_ORDER_VALUE - subtotalPrice));
        const meetsMinOrder = subtotalPrice >= MIN_ORDER_VALUE;
        const minOrderPercent = Math.min(100, Math.round((subtotalPrice / MIN_ORDER_VALUE) * 100));

        return {
            totalItems,
            subtotalPrice,
            deliveryFee,
            totalWithDelivery,
            remainingForMin,
            meetsMinOrder,
            minOrderPercent,
            hasConsultItems
        };
    }

    function syncProductCardDOM(productId, qty) {
        if (!catalogContainer) return;
        const maxKg = KG_STEPS[KG_STEPS.length - 1];
        const cards = catalogContainer.querySelectorAll('.product-card');

        cards.forEach(card => {
            if (card.dataset.productId !== productId) return;
            card.classList.toggle('in-cart', qty > 0);

            const minusBtn = card.querySelector('.qty-btn-minus');
            const plusBtn = card.querySelector('.qty-btn-plus');
            const kgSelect = card.querySelector('.kg-select');
            const qtyEl = card.querySelector('.qty-value');

            if (minusBtn) minusBtn.disabled = qty <= 0;
            if (kgSelect) {
                kgSelect.value = String(qty);
                if (plusBtn) plusBtn.disabled = qty >= maxKg;
            } else if (qtyEl) {
                qtyEl.textContent = String(qty);
            }
        });
    }

    function renderCartPage() {
        const hasItems = cart.size > 0;
        if (cartEmptyState) cartEmptyState.hidden = hasItems;
        if (cartFilledContent) cartFilledContent.hidden = !hasItems;
        if (clearCartBtn) clearCartBtn.hidden = !hasItems;

        if (!hasItems || !cartPageItemsEl) return;

        const rows = [];
        cart.forEach(({ product, qty }) => {
            let priceText = '';
            if (product.isConsult) {
                priceText = `${escapeHtml(product.consultText)} (${escapeHtml(product.unit)})`;
            } else if (product.isKg) {
                const sub = roundMoney(product.price * qty);
                priceText = `${formatCurrency(sub)} (${escapeHtml(formatKgLabel(qty))} × ${formatCurrency(product.price)}/kg)`;
            } else {
                const sub = roundMoney(product.price * qty);
                priceText = `${formatCurrency(sub)} (${qty}x ${formatCurrency(product.price)} / ${escapeHtml(product.unit)})`;
            }

            rows.push(`
                <div class="cart-page-item" data-product-id="${escapeHtml(product.id)}">
                    <div class="cart-item-left">
                        ${buildProductThumbHtml(product, 'cart-item-thumb')}
                        <div class="cart-item-info">
                            <span class="cart-item-name">${escapeHtml(product.name)}</span>
                            <span class="cart-item-price">${priceText}</span>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        ${buildProductControlsHtml(product, qty, true)}
                        <button type="button" class="btn-remove-item" data-action="remove" data-id="${escapeHtml(product.id)}" aria-label="Remover ${escapeHtml(product.name)} do carrinho">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `);
        });

        cartPageItemsEl.innerHTML = rows.join('');
    }

    function updateCartUI() {
        const {
            totalItems,
            subtotalPrice,
            deliveryFee,
            totalWithDelivery,
            remainingForMin,
            meetsMinOrder,
            minOrderPercent,
            hasConsultItems
        } = getCartSummary();

        const formattedSubtotal = formatCurrency(subtotalPrice);
        const formattedDelivery = formatCurrency(deliveryFee);
        const formattedTotalWithDelivery = formatCurrency(totalWithDelivery);
        const formattedRemaining = formatCurrency(remainingForMin);
        const hasItems = totalItems > 0;

        if (navCartBadge) {
            navCartBadge.textContent = String(totalItems);
            navCartBadge.hidden = !hasItems;
        }

        if (cartCountEl) cartCountEl.textContent = String(totalItems);
        if (cartTotalEl) cartTotalEl.textContent = formattedSubtotal;
        if (cartConsultNoteEl) cartConsultNoteEl.hidden = !hasConsultItems;
        if (cartMinOrderNoteEl) {
            cartMinOrderNoteEl.classList.toggle('reached', meetsMinOrder);
            cartMinOrderNoteEl.textContent = meetsMinOrder
                ? `Pedido mín. atingido! (+ ${formatCurrency(DELIVERY_FEE)} entrega)`
                : `Faltam ${formattedRemaining} p/ pedido mín. de ${formatCurrency(MIN_ORDER_VALUE)}`;
        }

        if (cartBar) {
            cartBar.hidden = !hasItems;
            document.body.classList.toggle('has-cart', hasItems);
        } else {
            document.body.classList.remove('has-cart');
        }

        if (cartPageCountLabel) {
            cartPageCountLabel.textContent = totalItems === 1 ? '1 item' : `${totalItems} itens`;
        }
        if (cartSubtotalEl) cartSubtotalEl.textContent = formattedSubtotal;
        if (cartDeliveryFeeEl) cartDeliveryFeeEl.textContent = formattedDelivery;
        if (cartPageTotalEl) cartPageTotalEl.textContent = formattedTotalWithDelivery;
        if (cartPageConsultNoteEl) cartPageConsultNoteEl.hidden = !hasConsultItems;

        if (minOrderBox) {
            minOrderBox.classList.toggle('reached', meetsMinOrder);
            if (minOrderIcon) {
                minOrderIcon.className = meetsMinOrder ? 'fas fa-check-circle' : 'fas fa-info-circle';
            }
            if (minOrderText) {
                minOrderText.textContent = meetsMinOrder
                    ? `Pedido mínimo de ${formatCurrency(MIN_ORDER_VALUE)} atingido! Taxa fixa de entrega: ${formatCurrency(DELIVERY_FEE)}.`
                    : `Faltam ${formattedRemaining} para o pedido mínimo de ${formatCurrency(MIN_ORDER_VALUE)} (em produtos, antes da entrega).`;
            }
            if (minOrderProgressBar) {
                minOrderProgressBar.style.width = `${minOrderPercent}%`;
            }
            if (minOrderProgressTrack) {
                minOrderProgressTrack.setAttribute('aria-valuenow', String(minOrderPercent));
            }
        }

        if (checkoutMinWarning) {
            checkoutMinWarning.hidden = !hasItems || meetsMinOrder;
            if (checkoutMinWarningText && !meetsMinOrder) {
                checkoutMinWarningText.textContent = `Adicione mais ${formattedRemaining} em produtos para liberar o envio do pedido (mínimo ${formatCurrency(MIN_ORDER_VALUE)}).`;
            }
        }

        if (submitOrderBtn) {
            submitOrderBtn.disabled = !hasItems || !meetsMinOrder;
        }

        if (cartPageItemsEl) {
            renderCartPage();
        }
    }

    function getProductRecord(productId) {
        if (productsById.has(productId)) return productsById.get(productId);
        if (cart.has(productId)) return cart.get(productId).product;
        return null;
    }

    function setProductQty(productId, newQty) {
        const product = getProductRecord(productId);
        if (!product) return;

        let sanitizedQty = Number(newQty) || 0;
        if (product.isKg) {
            sanitizedQty = Math.max(0, Math.min(KG_STEPS[KG_STEPS.length - 1], Math.round(sanitizedQty * 2) / 2));
        } else {
            sanitizedQty = Math.max(0, Math.round(sanitizedQty));
        }

        if (sanitizedQty <= 0) {
            cart.delete(productId);
        } else {
            cart.set(productId, { product, qty: sanitizedQty });
        }

        saveCartToStorage();
        syncProductCardDOM(productId, sanitizedQty);
        updateCartUI();
    }

    function stepProductQty(productId, deltaDirection) {
        const product = getProductRecord(productId);
        if (!product) return;

        const currentQty = cart.has(productId) ? cart.get(productId).qty : 0;

        if (product.isKg) {
            const currentIndex = KG_STEPS.indexOf(currentQty);
            const safeIndex = currentIndex >= 0 ? currentIndex : 0;
            const nextIndex = Math.max(0, Math.min(KG_STEPS.length - 1, safeIndex + deltaDirection));
            setProductQty(productId, KG_STEPS[nextIndex]);
            return;
        }

        setProductQty(productId, currentQty + deltaDirection);
    }

    function handleControlClick(event) {
        const btn = event.target.closest('[data-action]');
        if (!btn || btn.disabled) return;

        const productId = btn.dataset.id;
        const action = btn.dataset.action;

        if (action === 'increase') {
            stepProductQty(productId, 1);
        } else if (action === 'decrease') {
            stepProductQty(productId, -1);
        } else if (action === 'remove') {
            setProductQty(productId, 0);
        }
    }

    function handleKgSelectChange(event) {
        const select = event.target.closest('.kg-select');
        if (!select) return;
        const productId = select.dataset.id;
        const selectedKg = parseFloat(select.value);
        setProductQty(productId, Number.isNaN(selectedKg) ? 0 : selectedKg);
    }

    function formatWhatsAppOrderMessage(clientName, clientAddress, clientPayment, clientNotes) {
        const { subtotalPrice, deliveryFee, totalWithDelivery, hasConsultItems } = getCartSummary();
        const itemLines = [];

        cart.forEach(({ product, qty }) => {
            const lineSubtotal = roundMoney(product.price * qty);
            const lineValue = product.isConsult ? product.consultText : formatCurrency(lineSubtotal);

            if (product.isKg) {
                itemLines.push(`• ${formatKgLabel(qty)} de ${product.name} (${formatCurrency(product.price)}/kg) - ${lineValue}`);
            } else {
                itemLines.push(`• ${qty}x ${product.name} (${product.unit}) - ${lineValue}`);
            }
        });

        const totalSuffix = hasConsultItems ? ' (+ itens a consultar)' : '';
        const lines = [
            '*🛒 NOVO PEDIDO - SACOLÃO SHALOM*',
            '',
            '*Itens do Pedido:*',
            ...itemLines,
            '',
            `*Subtotal dos itens:* ${formatCurrency(subtotalPrice)}`,
            `*Taxa de entrega:* ${formatCurrency(deliveryFee)}`,
            `*💰 Total com entrega: ${formatCurrency(totalWithDelivery)}${totalSuffix}*`,
            '',
            '*📋 Dados para Entrega:*',
            `• *Nome:* ${clientName}`,
            `• *Endereço:* ${clientAddress}`,
            `• *Pagamento:* ${clientPayment}`
        ];

        if (clientNotes) {
            lines.push(`• *Observações:* ${clientNotes}`);
        }

        return lines.join('\n');
    }

    async function fetchWithTimeout(url, timeoutMs = 6000) {
        if (typeof AbortController === 'undefined') {
            return fetch(url);
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            return await fetch(url, { signal: controller.signal });
        } finally {
            clearTimeout(timer);
        }
    }

    function tryParseLiveCSV(rawText) {
        const text = String(rawText || '').trim();
        if (!text || text.startsWith('<')) return [];
        return parseCatalogCSV(text);
    }

    async function tryFetchAndParseCSV(url, timeoutMs) {
        const response = await fetchWithTimeout(url, timeoutMs);
        if (!response.ok) return null;
        const csvData = await response.text();
        const parsed = tryParseLiveCSV(csvData);
        if (parsed.length === 0) return null;
        try { localStorage.setItem(CSV_CACHE_KEY, csvData); } catch (_) {}
        return parsed;
    }

    async function fetchLiveCSV() {
        const separator = CSV_URL.includes('?') ? '&' : '?';
        const directUrl = `${CSV_URL}${separator}t=${Date.now()}`;

        // 1. Direct fetch (works natively on GitHub Pages HTTPS and local HTTP servers)
        try {
            const parsed = await tryFetchAndParseCSV(directUrl, 6000);
            if (parsed) {
                return { products: parsed, usedFallback: false };
            }
        } catch (err) {
            console.warn('Falha ao buscar CSV direto do Google Sheets:', err);
        }

        // 2. CORS relay fallback only when opened directly via file:// (Origin: null)
        if (window.location.protocol === 'file:') {
            const relayUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
            try {
                const parsed = await tryFetchAndParseCSV(relayUrl, 3500);
                if (parsed) {
                    return { products: parsed, usedFallback: false };
                }
            } catch (err) {
                console.warn('Falha ao buscar CSV via rota auxiliar local:', err);
            }
        }

        // 3. Offline fallback (last cached live CSV or built-in reference list)
        try {
            const cachedCsv = localStorage.getItem(CSV_CACHE_KEY);
            const cachedParsed = tryParseLiveCSV(cachedCsv);
            if (cachedParsed.length > 0) {
                return { products: cachedParsed, usedFallback: true };
            }
        } catch (_) {}

        return { products: parseCatalogCSV(FALLBACK_CSV), usedFallback: true };
    }

    async function loadCatalog() {
        if (!catalogContainer) return;

        catalogContainer.innerHTML = `
            <div class="catalog-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando produtos fresquinhos...</p>
            </div>
        `;
        if (catalogStatus) catalogStatus.hidden = true;

        const { products: parsedProducts, usedFallback } = await fetchLiveCSV();

        allProducts = parsedProducts;
        productsById.clear();
        allProducts.forEach(p => productsById.set(p.id, p));

        // Refresh stored cart items with latest prices/metadata when catalog reloads
        let refreshedCart = false;
        cart.forEach((entry, id) => {
            if (productsById.has(id)) {
                cart.set(id, { product: productsById.get(id), qty: entry.qty });
                refreshedCart = true;
            }
        });
        if (refreshedCart) saveCartToStorage();

        if (catalogStatus) {
            if (usedFallback) {
                catalogStatus.hidden = false;
                catalogStatus.className = 'catalog-status';
                catalogStatus.innerHTML = `
                    <span><i class="fas fa-exclamation-triangle"></i> Exibindo lista offline de referência. Verifique a conexão para preços atualizados.</span>
                    <button type="button" class="btn btn-secondary" id="retryCatalogBtn" style="padding: 6px 14px; font-size: 0.85rem;">Atualizar agora</button>
                `;
                const retryBtn = document.getElementById('retryCatalogBtn');
                if (retryBtn) retryBtn.addEventListener('click', loadCatalog);
            } else {
                catalogStatus.hidden = true;
                catalogStatus.innerHTML = '';
            }
        }

        renderCategoryTabs();
        renderCatalog();
        updateCartUI();
    }

    // --- Event Listeners ---
    if (categoryTabsEl) {
        categoryTabsEl.addEventListener('click', event => {
            const tab = event.target.closest('.category-tab');
            if (!tab) return;
            activeCategory = tab.dataset.category || 'Todos';
            renderCategoryTabs();
            renderCatalog();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', event => {
            searchQuery = event.target.value;
            if (clearSearchBtn) {
                clearSearchBtn.hidden = searchQuery.trim() === '';
            }
            clearTimeout(searchTimer);
            searchTimer = setTimeout(renderCatalog, 60);
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            clearTimeout(searchTimer);
            searchQuery = '';
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            clearSearchBtn.hidden = true;
            renderCatalog();
        });
    }

    if (catalogContainer) {
        catalogContainer.addEventListener('click', handleControlClick);
        catalogContainer.addEventListener('change', handleKgSelectChange);
    }

    if (cartPageItemsEl) {
        cartPageItemsEl.addEventListener('click', handleControlClick);
        cartPageItemsEl.addEventListener('change', handleKgSelectChange);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart.clear();
            saveCartToStorage();
            renderCatalog();
            updateCartUI();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', event => {
            event.preventDefault();
            if (cart.size === 0) return;

            const { meetsMinOrder, remainingForMin } = getCartSummary();
            if (!meetsMinOrder) {
                if (minOrderBox) {
                    minOrderBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (checkoutMinWarningText) {
                    checkoutMinWarningText.textContent = `Pedido mínimo de ${formatCurrency(MIN_ORDER_VALUE)} não atingido. Faltam ${formatCurrency(remainingForMin)} em produtos.`;
                }
                return;
            }

            const clientName = document.getElementById('clientName').value.trim();
            const clientAddress = document.getElementById('clientAddress').value.trim();
            const clientPayment = document.getElementById('clientPayment').value.trim();
            const clientNotes = document.getElementById('clientNotes').value.trim();

            if (!clientName || !clientAddress || !clientPayment) {
                return;
            }

            const message = formatWhatsAppOrderMessage(clientName, clientAddress, clientPayment, clientNotes);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

            const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (!win) {
                window.location.href = whatsappUrl;
            }
        });
    }

    // Re-sync cart when navigating back via browser history (bfcache) or across tabs
    function syncFromStorage() {
        loadCartFromStorage();
        if (catalogContainer && allProducts.length > 0) {
            renderCatalog();
        }
        updateCartUI();
    }

    window.addEventListener('pageshow', syncFromStorage);
    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY) {
            syncFromStorage();
        }
    });

    // Initial boot
    loadCartFromStorage();
    updateCartUI();
    if (catalogContainer) {
        loadCatalog();
    }
});
