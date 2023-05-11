function navigateBack() {
    window.history.replaceState({}, document.title, '/homePage');
    location.reload();
}