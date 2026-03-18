// Search Component
// Handles search functionality and filtering

class SearchComponent {
    constructor(searchInput, categoryFilter, searchBtn) {
        this.searchInput = searchInput;
        this.categoryFilter = categoryFilter;
        this.searchBtn = searchBtn;
        this.speciesCard = null;
        this.debounceTimer = null;
    }

    // Initialize search component
    init(speciesCard) {
        this.speciesCard = speciesCard;
        this.attachEventListeners();
    }

    // Attach event listeners
    attachEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        // Enter key in search input
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Category filter change
        this.categoryFilter.addEventListener('change', () => {
            this.performSearch();
        });

        // Debounced search as user types
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performSearch();
            }, 300);
        });

        // Clear search on escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    // Perform search
    performSearch() {
        const searchTerm = this.searchInput.value.trim();
        const category = this.categoryFilter.value;

        const criteria = {
            search: searchTerm || null,
            category: category || null
        };

        const results = this.speciesCard.filterSpecies(criteria);
        this.updateSearchStats(results.length);
        this.highlightSearchTerm(searchTerm);
    }

    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.categoryFilter.value = '';
        this.speciesCard.filterSpecies({});
        this.updateSearchStats(0);
        this.clearHighlights();
    }

    // Update search statistics
    updateSearchStats(resultCount) {
        // Remove existing stats if any
        const existingStats = document.querySelector('.search-stats');
        if (existingStats) {
            existingStats.remove();
        }

        // Add new stats if search is active
        if (this.searchInput.value.trim() || this.categoryFilter.value) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'search-stats text-gray-600 mb-4 text-center';
            statsDiv.innerHTML = `
                Found <span class="font-semibold text-green-600">${resultCount}</span> 
                ${resultCount === 1 ? 'species' : 'species'} 
                ${this.searchInput.value.trim() ? `matching "${this.searchInput.value}"` : ''}
                ${this.categoryFilter.value ? `in ${this.getCategoryName(this.categoryFilter.value)}` : ''}
            `;

            const speciesSection = document.getElementById('species');
            speciesSection.insertBefore(statsDiv, speciesSection.querySelector('#speciesGrid'));
        }
    }

    // Get category display name
    getCategoryName(categoryId) {
        const category = wildlifeData.categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    }

    // Highlight search term in results
    highlightSearchTerm(searchTerm) {
        if (!searchTerm) return;

        const cards = document.querySelectorAll('.species-card');
        cards.forEach(card => {
            const nameElement = card.querySelector('h3');
            const descriptionElement = card.querySelector('.line-clamp-2');
            
            this.highlightText(nameElement, searchTerm);
            this.highlightText(descriptionElement, searchTerm);
        });
    }

    // Highlight text in element
    highlightText(element, searchTerm) {
        if (!element || !searchTerm) return;

        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
        
        if (text !== highlightedText) {
            element.innerHTML = highlightedText;
        }
    }

    // Clear highlights
    clearHighlights() {
        const cards = document.querySelectorAll('.species-card');
        cards.forEach(card => {
            const nameElement = card.querySelector('h3');
            const descriptionElement = card.querySelector('.line-clamp-2');
            
            if (nameElement) {
                nameElement.innerHTML = nameElement.textContent;
            }
            if (descriptionElement) {
                descriptionElement.innerHTML = descriptionElement.textContent;
            }
        });
    }

    // Add search suggestions
    addSearchSuggestions() {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-lg z-10 hidden';
        suggestionsContainer.id = 'searchSuggestions';

        this.searchInput.parentElement.style.position = 'relative';
        this.searchInput.parentElement.appendChild(suggestionsContainer);

        // Show/hide suggestions on focus
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.showSuggestions();
            }
        });

        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsContainer.classList.add('hidden');
            }, 200);
        });

        // Update suggestions on input
        this.searchInput.addEventListener('input', () => {
            if (this.searchInput.value.trim()) {
                this.showSuggestions();
            } else {
                suggestionsContainer.classList.add('hidden');
            }
        });
    }

    // Show search suggestions
    showSuggestions() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        const suggestions = this.getSuggestions(searchTerm);
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions
                .map(suggestion => `
                    <div class="suggestion-item px-4 py-2 hover:bg-gray-100 cursor-pointer" data-value="${suggestion}">
                        ${suggestion}
                    </div>
                `).join('');

            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.searchInput.value = item.dataset.value;
                    this.performSearch();
                    suggestionsContainer.classList.add('hidden');
                });
            });

            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    }

    // Get search suggestions
    getSuggestions(searchTerm) {
        const allSpecies = DataUtils.getAllSpecies();
        const suggestions = new Set();

        allSpecies.forEach(species => {
            // Add species names that match
            if (species.name.toLowerCase().includes(searchTerm)) {
                suggestions.add(species.name);
            }

            // Add scientific names that match
            if (species.scientificName.toLowerCase().includes(searchTerm)) {
                suggestions.add(species.scientificName);
            }

            // Add habitat terms that match
            if (species.habitat.toLowerCase().includes(searchTerm)) {
                species.habitat.split(',').forEach(habitat => {
                    if (habitat.toLowerCase().trim().includes(searchTerm)) {
                        suggestions.add(habitat.trim());
                    }
                });
            }

            // Add location terms that match
            if (species.location.toLowerCase().includes(searchTerm)) {
                suggestions.add(species.location);
            }
        });

        return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
    }

    // Add advanced search filters
    addAdvancedFilters() {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'advanced-filters bg-white p-4 rounded-lg shadow-md mb-6 hidden';
        filtersContainer.id = 'advancedFilters';

        filtersContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Conservation Status</label>
                    <select id="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">All Statuses</option>
                        <option value="critically-endangered">Critically Endangered</option>
                        <option value="endangered">Endangered</option>
                        <option value="vulnerable">Vulnerable</option>
                        <option value="near-threatened">Near Threatened</option>
                        <option value="least-concern">Least Concern</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Habitat Type</label>
                    <select id="habitatFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">All Habitats</option>
                        ${wildlifeData.habitats.map(habitat => 
                            `<option value="${habitat.id}">${habitat.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                    <select id="dietFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">All Diets</option>
                        <option value="herbivore">Herbivore</option>
                        <option value="carnivore">Carnivore</option>
                        <option value="omnivore">Omnivore</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="clearAdvancedFilters" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Clear Filters
                </button>
                <button id="applyAdvancedFilters" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Apply Filters
                </button>
            </div>
        `;

        // Insert after basic search
        const searchSection = document.querySelector('.mb-12');
        searchSection.insertBefore(filtersContainer, searchSection.children[1]);

        // Add toggle button for advanced filters
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'text-green-600 hover:text-green-700 text-sm font-medium mt-2';
        toggleBtn.innerHTML = 'Advanced Filters ▼';
        toggleBtn.id = 'toggleAdvancedFilters';
        
        this.searchInput.parentElement.appendChild(toggleBtn);

        // Toggle advanced filters
        toggleBtn.addEventListener('click', () => {
            const isHidden = filtersContainer.classList.contains('hidden');
            filtersContainer.classList.toggle('hidden');
            toggleBtn.innerHTML = isHidden ? 'Advanced Filters ▲' : 'Advanced Filters ▼';
        });

        // Advanced filter handlers
        document.getElementById('applyAdvancedFilters').addEventListener('click', () => {
            this.performAdvancedSearch();
        });

        document.getElementById('clearAdvancedFilters').addEventListener('click', () => {
            document.getElementById('statusFilter').value = '';
            document.getElementById('habitatFilter').value = '';
            document.getElementById('dietFilter').value = '';
            this.performSearch(); // Reset to basic search
        });
    }

    // Perform advanced search
    performAdvancedSearch() {
        const searchTerm = this.searchInput.value.trim();
        const category = this.categoryFilter.value;
        const status = document.getElementById('statusFilter').value;
        const habitat = document.getElementById('habitatFilter').value;
        const diet = document.getElementById('dietFilter').value;

        let filtered = DataUtils.getAllSpecies();

        if (searchTerm) {
            filtered = DataUtils.searchSpecies(searchTerm);
        }

        if (category) {
            filtered = filtered.filter(species => species.category === category);
        }

        if (status) {
            filtered = filtered.filter(species => species.status === status);
        }

        if (habitat) {
            filtered = filtered.filter(species => 
                species.habitat.toLowerCase().includes(habitat.toLowerCase())
            );
        }

        if (diet) {
            filtered = filtered.filter(species => 
                species.diet.toLowerCase().includes(diet.toLowerCase())
            );
        }

        this.speciesCard.filteredSpecies = filtered;
        this.speciesCard.renderCards(filtered);
        this.updateSearchStats(filtered.length);
        this.highlightSearchTerm(searchTerm);
    }
}
