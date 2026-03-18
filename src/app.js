// Main Application Entry Point
// Wildlife Explorer Prototype

class WildlifeExplorer {
    constructor() {
        this.speciesCard = null;
        this.searchComponent = null;
        this.init();
    }

    // Initialize the application
    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.updateConservationStats();
        this.setupNavigation();
        this.addLoadingStates();
    }

    // Initialize all components
    initializeComponents() {
        // Initialize species cards
        const speciesGrid = document.getElementById('speciesGrid');
        if (speciesGrid) {
            this.speciesCard = new SpeciesCard(speciesGrid);
            this.speciesCard.init();
        }

        // Initialize search component
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput && categoryFilter && searchBtn && this.speciesCard) {
            this.searchComponent = new SearchComponent(searchInput, categoryFilter, searchBtn);
            this.searchComponent.init(this.speciesCard);
            this.searchComponent.addSearchSuggestions();
            this.searchComponent.addAdvancedFilters();
        }
    }

    // Setup global event listeners
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Mobile menu toggle (if needed in future)
        this.setupMobileMenu();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Theme toggle (if implemented in future)
        this.setupThemeToggle();

        // Intersection Observer for animations
        this.setupScrollAnimations();
    }

    // Update conservation statistics
    updateConservationStats() {
        const counts = DataUtils.getConservationCounts();
        
        // Update the conservation status cards
        const statusElements = {
            'critically-endangered': document.querySelector('.bg-red-100 .text-3xl'),
            'endangered': document.querySelector('.bg-orange-100 .text-3xl'),
            'vulnerable': document.querySelector('.bg-yellow-100 .text-3xl'),
            'least-concern': document.querySelector('.bg-green-100 .text-3xl')
        };

        Object.keys(statusElements).forEach(status => {
            if (statusElements[status]) {
                this.animateNumber(statusElements[status], 0, counts[status] || 0, 1000);
            }
        });
    }

    // Animate number counting
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        requestAnimationFrame(updateNumber);
    }

    // Setup navigation
    setupNavigation() {
        // Highlight current section in navigation
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('text-green-200');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('text-green-200');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Setup mobile menu
    setupMobileMenu() {
        // This can be expanded when mobile responsiveness is needed
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'md:hidden bg-green-600 p-2 rounded-lg';
        mobileMenuBtn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;

        // Add mobile menu toggle functionality when needed
        // For now, this is a placeholder for future mobile responsiveness
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Ctrl/Cmd + / to show keyboard shortcuts help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
        });
    }

    // Show keyboard shortcuts modal
    showKeyboardShortcuts() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content max-w-md">
                <button class="modal-close">&times;</button>
                <h2 class="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
                <div class="space-y-2">
                    <div class="flex justify-between py-2 border-b">
                        <span>Focus Search</span>
                        <kbd class="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + K</kbd>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span>Clear Search</span>
                        <kbd class="px-2 py-1 bg-gray-100 rounded text-sm">Esc</kbd>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span>Show Shortcuts</span>
                        <kbd class="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + /</kbd>
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

        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Setup theme toggle (placeholder for future implementation)
    setupThemeToggle() {
        // This can be expanded to include dark/light theme switching
        const themeBtn = document.createElement('button');
        themeBtn.className = 'p-2 rounded-lg hover:bg-gray-100';
        themeBtn.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
        `;
        themeBtn.title = 'Toggle theme (coming soon)';
        
        // Add to header when theme functionality is implemented
    }

    // Setup scroll animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(element);
        });
    }

    // Add loading states
    addLoadingStates() {
        // Add loading spinner for async operations
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden';
        loadingSpinner.id = 'globalLoadingSpinner';
        document.body.appendChild(loadingSpinner);

        // Show loading spinner during data fetching
        this.showLoadingSpinner();
        setTimeout(() => {
            this.hideLoadingSpinner();
        }, 1000); // Simulate loading time
    }

    // Show loading spinner
    showLoadingSpinner() {
        const spinner = document.getElementById('globalLoadingSpinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    // Hide loading spinner
    hideLoadingSpinner() {
        const spinner = document.getElementById('globalLoadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span>Something went wrong. Please try again.</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Success message
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg z-50';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.wildlifeExplorer = new WildlifeExplorer();
        console.log('Wildlife Explorer initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Wildlife Explorer:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.wildlifeExplorer) {
        // Refresh data when page becomes visible again
        window.wildlifeExplorer.updateConservationStats();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.wildlifeExplorer) {
        window.wildlifeExplorer.showSuccess('Connection restored');
    }
});

window.addEventListener('offline', () => {
    if (window.wildlifeExplorer) {
        window.wildlifeExplorer.handleError(new Error('Offline'), 'Network Status');
    }
});
