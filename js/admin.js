// Admin Panel JavaScript
let currentUser = null;
let isSidebarOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// Initialize Admin Panel
function initializeAdminPanel() {
    // Check authentication
    const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (!userData) {
        window.location.href = '../index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Update user info
    updateUserInfo();
    
    // Initialize charts
    initializeCharts();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize search functionality
    initializeSearch();
    
    // Load dashboard data
    loadDashboardData();
}

// Update user information
function updateUserInfo() {
    const userNameElement = document.getElementById('userName');
    const userMenuName = document.querySelector('.user-name');
    
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    if (userMenuName) {
        userMenuName.textContent = currentUser.name;
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 1024) {
        isSidebarOpen = !isSidebarOpen;
        sidebar.classList.toggle('open', isSidebarOpen);
    }
}

// Initialize charts
function initializeCharts() {
    // Requests by Type Chart
    const requestsCtx = document.getElementById('requestsChart');
    if (requestsCtx) {
        new Chart(requestsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Re-finance', 'REPO', 'CAN-DO'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    // Agency Performance Chart
    const agencyCtx = document.getElementById('agencyChart');
    if (agencyCtx) {
        new Chart(agencyCtx, {
            type: 'bar',
            data: {
                labels: ['ABC Agency', 'XYZ Valuers', 'Premium Assessors', 'Quick Value'],
                datasets: [{
                    label: 'Completed Requests',
                    data: [120, 95, 78, 65],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                }, {
                    label: 'Pending Requests',
                    data: [15, 8, 12, 5],
                    backgroundColor: '#f59e0b',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Add event listeners
function addEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        if (window.innerWidth <= 1024 && 
            isSidebarOpen && 
            !sidebar.contains(event.target) && 
            !sidebarToggle.contains(event.target)) {
            toggleSidebar();
        }
    });
    
    // Chart filter change
    const chartFilter = document.querySelector('.chart-filter');
    if (chartFilter) {
        chartFilter.addEventListener('change', function() {
            updateChartData(this.value);
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
    }
    
    // Notifications click
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', function() {
            showNotificationsPanel();
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        // Add search suggestions
        const suggestions = [
            'Create new request',
            'View clients',
            'Quality control',
            'Generate reports',
            'Manage agencies'
        ];
        
        searchInput.addEventListener('focus', function() {
            showSearchSuggestions(suggestions);
        });
        
        searchInput.addEventListener('blur', function() {
            setTimeout(hideSearchSuggestions, 200);
        });
    }
}

// Show search suggestions
function showSearchSuggestions(suggestions) {
    let suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        document.querySelector('.search-bar').appendChild(suggestionsContainer);
    }
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item">${suggestion}</div>`
    ).join('');
    
    suggestionsContainer.style.display = 'block';
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Perform search
function performSearch(query) {
    if (query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    // Simulate search results
    const searchResults = [
        { type: 'request', title: 'Honda City 2020', id: 'REQ001' },
        { type: 'client', title: 'ABC Motors', id: 'CLI001' },
        { type: 'agency', title: 'XYZ Valuers', id: 'AGY001' }
    ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    showSearchResults(searchResults);
}

// Show search results
function showSearchResults(results) {
    let resultsContainer = document.querySelector('.search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        document.querySelector('.search-bar').appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => 
            `<div class="result-item" onclick="navigateToResult('${result.type}', '${result.id}')">
                <i class="fas fa-${getResultIcon(result.type)}"></i>
                <span>${result.title}</span>
            </div>`
        ).join('');
    }
    
    resultsContainer.style.display = 'block';
}

// Get result icon
function getResultIcon(type) {
    const icons = {
        request: 'clipboard-list',
        client: 'users',
        agency: 'building'
    };
    return icons[type] || 'search';
}

// Navigate to search result
function navigateToResult(type, id) {
    const routes = {
        request: 'requests.html',
        client: 'clients.html',
        agency: 'agencies.html'
    };
    
    if (routes[type]) {
        window.location.href = `${routes[type]}?id=${id}`;
    }
}

// Show notifications panel
function showNotificationsPanel() {
    const notifications = [
        { type: 'info', message: 'New request assigned to ABC Agency', time: '2 min ago' },
        { type: 'success', message: 'Quality control completed for Toyota Innova', time: '15 min ago' },
        { type: 'warning', message: 'Report generation failed for Maruti Swift', time: '1 hour ago' }
    ];
    
    let panel = document.querySelector('.notifications-panel');
    
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'notifications-panel';
        document.body.appendChild(panel);
    }
    
    panel.innerHTML = `
        <div class="notifications-header">
            <h3>Notifications</h3>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notifications-list">
            ${notifications.map(notification => `
                <div class="notification-item ${notification.type}">
                    <div class="notification-icon">
                        <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <p>${notification.message}</p>
                        <span>${notification.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    panel.style.display = 'block';
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// Update chart data
function updateChartData(period) {
    // Simulate data update based on period
    const data = {
        'Last 30 Days': [45, 30, 25],
        'Last 3 Months': [52, 28, 20],
        'Last 6 Months': [48, 32, 20],
        'Last Year': [50, 30, 20]
    };
    
    // Update chart with new data
    console.log(`Updating chart data for period: ${period}`);
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading dashboard data
    setTimeout(() => {
        updateMetrics();
        updateRecentActivity();
    }, 1000);
}

// Update metrics
function updateMetrics() {
    // Simulate real-time metric updates
    const metrics = [
        { id: 'total-requests', value: '1,247', change: '+12.5%' },
        { id: 'pending-requests', value: '89', change: '-5.2%' },
        { id: 'rejected-cases', value: '23', change: '0%' },
        { id: 'under-qc', value: '156', change: '+8.7%' },
        { id: 'pending-pricing', value: '67', change: '+15.3%' },
        { id: 'completed', value: '912', change: '+22.1%' }
    ];
    
    metrics.forEach(metric => {
        const element = document.querySelector(`[data-metric="${metric.id}"]`);
        if (element) {
            element.textContent = metric.value;
        }
    });
}

// Update recent activity
function updateRecentActivity() {
    // Simulate real-time activity updates
    const activities = [
        { icon: 'plus-circle', message: 'New Request created for Honda City 2020', time: '2 minutes ago' },
        { icon: 'check-circle', message: 'Quality Control completed for Toyota Innova', time: '15 minutes ago' },
        { icon: 'file-pdf', message: 'Report Generated for Maruti Swift', time: '1 hour ago' }
    ];
    
    // Update activity list
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        // Add new activities dynamically
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.message.split(' ')[0]}</strong> ${activity.message.split(' ').slice(1).join(' ')}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            activityList.insertBefore(activityItem, activityList.firstChild);
        });
    }
}

// Export functions for use in other admin pages
window.AdminPanel = {
    toggleSidebar,
    showNotification: function(message, type = 'info') {
        // Use the notification function from main.js
        if (window.VehicleValuationSystem && window.VehicleValuationSystem.showNotification) {
            window.VehicleValuationSystem.showNotification(message, type);
        }
    },
    logout: function() {
        logout();
    }
};

// Global logout function
function logout() {
    // Clear all stored data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userData');
    
    // Reset authentication state
    isAuthenticated = false;
    currentUser = null;
    console.log('Logged out');
    // Redirect to login page
    window.location.href = '../index.html';
    
} 