import Tab from "./Tab.js";

document.addEventListener("DOMContentLoaded", async function () {
    await listTabs(await getAudibleTabs());
});

async function getAudibleTabs() {
    return await browser.tabs.query({ audible: true });
}

function LimitTabName(name) {
    console.debug(`Tab name length: ${name.length}`);
    let limit = 80;
    if (name.length < limit) {
        return name;
    }
    return name.substring(0,limit).concat("...");
}

function CreateTitleElements(tab) {
    let title_container = document.createElement("div");
    let media_text = document.createElement("p");
    let media_ico = document.createElement("img");
    media_ico.src = tab.favIconUrl;
    media_ico.className = "favicon";
    media_text.style =
        "color: black; font-weight: semi-bold; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
    media_text.textContent = LimitTabName(tab.title);
    title_container.appendChild(media_ico);
    title_container.appendChild(media_text);
    return title_container;
}

function UnMuteTab() {
    let parsed_tab_obj = JSON.parse(localStorage.getItem("mutedTab"));
    let unmute_action = browser.tabs.update(parsed_tab_obj.tabid, {
        muted: false,
    });
    if (unmute_action)
        console.debug(`Un-muted tab with tabid ${parsed_tab_obj.tabid}`);
    else console.error("Error un-muting tab");
    localStorage.removeItem("mutedTab");
}

function MuteTab(tab) {
    let mute_tab = document.createElement("button");
    mute_tab.textContent = "M";
    mute_tab.type = "Mute";
    mute_tab.style = "width: 15%; background-colour: blue";
    mute_tab.onclick = function () {
        let mute_action = browser.tabs.update(tab.id, { muted: true });
        if (mute_action) console.debug(`Muted tab with tabid ${tab.id}`);
        else console.error("Error muting tab");
        let mutedTab = new Tab(tab.id, true);
        localStorage.setItem("mutedTab", JSON.stringify(mutedTab));
        window.close();
    };
    return mute_tab;
}

function CloseTab(tab) {
    let close_tab = document.createElement("button");
    close_tab.textContent = "X";
    close_tab.type = "Term"
    close_tab.style = "width: 15%; background-colour: red";
    close_tab.onclick = function () {
        let close_action = browser.tabs.remove(tab.id);
        if (close_action) console.debug(`Closed tab with tabid ${tab.id}`);
        else console.error("Error closing tab");
        window.close();
    };
    return close_tab;
}

function SwitchTab(tab) {
    let switch_tab = document.createElement("button");
    switch_tab.textContent = "Switch to tab";
    switch_tab.style = "width: 70%;";
    switch_tab.onclick = function () {
        let switch_action = browser.tabs.update(tab.id, { active: true });
        if (switch_action) console.debug(`Switched tab to tabid ${tab.id}`);
        else console.error("Error switching to tab");
        window.close();
    };
    return switch_tab;
}

function CreateButtonElements(tab) {
    let buttons_container = document.createElement("div");
    buttons_container.appendChild(SwitchTab(tab));
    buttons_container.appendChild(MuteTab(tab));
    buttons_container.appendChild(CloseTab(tab));
    return buttons_container;
}

function GenerateHTMLElements(tab) {
    let media_div = document.createElement("div");
    media_div.appendChild(CreateTitleElements(tab));
    media_div.appendChild(CreateButtonElements(tab));
    return media_div;
}

async function listTabs(tabs) {
    const media_list = document.getElementById("media-list");
    if (tabs.length < 1) {
        let media = document.createElement("p");
        media.style =
            "color: red; font-weight: semi-bold; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
        media.textContent = "No tabs playing audio";
        media_list.appendChild(media);
        console.warn("No tabs playing audio");
    }
    let count = 0;
    for (const tab of tabs) {
        if (tab.audible) {
            let media = GenerateHTMLElements(tab);
            media_list.appendChild(media);
            count++;
            console.debug(`Tab ${count}: ${tab.title}`);
        }
    }
    if (count != 0)
        console.info("Found " + count + (count > 1 ? " items" : " item"));
}
