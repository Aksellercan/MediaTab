document.addEventListener("DOMContentLoaded", async function () {
    await listTabs(await getAudibleTabs());
});

async function getAudibleTabs() {
    return await browser.tabs.query({ audible: true });
}

function CreateTitleElements(tab) {
    let title_container = document.createElement("div");
    let media_text = document.createElement("p");
    let media_ico = document.createElement("img");
    media_ico.src = tab.favIconUrl;
    media_ico.style = "style= width: 25px; height: 25px;";
    media_text.style = "color: blue; font-style: oblique;";
    media_text.textContent = tab.title;
    title_container.appendChild(media_ico);
    title_container.appendChild(media_text);
    return title_container;
}

function MuteTab(tab) {
    let mute_tab = document.createElement("button");
    mute_tab.textContent = "Mute";
    return mute_tab;
}

function CloseTab(tab) {
    let close_tab = document.createElement("button");
    close_tab.textContent = "Close";
    close_tab.onclick = function() {
        let close_action = browser.tabs.remove(tab.id);
        if (close_action) console.debug(`Closed tab with tabid ${tab.id}`);
        else console.error("Error closing tab");
        window.close();
    };
    return close_tab;
}

function SwitchTab(tab) {
    let switch_tab = document.createElement("button");
    switch_tab.textContent = "switch tab";
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
    buttons_container.appendChild(CloseTab(tab));
    buttons_container.appendChild(MuteTab(tab));
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
        media.style = "color: red; font-style: oblique;";
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
            console.debug(`Tab ${count} = ${tab.title}`);
        }
    }
    console.info(
        count == 0
            ? "Found 0 items"
            : "Found " + count + (count > 1 ? " items" : " item")
    );
}
