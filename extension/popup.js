document.addEventListener('DOMContentLoaded', () => {
    onElementClick('fill-form', showCarousels);
    onElementClick('submit-images', submitImages);
});

var tabToPosition = [0, 0]
var isFormFilled = false;

function createImageElement(url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Image';
    img.style.width = "300px";
    return img;
}

function createPdfElement(url) {
    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';

    const embed = document.createElement('embed');
    embed.src = url;
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '100%';
    pdfContainer.appendChild(embed);

    return pdfContainer;
}

function createCarousel(data, carouselId) {
    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    const ul = document.createElement('ul');
    ul.className = 'carousel-list';
    ul.id = carouselId;

    data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'carousel-item';

        if (item.type === 'image') {
            const imgElement = createImageElement(item.url);
            li.appendChild(imgElement);
        } else if (item.type === 'pdf') {
            const pdfElement = createPdfElement(item.url);
            li.appendChild(pdfElement);
        } else {
            const textElement = document.createElement('span');
            textElement.textContent = item.filename;
            li.appendChild(textElement);
        }

        ul.appendChild(li);
    });

    carousel.appendChild(ul);

    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button prev';
    prevButton.innerHTML = '&#10094;';
    prevButton.onclick = () => moveCarousel(-1, carouselId);

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button next';
    nextButton.innerHTML = '&#10095;';
    nextButton.onclick = () => moveCarousel(1, carouselId);

    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);

    document.body.appendChild(carousel);
}

function onElementClick(id, event) {
    document.getElementById(id).addEventListener('click', event);
}

async function loadCarousels() {
    const idCardsData = await getAllDataFromRoute("id_cards");
    const passportsData = await getAllDataFromRoute("passports");

    const idCards = idCardsData.map(item => ({ type: 'image', url: item.url, filename: item.filename }));
    const passports = passportsData.map(item => ({ type: 'image', url: item.url, filename: item.filename }));

    createCarousel(idCards, 'id-cards-carousel');
    createCarousel(passports, 'passports-carousel');
}

function showCarousels() {
    if (isFormFilled) {
        return;  // Prevent fetching again if already filled
    }

    isFormFilled = true;
    document.getElementById('fill-form').disabled = true;
    loadCarousels();
}

async function getAllDataFromRoute(route) {
    let res = await fetch(`http://62.72.19.90:3000/${route}`);
    res = await res.json();
    if (!Array.isArray(res) || !res.length) {
        console.log(`No data found for route: ${route}`);
        return [];
    }
    return res;
}

function moveCarousel(direction, carouselId) {
    const carouselInner = document.getElementById(carouselId);
    const isPassportInput = carouselId.includes("passport") ? 1 : 0;
    const varToUse = tabToPosition[isPassportInput]

    let currentScrollPosition = 0;

    for (let i = 0; i < varToUse; i++)
        currentScrollPosition += carouselInner.children[i].clientWidth;

    const itemWidth = carouselInner.children[varToUse].clientWidth;

    let maxScrollLeft = 0;
    for (let i = 0; i < carouselInner.children.length - 1; i++)
        maxScrollLeft += carouselInner.children[i].clientWidth;

    let newScrollPosition = currentScrollPosition + (itemWidth * direction);

    tabToPosition[isPassportInput] += 1 * direction;

    if (tabToPosition[isPassportInput] >= carouselInner.children.length) {
        tabToPosition[isPassportInput] = 0;
        newScrollPosition = 0;
    }
    if (tabToPosition[isPassportInput] < 0) {
        tabToPosition[isPassportInput] = carouselInner.children.length - 1;
        newScrollPosition = maxScrollLeft;
    }

    carouselInner.style.transform = `translateX(${-newScrollPosition}px)`;
}

function submitImages() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectedFunction,
            args: [tabToPosition]  // Pass the current positions of the carousels
        });
    });
}

function injectedFunction(tabToPosition) {
    async function getDataFromRouteAtIndex(route, index) {
        let res = await fetch(`http://62.72.19.90:3000/${route}`);
        res = await res.json();
        if (!Array.isArray(res) || !res?.length) {
            console.log("Not Array");
            return;
        }
        const data = res[index];
        if (!data?.url) {
            console.log("No URL");
            return;
        }
        return data;
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

        const data = await getDataFromRouteAtIndex("id_cards", tabToPosition[0]);
        if (!data) return;
        const file = await getFileFromData(data);
        triggerOnChangeForInput(file, ID_CardFileInput);
    }

    async function fillPassPort() {
        const ID_CardFileInput = document.querySelector('input[id="passport"]');
        if (!ID_CardFileInput) {
            console.error('No file input found');
            return;
        }

        const data = await getDataFromRouteAtIndex("passports", tabToPosition[1]);
        if (!data) return;
        const file = await getFileFromData(data);
        triggerOnChangeForInput(file, ID_CardFileInput);
    }

    fillIdCard();
    fillPassPort();
}