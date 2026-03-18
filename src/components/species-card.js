// Species Card Component
// Handles the creation and management of species cards

class SpeciesCard {
    constructor(container) {
        this.container = container;
        this.species = [];
        this.filteredSpecies = [];
    }

    // Render a single species card
    renderCard(species) {
        const statusClass = `status-${species.status.replace('_', '-')}`;
        const statusText = this.getStatusText(species.status);
        
        return `
            <div class="species-card bg-white rounded-lg shadow-md overflow-hidden fade-in" data-species-id="${species.id}">
                <div class="relative">
                    <img src="${species.image}" alt="${species.name}" class="w-full h-48 object-cover lazy-image">
                    <div class="absolute top-2 right-2">
                        <span class="${statusClass} px-2 py-1 rounded-full text-xs font-semibold">
                            ${statusText}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${species.name}</h3>
                    <p class="text-sm text-gray-600 italic mb-3">${species.scientificName}</p>
                    <p class="text-gray-700 mb-3 line-clamp-2">${species.description}</p>
                    
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16a1 1 0 11-2 0V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                            </svg>
                            <span class="text-gray-600">Habitat: ${species.habitat}</span>
                        </div>
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                            </svg>
                            <span class="text-gray-600">Location: ${species.location}</span>
                        </div>
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/>
                            </svg>
                            <span class="text-gray-600">Diet: ${species.diet}</span>
                        </div>
                    </div>
                    
                    <button class="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors view-details-btn" data-species-id="${species.id}">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    // Render multiple species cards
    renderCards(speciesList) {
        if (!speciesList || speciesList.length === 0) {
            this.container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-gray-500 text-lg">No species found</p>
                    <p class="text-gray-400 mt-2">Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = speciesList
            .map(species => this.renderCard(species))
            .join('');

        this.attachEventListeners();
    }

    // Get formatted status text
    getStatusText(status) {
        const statusMap = {
            'critically-endangered': 'Critically Endangered',
            'endangered': 'Endangered',
            'vulnerable': 'Vulnerable',
            'near-threatened': 'Near Threatened',
            'least-concern': 'Least Concern'
        };
        return statusMap[status] || status;
    }

    // Attach event listeners to cards
    attachEventListeners() {
        // View details buttons
        const viewDetailsBtns = this.container.querySelectorAll('.view-details-btn');
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speciesId = e.target.dataset.speciesId;
                this.showSpeciesDetails(speciesId);
            });
        });

        // Lazy loading for images
        const images = this.container.querySelectorAll('.lazy-image');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Show species details modal
    showSpeciesDetails(speciesId) {
        const species = DataUtils.getSpeciesById(speciesId);
        if (!species) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content max-w-2xl">
                <button class="modal-close">&times;</button>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <img src="${species.image}" alt="${species.name}" class="w-full rounded-lg">
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">${species.name}</h2>
                        <p class="text-gray-600 italic mb-4">${species.scientificName}</p>
                        <div class="mb-4">
                            <span class="status-${species.status.replace('_', '-')} px-3 py-1 rounded-full text-sm font-semibold">
                                ${this.getStatusText(species.status)}
                            </span>
                        </div>
                        <p class="text-gray-700 mb-4">${species.description}</p>
                        
                        <div class="space-y-3">
                            <div class="flex justify-between py-2 border-b">
                                <span class="font-semibold text-gray-600">Habitat:</span>
                                <span class="text-gray-800">${species.habitat}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="font-semibold text-gray-600">Location:</span>
                                <span class="text-gray-800">${species.location}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="font-semibold text-gray-600">Diet:</span>
                                <span class="text-gray-800">${species.diet}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="font-semibold text-gray-600">Weight:</span>
                                <span class="text-gray-800">${species.weight}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="font-semibold text-gray-600">Lifespan:</span>
                                <span class="text-gray-800">${species.lifespan}</span>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <h3 class="font-bold text-gray-800 mb-2">Threats:</h3>
                            <div class="flex flex-wrap gap-2">
                                ${species.threats.map(threat => `
                                    <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                        ${threat}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h3 class="font-bold text-gray-800 mb-2">Conservation:</h3>
                            <p class="text-gray-700 text-sm">${species.conservation}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Filter species based on criteria
    filterSpecies(criteria) {
        let filtered = DataUtils.getAllSpecies();

        if (criteria.search) {
            filtered = DataUtils.searchSpecies(criteria.search);
        }

        if (criteria.category) {
            filtered = filtered.filter(species => species.category === criteria.category);
        }

        if (criteria.status) {
            filtered = filtered.filter(species => species.status === criteria.status);
        }

        this.filteredSpecies = filtered;
        this.renderCards(filtered);
        return filtered;
    }

    // Initialize the component
    init() {
        this.species = DataUtils.getAllSpecies();
        this.filteredSpecies = this.species;
        this.renderCards(this.species);
    }
}
