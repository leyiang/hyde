const mainDOM = document.querySelector("main");
let hydeRules = {};

function getDefaultRule(update={}) {
    return Object.assign({
        iframe: false,
        selectors: [],
    }, update );
}

function updateRules() {
    chrome.storage.sync.set({ hydeRules });
    location.reload();
}

function dom(inner) {
    const div = document.createElement("div");
    div.innerHTML = inner;
    return div.firstElementChild;
}

function createRuleDOM(config) {
    console.log( config );
    //language=HTML
    const template = `
        <form class="rule-item">
            <input type="text" class="url-input" placeholder="URL" value="${config.url}" required>
            <textarea name="" id="" cols="30" rows="10" placeholder="selectors to hide" required class="selector-textarea">${config.selectors}</textarea>
            <input type="checkbox" name="" id="" class="iframe-checkbox" ${config.iframe ? 'checked' : '' }>
            <button class="remove-btn" type="button">Remove</button>
            <button>Update</button>
        </form>
    `;

    return dom(template);
}

chrome.storage.sync.get(["hydeRules"], items => {
    hydeRules = items.hydeRules;

    Object.keys(hydeRules).forEach( url => {
        const copy = JSON.parse( JSON.stringify( hydeRules[url] ));
        copy.url = url;
        copy.selectors = copy.selectors.join(',');
        const formDOM = createRuleDOM(copy);
        mainDOM.appendChild( formDOM );

        const remove = formDOM.querySelector(".remove-btn");
        remove.addEventListener("click", () => {
            if( confirm("You sure to remove?") ) {
                delete hydeRules[ url ];
                updateRules()
            }
        });

        formDOM.addEventListener("submit", e => {
            e.preventDefault();
            const newUrl = formDOM.querySelector(".url-input").value;
            const rawRules = formDOM.querySelector(".selector-textarea").value;
            const iframe = formDOM.querySelector(".iframe-checkbox").checked;

            delete hydeRules[url];

            hydeRules[newUrl] = getDefaultRule({
                iframe,
                selectors: rawRules.split(",")
            });

            updateRules();
        });
    });
});

document.querySelector(".add-new").addEventListener("click", () => {
    const template = `
        <form class="rule-item">
            <input type="text" placeholder="URL" class="url-input" required>
            <textarea name="" id="" cols="30" rows="10" placeholder="selectors to hide" required class="selector-textarea"></textarea>
            <button>Save</button>
        </form>
    `;
    const newDOM = dom(template);
    mainDOM.appendChild(newDOM);

    newDOM.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = newDOM.querySelector(".url-input").value;
        const rawRule = newDOM.querySelector(".selector-textarea").value;
        const rules = rawRule.split(",");

        hydeRules[url] = getDefaultRule({
            selectors: rules,
        })

        updateRules();
    });
});