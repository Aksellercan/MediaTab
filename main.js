// const htmlDOM = document.getElementById("popup-content");

// htmlDOM.addEventListener("click", async function () {
//     await listTabs(await getAudibleTabTitle());
// });

document.addEventListener("DOMContentLoaded", async function () {
    await listTabs(await getAudibleTabTitle());
});

async function getAudibleTabTitle() {
    return await browser.tabs.query({audible: true});
}

async function listTabs(tabs) {
    const media_list = document.getElementById("media-list");
    if (tabs.length < 1) {
        let media = document.createElement("p");
        media.style = "color: red; font-style: oblique;"
        media.textContent = "No tabs playing audio";
        media_list.appendChild(media);
        console.error("No tabs playing audio");
    }
    for (const tab of tabs) {
        if (tab.audible) {
            let media = document.createElement("p");
            media.style = "color: blue; font-style: oblique;"
            media.textContent = `${tab.title}`;
            let switch_tab = document.createElement("button");
            switch_tab.textContent = `switch tab`;
            switch_tab.onclick = async function () {
                let switch_action = browser.tabs.update(tab.id, { active: true });
                if (switch_action)
                    console.log("Switched tab");
                else
                    console.error("Error switching to tab");
            };
            media_list.appendChild(media);
            media_list.appendChild(switch_tab);
            console.log(`tab = ${tab.title}`);
        }
    }
}