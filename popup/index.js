await setSettings();
const Outer_Container = document.getElementById("Outer_Container");
listAudibleTabs(Outer_Container);
listMutedTabs(Outer_Container);

async function getAudibleTabs() {
    return await browser.tabs.query({ currentWindow: true, audible: true });
}

async function getMutedTabs() {
    return await browser.tabs.query({ currentWindow: true, muted: true });
}

async function setSettings() {
    let theme = await browser.storage.sync.get("theme");
    let setting = "dark";
    if (theme.theme) setting = theme.theme;
    document.body.classList.toggle(setting);
}

function LimitTabName(name) {
    console.debug(`Tab name length: ${name.length}`);
    let limit = 42;
    if (name.length <= limit) return name;
    return name.substring(0, limit).concat("...");
}

function CreateTitleElements(tab) {
    let title_container = document.createElement("div"); title_container.id = "title_container";
    let media_text = document.createElement("p"); media_text.textContent = LimitTabName(tab.title);
    let media_ico = document.createElement("img"); media_ico.src = tab.favIconUrl; media_ico.className = "favicon";
    title_container.appendChild(media_ico);
    title_container.appendChild(media_text);
    return title_container;
}

function UnMuteTab(tab) {
    let unmute_tab = document.createElement("button"); unmute_tab.textContent = "Unmute"; unmute_tab.type = "UnMute";
    unmute_tab.onclick = function () {
        let unmute_action = browser.tabs.update(tab.id, { muted: false });
        if (unmute_action) console.debug(`Un-muted tab with tabid ${tab.id}`);
        else console.error("Error un-muting tab");
        window.close();
    };
    return unmute_tab;
}

function MuteTab(tab) {
    let mute_tab = document.createElement("button"); mute_tab.textContent = "Mute"; mute_tab.type = "Mute";
    mute_tab.onclick = function () {
        let mute_action = browser.tabs.update(tab.id, { muted: true });
        if (mute_action) console.debug(`Muted tab with tabid ${tab.id}`);
        else console.error("Error muting tab");
        window.close();
    };
    return mute_tab;
}

function CloseTab(tab) {
    let close_tab = document.createElement("button"); close_tab.textContent = "X"; close_tab.type = "Close";
    close_tab.onclick = function () {
        let close_action = browser.tabs.remove(tab.id);
        if (close_action) console.debug(`Closed tab with tabid ${tab.id}`);
        else console.error("Error closing tab");
        window.close();
    };
    return close_tab;
}

function SwitchTab(tab) {
    let switch_tab = document.createElement("button"); switch_tab.textContent = "Switch to tab"; switch_tab.type = "Switch";
    switch_tab.onclick = function () {
        let switch_action = browser.tabs.update(tab.id, { active: true });
        if (switch_action) console.debug(`Switched tab to tabid ${tab.id}`);
        else console.error("Error switching to tab");
        window.close();
    };
    return switch_tab;
}

function CreateButtonElements(tab, muteButton) {
    let buttons_container = document.createElement("div"); 
    buttons_container.appendChild(SwitchTab(tab)); 
    buttons_container.appendChild(muteButton);
    buttons_container.appendChild(CloseTab(tab));
    return buttons_container;
}

function GenerateTabElements(tab) {
    let media_div = document.createElement("div");
    media_div.appendChild(CreateTitleElements(tab));
    media_div.appendChild(CreateButtonElements(tab, MuteTab(tab)));
    return media_div;
}

function GenerateMutedTabElements(tab) {
    let media_div = document.createElement("div");
    media_div.appendChild(CreateTitleElements(tab));
    media_div.appendChild(CreateButtonElements(tab, UnMuteTab(tab)));
    return media_div;
}

async function listMutedTabs(Outer_Container) {
    let mutedTabs = await getMutedTabs();
    if (mutedTabs.length > 0) {
        console.log(`Muted tabs length: ${mutedTabs.length}`);
        let title = document.createElement("p"); title.textContent = "Muted Tabs";
        Outer_Container.appendChild(title);
        for (const tab of mutedTabs) {
            Outer_Container.appendChild(GenerateMutedTabElements(tab));
            console.debug(`Muted Tab: ${tab.title}`);
        }
    }
}

function NoTabs() {
    let media = document.createElement("p"); media.textContent = "No tabs playing audio";
    console.warn("No tabs playing audio");
    return media;
}

async function listAudibleTabs(Outer_Container) {
    let audibleTabs = await getAudibleTabs();
    if (audibleTabs.length < 1) Outer_Container.appendChild(NoTabs());
    for (const tab of audibleTabs) {
        if (tab.audible) {
            Outer_Container.appendChild(GenerateTabElements(tab));
            console.debug(`Tab: ${tab.title}`);
        }
    }
}
