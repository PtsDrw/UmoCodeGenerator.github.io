const gamePromoConfigs = {
    MyCloneArmy: {
        appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
        promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
        eventsDelay: 120000
    },
    ChainCube2048: {
        appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
        promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
        eventsDelay: 20000
    },
    TrainMiner: {
        appToken: '82647f43-3f87-402d-88dd-09a90025313f',
        promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
        eventsDelay: 120000
    },
    BikeRide3D: {
        appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
        promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
        eventsDelay: 20000
    },
    MergeAway: {
        appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
        promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
        eventsDelay: 20000
    },
    TwerkRace: {
        appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
        promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
        eventsDelay: 20000
    },
};


document.getElementById('startBtn').addEventListener('click',
    async () => {
        const startBtn = document.getElementById('startBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const keyContainer = document.getElementById('keyContainer');
        const generatedKeys = document.getElementById('generatedKeys');
        const keyCount = parseInt(document.getElementById('keyCountSelect').value);
        const gameId = parseInt(document.getElementById('gameSelect').value);
        const gameSelect = document.getElementById('gameSelect');
        const selectedGame = gameSelect.value;

        currentAppConfig = gamePromoConfigs[selectedGame];

        // Reset UI for new generation
        progressBar.style.width = '0%';
        progressText.innerText = 'генерация... ожидайте';
        progressContainer.classList.remove('hidden');
        keyContainer.classList.add('hidden');
        generatedKeys.innerText = '';

        startBtn.disabled = true;

        let progress = 0;
        const updateProgress = (increment) => {
            progress += increment;
            progressBar.style.width = `${progress}%`;
            // progressText.innerText = `${progress}%`;
        };

        const generateKeyProcess = async () => {
            const clientId = generateClientId();
            let clientToken;
            try {
                clientToken = await login(clientId);
            } catch (error) {
                alert(`Login failed: ${error.message}`);
                startBtn.disabled = false;
                return;
            }

            for (let i = 0; i < 10; i++) {
                await sleep(currentAppConfig.eventsDelay * delayRandom());
                const hasCode = await emulateProgress(clientToken);
                updateProgress(10 / keyCount); // Update progress incrementally
                if (hasCode) {
                    break;
                }
            }

            try {
                const key = await generateKey(clientToken);
                progressBar.style.width = `${progress}%`;
                progressText.innerText = 'Готово!';
                return key;
            } catch (error) {
                alert(`Key generation failed: ${error.message}`);
                return null;
            }
        };

        const keys = await Promise.all(Array.from({length: keyCount}, generateKeyProcess));

        generatedKeys.innerText = keys.filter(key => key).join('\n');
        keyContainer.classList.remove('hidden');

        startBtn.disabled = false;
    });

function generateClientId() {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
    return `${timestamp}-${randomNumbers}`;
}

async function login(clientId) {
    const response = await fetch('https://api.gamepromo.io/promo/login-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appToken:  currentAppConfig.appToken, clientId, clientOrigin: 'deviceid' })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    return data.clientToken;
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
            eventId: crypto.randomUUID(),
            eventOrigin: 'undefined'
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to register event');
    }
    return data.hasCode;
}

async function generateKey(clientToken) {
    const response = await fetch('https://api.gamepromo.io/promo/create-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({ promoId:  currentAppConfig.promoId })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to generate key');
    }
    return data.promoCode;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayRandom() {
    return Math.random() / 3 + 1;
}
