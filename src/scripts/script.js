const lang_from_El = document.getElementById("languages-from");
const lang_to_El = document.getElementById("languages-to");
const from = document.getElementById("from");
const to = document.getElementById("to");
const cpy_from = document.querySelector(".cpy-from")
const cpy_to = document.querySelector(".cpy-to")
const from_audio = document.querySelector(".from-audio");
const to_audio = document.querySelector(".to-audio");

document.addEventListener("DOMContentLoaded", () => {
    languages("from-opt");
    languages("to-opt");
})

function languages(from_to) {
    fetch(`./src/scripts/languages.json`)
        .then((res) => res.json())
        .then(data => {
            for (key in data) {
                let value = `<option class="${from_to}" value="${data[key]}" data-lan="${key}">${data[key]}</option>`;
                if (from_to === "from-opt" && data[key] === `English`) {
                    value = `<option class="${from_to}" value="${data[key]}" data-lan="${key}" selected>${data[key]}</option>`;
                    lang_from_El.dataset.lang = key;
                }
                if (from_to === "to-opt" && data[key] === `Hindi`) {
                    value = `<option class="${from_to}" value="${data[key]}" data-lan="${key}" selected>${data[key]}</option>`;
                    lang_to_El.dataset.lang = key;
                }

                lang_from_El.innerHTML += value;
                lang_to_El.innerHTML += value;
                lang_from_El.value = "English";
                lang_to_El.value = "Hindi";
            }
        });
}
const transBtn = document.getElementById("btn-translate")
transBtn.addEventListener("click", () => {
    translate(from.value, lang_from_El.dataset.lang, lang_to_El.dataset.lang);
})

function translate(text, from, to_lang) {
    fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to_lang}`)
        .then((res) => res.json())
        .then(data => {
            to.value = data.responseData.translatedText
            if (to.value === "")
                to.value = `Translation not available`;
            console.log(data)
        });
    to.setAttribute("placeholder", "Translation...");
}

lang_to_El.addEventListener("input", () => {
    setData(lang_to_El)
})
lang_from_El.addEventListener("input", () => {
    setData(lang_from_El)
})

function setData(el) {
    fetch(`./src/scripts/languages.json`)
        .then((res) => res.json())
        .then(data => {
            for (key in data) {
                if (data[key] === el.value) {
                    el.dataset.lang = key;
                }
            }
        });
}

cpy_from.addEventListener("click", () => {
    navigator.clipboard.writeText(from.value);
})

cpy_to.addEventListener("click", () => {
    navigator.clipboard.writeText(to.value);
})

from_audio.addEventListener("click", () => {
    say(from.value, lang_from_El.value);
})
to_audio.addEventListener("click", () => {
    say(to.value, lang_to_El.value);
})

function say(m, lang) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[10];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 0.8;
    msg.text = m;
    msg.lang = lang;
    window.speechSynthesis.speak(msg);
}

const swap_lang = document.getElementById("swap");

swap_lang.addEventListener("click", () => {
    swap();
})
function swap() {
    let temp = from.value;
    from.value = to.value;
    to.value = temp;

    temp = lang_from_El.value;
    console.log(temp);
    lang_from_El.value = lang_to_El.value;
    lang_to_El.value = temp;
}