document.addEventListener("DOMContentLoaded", restoreSettings());
document.getElementById("save").addEventListener("click", saveSettings());

function saveSettings() {
    browser.storage.sync.set({ theme: document.getElementById("themeSwitcher").value },showStatus());
}

function showStatus() {
    const status = document.getElementById("status"); status.style = "color: white;"; status.textContent = "Options saved.";
    setTimeout(() => {
        status.textContent = "";
    }, 750);
}

function restoreSettings() {
    browser.storage.sync.get({ theme: "dark" }, (items) => {document.getElementById("themeSwitcher").value = items.theme;});
}
