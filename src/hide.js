chrome.storage.sync.get(["hydeRules"], items => {
    const map = {
        "visible": "hidden",
        "hidden": "visible"
    };

    if( items?.hydeRules?.[location.hostname] ) {
        const rules = items?.hydeRules?.[location.hostname];
        const selectors = rules.selectors;

        const from = rules.iframe
            ? document.querySelector("#videohtml").contentWindow.document
            : document;

        const check = rules.iframe
            ? document.querySelector("#videohtml").contentWindow.HTMLElement
            : HTMLElement;

        let state = null;

        selectors.forEach(key => {
            const el = from.querySelector(key);

            if( state === null ) {
                const style = getComputedStyle(el);
                state = map[style.visibility]
            }

            if( el instanceof check ) {
                el.style.visibility = state;
            }
        });
    }
});
