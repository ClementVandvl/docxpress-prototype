function onElementClick(id, event) {
    document.getElementById(id).addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tab = tabs[0];

            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: event,
                //        files: ['contentScript.js'],  // To call external file instead
            }); // .then(() => console.log('Injected a function!')); // Log the injection
        });
    });
}

/**
 * Function to be called inside the content script
 */
function injectedFunction() {
    async function getFirstDataFromRoute(route) {
        let res = await fetch(`http://62.72.19.90:3000/${route}`);
        res = await res.json();
        if (!Array.isArray(res) || !res?.length) {
            console.log("Not Array");
            return;
        }
        const firstData = res[0];
        if (!firstData?.url) {
            console.log("No URL");
            return;
        }
        return firstData;
    }

    async function getFileFromData(data) {
        const image = await fetch(data.url);
        const blob = await image.blob();
        return new File([blob], data.filename, { type: blob.type });
    }

    function triggerOnChangeForInput(file, fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fileInput.files = dataTransfer.files;

        const event = new Event('change', {
            bubbles: true,
            cancelable: true
        });

        fileInput.dispatchEvent(event);
    }

    async function fillIdCard() {
        const ID_CardFileInput = document.querySelector('input[id="id_card"]');
        if (!ID_CardFileInput) {
            console.error('No file input found');
            return;
        }

        const data = await getFirstDataFromRoute("id_cards");
        if (!data) return;
        const file = await getFileFromData(data);
        triggerOnChangeForInput(file, ID_CardFileInput)
    }

    async function fillPassPort() {
        const ID_CardFileInput = document.querySelector('input[id="passport"]');
        if (!ID_CardFileInput) {
            console.error('No file input found');
            return;
        }

        const data = await getFirstDataFromRoute("passports");
        if (!data) return;
        const file = await getFileFromData(data);
        triggerOnChangeForInput(file, ID_CardFileInput)
    }

    fillIdCard();
    fillPassPort();
}

onElementClick('fill-form', injectedFunction);
