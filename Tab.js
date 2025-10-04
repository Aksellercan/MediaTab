export default class Tab {
    constructor(tabId, muted) {
        this.tabId = tabId;
        this.muted = muted;
    }

    getTabId() {
        return this.tabId;
    }
}
