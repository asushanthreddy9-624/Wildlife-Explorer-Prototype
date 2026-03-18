// Wildlife Explorer App - Main JavaScript
// Mobile-First SPA with LocalStorage

class WildlifeExplorerApp {
    constructor() {
        this.currentView = 'liveMapView';
        this.reports = [];
        this.mapPins = [];
        this.init();
    }

    init() {
        this.loadReportsFromStorage();
        this.setupNavigation();
        this.setupEmergencyForm();
        this.setupMapPins();
        this.updateDashboard();
        this.startLocationUpdates();
        this.initializeApp();
    }

    // Initialize the app
    initializeApp() {
        console.log('Wildlife Explorer App initialized');
        this.showView('liveMapView');
        
        // Add initial animation
        setTimeout(() => {
            document.querySelector('.mobile-container').classList.add('slide-in-left');
        }, 100);
    }

    // Navigation System
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetView = btn.dataset.view;
                this.showView(targetView);
                this.updateActiveNav(btn);
            });
        });
    }

    showView(viewId) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target view
        const targetSection = document.getElementById(viewId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentView = viewId;

            // Refresh dashboard if admin view
            if (viewId === 'adminView') {
                this.updateDashboard();
            }
        }
    }

    updateActiveNav(activeBtn) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Map Functionality
    setupMapPins() {
        const pins = document.querySelectorAll('.map-pin');
        
        pins.forEach(pin => {
            // Add pulse animation to random pins
            if (Math.random() > 0.5) {
                pin.classList.add('map-pulse');
            }

            // Click handler for pins
            pin.addEventListener('click', (e) => {
                this.showPinDetails(pin);
            });

            // Touch handler for mobile
            pin.addEventListener('touchstart', (e) => {
                this.showPinDetails(pin);
            });
        });
    }

    showPinDetails(pin) {
        const species = pin.dataset.species;
        const location = pin.dataset.location;
        
        // Create tooltip
        const existingTooltip = document.querySelector('.tooltip-custom');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-custom';
        tooltip.innerHTML = `
            <strong>${this.getSpeciesName(species)}</strong><br>
            ${location}<br>
            <small>Last seen: ${Math.floor(Math.random() * 30) + 1} min ago</small>
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = pin.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 80) + 'px';

        // Remove tooltip after 3 seconds
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                tooltip.remove();
            }
        }, 3000);
    }

    getSpeciesName(species) {
        const speciesNames = {
            'bird': 'Bird',
            'otter': 'Otter',
            'deer': 'Deer'
        };
        return speciesNames[species] || 'Wildlife';
    }

    // Map Controls
    zoomIn() {
        const mapImage = document.querySelector('.map-image');
        const currentScale = mapImage.style.transform ? 
            parseFloat(mapImage.style.transform.replace('scale(', '').replace(')', '')) : 1;
        const newScale = Math.min(currentScale + 0.2, 3);
        mapImage.style.transform = `scale(${newScale})`;
        mapImage.style.transition = 'transform 0.3s ease';
    }

    zoomOut() {
        const mapImage = document.querySelector('.map-image');
        const currentScale = mapImage.style.transform ? 
            parseFloat(mapImage.style.transform.replace('scale(', '').replace(')', '')) : 1;
        const newScale = Math.max(currentScale - 0.2, 0.5);
        mapImage.style.transform = `scale(${newScale})`;
        mapImage.style.transition = 'transform 0.3s ease';
    }

    resetMap() {
        const mapImage = document.querySelector('.map-image');
        mapImage.style.transform = 'scale(1)';
        mapImage.style.transition = 'transform 0.3s ease';
    }

    // Emergency Form System
    setupEmergencyForm() {
        const form = document.getElementById('emergencyForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEmergencyReport();
        });

        // Add real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (!isValid) {
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }

        return isValid;
    }

    submitEmergencyReport() {
        const form = document.getElementById('emergencyForm');
        
        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showError('Please fill in all required fields');
            return;
        }

        // Create report object
        const report = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            location: document.getElementById('gpsLocation').textContent,
            incidentType: document.getElementById('incidentType').value,
            animalType: document.getElementById('animalType').value || 'Unknown',
            details: document.getElementById('incidentDetails').value,
            reporterName: document.getElementById('reporterName').value || 'Anonymous',
            reporterContact: document.getElementById('reporterContact').value || 'Not provided',
            status: 'pending',
            priority: this.calculatePriority(document.getElementById('incidentType').value)
        };

        // Save to LocalStorage
        this.saveReportToStorage(report);

        // Show success message
        this.showSuccessMessage();

        // Clear form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });

        // Navigate to admin dashboard after delay
        setTimeout(() => {
            this.showView('adminView');
            document.querySelector('[data-view="adminView"]').click();
        }, 2000);
    }

    calculatePriority(incidentType) {
        const priorityMap = {
            'aggressive': 'high',
            'injured': 'high',
            'trapped': 'medium',
            'poaching': 'high',
            'abandoned': 'medium',
            'other': 'low'
        };
        return priorityMap[incidentType] || 'medium';
    }

    // LocalStorage Management
    saveReportToStorage(report) {
        this.reports.push(report);
        localStorage.setItem('wildlifeReports', JSON.stringify(this.reports));
        console.log('Report saved to LocalStorage:', report);
    }

    loadReportsFromStorage() {
        const stored = localStorage.getItem('wildlifeReports');
        if (stored) {
            this.reports = JSON.parse(stored);
        }
    }

    clearAllReports() {
        if (confirm('Are you sure you want to clear all emergency reports? This action cannot be undone.')) {
            this.reports = [];
            localStorage.removeItem('wildlifeReports');
            this.updateDashboard();
            this.showSuccess('All reports cleared successfully');
        }
    }

    // Dashboard Management
    updateDashboard() {
        this.updateStatistics();
        this.renderReportsList();
    }

    updateStatistics() {
        const totalReports = document.getElementById('totalReports');
        const pendingReports = document.getElementById('pendingReports');

        if (totalReports) {
            totalReports.textContent = this.reports.length;
        }

        if (pendingReports) {
            const pending = this.reports.filter(r => r.status === 'pending').length;
            pendingReports.textContent = pending;
        }
    }

    renderReportsList() {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;

        if (this.reports.length === 0) {
            reportsList.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-2">No emergency reports yet</p>
                </div>
            `;
            return;
        }

        // Sort reports by timestamp (newest first)
        const sortedReports = [...this.reports].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        reportsList.innerHTML = sortedReports.map(report => this.createReportCard(report)).join('');
    }

    createReportCard(report) {
        const date = new Date(report.timestamp);
        const timeAgo = this.getTimeAgo(date);
        const priorityClass = `priority-${report.priority}`;
        const statusClass = `status-${report.status}`;

        return `
            <div class="card report-card ${priorityClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge ${priorityClass} me-2">${report.priority.toUpperCase()}</span>
                            <span class="badge ${statusClass}">${report.status}</span>
                        </div>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                    
                    <h6 class="card-title">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        ${this.getIncidentTypeName(report.incidentType)}
                    </h6>
                    
                    <p class="card-text">
                        <strong>Animal:</strong> ${report.animalType}<br>
                        <strong>Location:</strong> ${report.location}<br>
                        <strong>Reporter:</strong> ${report.reporterName}
                    </p>
                    
                    <div class="report-details mb-3">
                        <small class="text-muted">${report.details}</small>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-clock me-1"></i>
                            ${date.toLocaleString()}
                        </small>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="app.markInProgress(${report.id})">
                                <i class="bi bi-play-circle"></i> In Progress
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="app.markResolved(${report.id})">
                                <i class="bi bi-check-circle"></i> Resolve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getIncidentTypeName(type) {
        const typeNames = {
            'injured': 'Injured Animal',
            'aggressive': 'Aggressive Behavior',
            'trapped': 'Trapped Animal',
            'abandoned': 'Abandoned Baby Animal',
            'poaching': 'Poaching Activity',
            'other': 'Other Emergency'
        };
        return typeNames[type] || type;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    // Report Status Management
    markInProgress(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            report.status = 'in-progress';
            this.saveReportsToStorage();
            this.updateDashboard();
            this.showSuccess('Report marked as in progress');
        }
    }

    markResolved(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            report.status = 'resolved';
            this.saveReportsToStorage();
            this.updateDashboard();
            this.showSuccess('Report marked as resolved');
        }
    }

    saveReportsToStorage() {
        localStorage.setItem('wildlifeReports', JSON.stringify(this.reports));
    }

    // Location Services
    updateLocation() {
        const locationElement = document.getElementById('gpsLocation');
        if (!locationElement) return;

        // Simulate location update
        const locations = [
            '1.3521° N, 103.8198° E',
            '1.3535° N, 103.8201° E',
            '1.3518° N, 103.8195° E',
            '1.3528° N, 103.8203° E'
        ];

        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        locationElement.textContent = randomLocation;
        
        // Add animation
        locationElement.style.color = '#28a745';
        setTimeout(() => {
            locationElement.style.color = '';
        }, 1000);

        this.showSuccess('Location updated successfully');
    }

    startLocationUpdates() {
        // Update location every 30 seconds
        setInterval(() => {
            if (this.currentView === 'emergencyView') {
                this.updateLocation();
            }
        }, 30000);
    }

    // Message System
    showSuccessMessage() {
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existing = document.querySelector('.success-message, .error-message');
        if (existing) {
            existing.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.innerHTML = `
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2"></i>
            ${message}
        `;

        // Insert at the top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageDiv, mainContent.firstChild);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // Utility Methods
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    generateReportId() {
        return 'WR' + Date.now().toString().slice(-6);
    }

    // App Lifecycle
    handleOnlineStatus() {
        window.addEventListener('online', () => {
            this.showSuccess('Connection restored');
        });

        window.addEventListener('offline', () => {
            this.showError('Connection lost - reports will sync when online');
        });
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 1-3 for navigation
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
                e.preventDefault();
                const views = ['liveMapView', 'emergencyView', 'adminView'];
                const viewIndex = parseInt(e.key) - 1;
                const targetView = views[viewIndex];
                const targetBtn = document.querySelector(`[data-view="${targetView}"]`);
                if (targetBtn) {
                    targetBtn.click();
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                });
            }
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WildlifeExplorerApp();
    
    // Setup additional features
    app.handleOnlineStatus();
    app.setupKeyboardShortcuts();
    
    console.log('Wildlife Explorer App ready!');
});

// Global functions for inline event handlers
function zoomIn() {
    window.app.zoomIn();
}

function zoomOut() {
    window.app.zoomOut();
}

function resetMap() {
    window.app.resetMap();
}

function updateLocation() {
    window.app.updateLocation();
}

function clearAllReports() {
    window.app.clearAllReports();
}
