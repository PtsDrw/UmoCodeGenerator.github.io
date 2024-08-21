const defaultLanguage = document.documentElement.getAttribute('lang')
const gamePromoConfigs = {
    MyCloneArmy: {
        appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
        promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
        eventsDelay: 120000,
        attemptsNumber: 11
    },
    ChainCube2048: {
        appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
        promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
        eventsDelay: 20000,
        attemptsNumber: 10
    },
    TrainMiner: {
        appToken: '82647f43-3f87-402d-88dd-09a90025313f',
        promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
        eventsDelay: 20000,
        attemptsNumber: 10
    },
    BikeRide3D: {
        appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
        promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
        eventsDelay: 20000,
        attemptsNumber: 22
    },
    MergeAway: {
        appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
        promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
        eventsDelay: 20000,
        attemptsNumber: 10
    },
    TwerkRace: {
        appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
        promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
        eventsDelay: 20000,
        attemptsNumber: 10
    },
    PolySphere: {
        appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
        promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
        eventsDelay: 20000,
        attemptsNumber: 22
    },
};


var keygenActive = false;
let currentAppConfig = null;
const statusText = document.getElementById('statusGenText');
const statusGen = document.getElementById('statusGen');

document.getElementById('startBtn').addEventListener('click', async () => {
    const startBtn = document.getElementById('genbtn');
    const keyCountSelect = document.getElementById('keyCountSelect');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('generatedKeys');
    const keyCount = parseInt(keyCountSelect.value);
    const gameSelect = document.getElementById('gameSelect');
    const selectedGame = gameSelect.value;

    currentAppConfig = gamePromoConfigs[selectedGame];


    progressBar.style.width = '0%';
    progressText.innerText = 'идет генерация, ожидайте';
    progressContainer.classList.remove('hidden');
    statusGen.classList.remove('hidden');
    keyContainer.classList.add('hidden');
    keysList.innerHTML = '';
    startBtn.classList.add('hidden');

    let progress = 0;
    keygenActive = true;

    const updateProgress = (increment) => {
        const steps = 10;
        const stepIncrement = increment / steps;
        let step = 0;

        const increaseProgress = () => {
            if (!keygenActive) return;
            if (step < steps) {
                progress += stepIncrement;
                progressBar.style.width = `${progress}%`;
                progressText.innerText = `${Math.round(progress)}%`;
                step++;
                setTimeout(increaseProgress, 2000 / steps + Math.random() * 1000);
            }
        };

        increaseProgress();
    };

    const generateKeyProcess = async () => {
        const clientId = generateClientId();
        let clientToken;
        try {
            clientToken = await login(clientId);
        } catch (error) {
            alert(`Failed to log in: ${error.message}`);
            startBtn.disabled = false;
            return null;
        }

        for (let i = 0; i < currentAppConfig.attemptsNumber; i++) {
            await sleep(currentAppConfig.eventsDelay * delayRandom());
            const hasCode = await emulateProgress(clientToken);
            updateProgress((100 / currentAppConfig.attemptsNumber) / keyCount);
            if (hasCode) {
                break;
            }
        }

        try {
            const key = await generateKey(clientToken);
            return key;
        } catch (error) {
            alert(`Failed to generate key: ${error.message}`);
            return null;
        }
    };

    const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));

    keygenActive = false;

    progressBar.style.width = '100%';
    progressText.innerText = '100%';
    statusText.innerText = 'Забираем коды';
    generatedKeys.innerText = keys.filter(key => key).join('\n');
    keyContainer.classList.remove('hidden');
    startBtn.classList.remove('hidden');
    statusGen.classList.add('hidden');
});


function generateClientId() {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
    return `${timestamp}-${randomNumbers}`;
}

async function login(clientId) {
    statusText.innerText = 'обманываем разработчиков';
    const response = await fetch('https://api.gamepromo.io/promo/login-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appToken: currentAppConfig.appToken, clientId, clientOrigin: 'deviceid' })
    });
    const data = await response.json();
    if (!response.ok) {
        if (data.error_code == "TooManyIpRequest") {
            throw new Error('You have reached the rate limit. Please wait a few minutes and try again.');
        } else {
            throw new Error(data.error_message || 'Failed to log in');
        }

    }
    return data.clientToken;
}

function generateUUID() {
    	let random = Math.floor(Math.random() * 2000);
	if (random < 250) {
		statusText.innerText = 'выполняем конкурсы тамады';
	} else if (random < 500) {
		statusText.innerText = 'любуемся рекламой ВТБ';
	} else if (random < 750) {
		statusText.innerText = 'загадываем желание золотой рыбке';
	} else if (random < 1000) {
		statusText.innerText = 'материм разработчиков';
	} else if (random < 1250) {
		statusText.innerText = 'мечтаем о листинге';
	} else if (random < 1500) {
		statusText.innerText = 'радуемся что Вы на нас подписаны';
	} else if (random < 1750) {
		statusText.innerText = 'Просим дьявола, чтобы подготовил котел разработчикам';
	} else if (random < 2000) {
		statusText.innerText = 'Торгуем носками на рынке, т.к. с хомяка не заработать';
	}
    
    if (typeof crypto.randomUUID === 'function') {
        try {
            return crypto.randomUUID();
        } catch (error) {
            console.warn('crypto.randomUUID() failed, falling back to old method.');
        }
    }

    const cryptoObj = window.crypto || window.msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
        const bytes = new Uint8Array(16);
        cryptoObj.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return [
            bytes.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join(''),
            bytes.slice(4, 6).map(b => b.toString(16).padStart(2, '0')).join(''),
            bytes.slice(6, 8).map(b => b.toString(16).padStart(2, '0')).join(''),
            bytes.slice(8, 10).map(b => b.toString(16).padStart(2, '0')).join(''),
            bytes.slice(10).map(b => b.toString(16).padStart(2, '0')).join('')
        ].join('-');
    } else {
        console.warn('crypto.getRandomValues not supported. Falling back to a less secure method.');
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

async function emulateProgress(clientToken) {
    const response = await fetch('https://api.gamepromo.io/promo/register-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({
            promoId: currentAppConfig.promoId,
            eventId: generateUUID(),
            eventOrigin: 'undefined'
        })
    });
    const data = await response.json();
    // if (!response.ok) {
    //     throw new Error(data.error_message || 'Failed to register event');
    // }
    return data.hasCode;
}

async function generateKey(clientToken) {
    statusText.innerText = 'чешем хомяка для получения кодов';
    const response = await fetch('https://api.gamepromo.io/promo/create-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({ promoId: currentAppConfig.promoId })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error_message || 'Failed to generate key');
    }
    return data.promoCode;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayRandom() {
    return Math.random() / 3 + 1;
}
