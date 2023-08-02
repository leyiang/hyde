chrome.storage.sync.get(["hydeRules"], items => {
    if( items?.hydeRules?.[location.hostname] ) {
        const rules = items?.hydeRules?.[location.hostname];
        const selectors = rules.selectors;

        const from = rules.iframe
            ? document.querySelector("#videohtml").contentWindow.document
            : document;

        const check = rules.iframe
            ? document.querySelector("#videohtml").contentWindow.HTMLElement
            : HTMLElement;

        selectors.forEach(key => {
            const el = from.querySelector(key);
            if( el instanceof check ) {
                el.style.visibility = "hidden";
            }
        });
    }
});
