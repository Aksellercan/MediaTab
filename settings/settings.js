document.addEventListener("DOMContentLoaded", function () {
    restoreSettings();
});

document.getElementById("save").addEventListener("click", function () {
    saveSettings();
});

function saveSettings() {
    const theme_switcher = document.getElementById("themeSwitcher").value;
    browser.storage.sync.set({ theme: theme_switcher }, showStatus());
}

function showStatus() {
    const status = document.getElementById("status");
    status.style = "color: white;";
    status.textContent = "Options saved.";
    setTimeout(() => {
        status.textContent = "";
    }, 750);
}

function restoreSettings() {
    browser.storage.sync.get({ theme: "dark" }, (items) => {
        document.getElementById("themeSwitcher").value = items.theme;
    });
}
