var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltips.forEach(function(tooltip) {
    new bootstrap.Tooltip(tooltip);
});

var popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
popovers.forEach(function(popover) {
    new bootstrap.Popover(popover);
});

window.addEventListener('load', function() {
    var toast = new bootstrap.Toast(document.getElementById('welcomeToast'));
    toast.show();
});

document.getElementById('themeToggle').addEventListener('click', function() {
    var html = document.documentElement;
    var theme = html.getAttribute('data-bs-theme');
    var newTheme = theme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-bs-theme', newTheme);
    
    var icon = document.getElementById('themeIcon');
    icon.className = newTheme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
});
