/* ============================================
   PERIODIC TABLE - Grid Renderer
   ============================================ */

/**
 * Grid rendering module
 */
const PeriodicGrid = (function() {
    let gridContainer = null;
    let legendContainer = null;
    let selectedCategory = null;
    let onElementClick = null;

    /**
     * Initialize the grid
     */
    function init(container, legend, elementClickHandler) {
        gridContainer = container;
        legendContainer = legend;
        onElementClick = elementClickHandler;
    }

    /**
     * Render the periodic table grid
     */
    function render(elements) {
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        // Create element cards
        elements.forEach(element => {
            const position = ElementData.getGridPosition(element);
            const card = createElementCard(element, position);
            gridContainer.appendChild(card);
        });

        // Add lanthanide/actinide placeholders
        addPlaceholder(6, 3, '57-71');
        addPlaceholder(7, 3, '89-103');

        // Render legend
        renderLegend();
    }

    /**
     * Create an element card
     */
    function createElementCard(element, position) {
        const card = document.createElement('button');
        card.type = 'button';
        card.setAttribute('aria-label', element.name + ', element ' + element.atomicNumber);
        card.className = 'element-card';
        card.dataset.atomicNumber = element.atomicNumber;
        card.dataset.category = ElementData.getCategoryClass(element);

        // Set grid position
        card.style.gridRow = position.row;
        card.style.gridColumn = position.col;

        // Content
        card.innerHTML = `
            <span class="atomic-number">${element.atomicNumber}</span>
            <span class="symbol">${element.symbol}</span>
            <span class="name">${element.name}</span>
        `;

        // Click handler with debounce
        let lastClick = 0;
        card.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClick < 500) return; // 500ms debounce
            lastClick = now;

            e.stopPropagation();
            if (onElementClick) {
                onElementClick(element);
            }
        });

        return card;
    }

    /**
     * Add placeholder for lanthanide/actinide series
     */
    function addPlaceholder(row, col, text) {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-cell';
        placeholder.style.gridRow = row;
        placeholder.style.gridColumn = col;
        placeholder.innerHTML = `<span>${text}</span>`;
        gridContainer.appendChild(placeholder);
    }

    /**
     * Render the legend bar
     */
    function renderLegend() {
        if (!legendContainer) return;

        legendContainer.innerHTML = '';

        const categories = ElementData.getCategories();
        categories.forEach(category => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'legend-item';
            item.dataset.category = category;

            item.innerHTML = `
                <span class="legend-dot" data-category="${category}"></span>
                <span class="legend-label">${ElementData.getCategoryDisplayName(category)}</span>
            `;

            item.addEventListener('click', () => {
                toggleCategoryFilter(category);
            });

            legendContainer.appendChild(item);
        });
    }

    /**
     * Toggle category filter
     */
    function toggleCategoryFilter(category) {
        if (selectedCategory === category) {
            // Deselect
            selectedCategory = null;
            clearFilter();
        } else {
            // Select new category
            selectedCategory = category;
            applyFilter(category);
        }
    }

    /**
     * Apply category filter
     */
    function applyFilter(category) {
        // Update legend items
        const legendItems = legendContainer.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            if (item.dataset.category === category) {
                item.classList.add('selected');
                item.classList.remove('dimmed');
            } else {
                item.classList.remove('selected');
                item.classList.add('dimmed');
            }
        });

        // Update element cards
        const cards = gridContainer.querySelectorAll('.element-card');
        cards.forEach(card => {
            if (card.dataset.category === category) {
                card.classList.remove('dimmed');
            } else {
                card.classList.add('dimmed');
            }
        });

        // Update placeholders
        const placeholders = gridContainer.querySelectorAll('.placeholder-cell');
        placeholders.forEach(placeholder => {
            placeholder.classList.add('dimmed');
        });
    }

    /**
     * Clear category filter
     */
    function clearFilter() {
        selectedCategory = null;

        // Reset legend items
        const legendItems = legendContainer.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            item.classList.remove('selected', 'dimmed');
        });

        // Reset element cards
        const cards = gridContainer.querySelectorAll('.element-card');
        cards.forEach(card => {
            card.classList.remove('dimmed');
        });

        // Reset placeholders
        const placeholders = gridContainer.querySelectorAll('.placeholder-cell');
        placeholders.forEach(placeholder => {
            placeholder.classList.remove('dimmed');
        });
    }

    /**
     * Handle background click to clear filter
     */
    function setupBackgroundClick() {
        if (!gridContainer) return;

        gridContainer.addEventListener('click', (e) => {
            // Only clear if clicked on grid background (not on element card)
            if (e.target === gridContainer) {
                clearFilter();
            }
        });
    }

    /**
     * Get selected category
     */
    function getSelectedCategory() {
        return selectedCategory;
    }

    // Public API
    return {
        init,
        render,
        toggleCategoryFilter,
        clearFilter,
        setupBackgroundClick,
        getSelectedCategory
    };
})();
