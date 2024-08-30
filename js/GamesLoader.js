const adconfig = {
    0: {
        name: "Scroog",
        ref: "https://t.me/scroo_g_bot/miniapp?startapp=u560736783",
        pic: "img/scroog.jpg",
    },
    1: {
        name: "Clayton",
        ref: "https://t.me/claytoncoinbot/game?startapp=560736783",
        pic: "img/clayton.jpg",
    },
    2: {
        name: "Clarnium",
        ref: "https://t.me/ClarniumGame_bot/start?startapp=BVRSB4",
        pic: "img/clarnium.jpg",
    },
    3: {
        name: "Banana",
        ref: "https://t.me/OfficialBananaBot/banana?startapp=referral=FGAOMG",
        pic: "img/bananas.jpg",
    },
    4: {
        name: "Goat",
        ref: "https://t.me/realgoats_bot/run?startapp=0b3e478d-9323-42ef-b3db-2adcc2c170cd",
        pic: "img/goat.jpg",
    },
    5: {
        name: "Agent301",
        ref: "https://t.me/Agent301Bot/app?startapp=onetime560736783",
        pic: "img/agent301.jpg",
    },
    6: {
        name: "Cats",
        ref: "https://t.me/catsgang_bot/join?startapp=Cs5u43hxQPYhg8q47y7zr",
        pic: "img/cats.jpg",
    },
    7: {
        name: "Ducks",
        ref: "https://t.me/duckscoop_bot/app?startapp=EMIY50LU3e",
        pic: "img/ducks.jpg",
    },
    8: {
        name: "Duck Master",
        ref: "https://t.me/duckmaster_game_bot/DuckMaster?startapp=560736783",
        pic: "img/duckmaster.jpg",
    },
    9: {
        name: "BOOMS",
        ref: "https://t.me/booms_io_bot/start?startapp=bro560736783",
        pic: "img/booms.jpg",
    },
    10: {
        name: "AckiNacki",
        ref: "https://t.me/ackinacki_bot/ackinacki_app?startapp=eyJyZWZlcnJlciI6ImRpbW9kZWQifQ",
        pic: "img/ackinacki.jpg",
    },
    11: {
        name: "",
        ref: "",
        pic: "img/.jpg",
    },
    12: {
        name: "",
        ref: "",
        pic: "img/.jpg",
    },
}

const adimg = document.getElementById('adimg');
const adlink = document.getElementById('adlink');

function AdLoad() {
    let adload = Math.floor(Math.random() * 11);
    adselect = adconfig[adload];
    adimg.src = adselect.pic;
    adlink.href = adselect.ref;

    setTimeout(AdLoad, 20000);
}
window.onload = AdLoad;