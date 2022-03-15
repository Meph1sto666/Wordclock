/**
 * Wordclock
 * 
 * © Meph1sto666 2022.3
 * 
 * You are free to do anything with the code as long you give credits to me.
 * 
 * V.1.0.2
 *
 * Changes: 
 *  - added options to change clock size (x, y), scale and updated auto size algorythm
 */

// ===SETTINGS===
var settings = {
    PROPERTY_LISTENER: {
        LANG: [
            "english",
            "german"
        ],
        FONTS: [
            "ShayMan",
            "vultures",
            "Orbitron",
            "New Alphabet Two",
            "Blanka Regular",
            "ELIXIA",
            "marske",
            "UFONEST400",
            "wormbox",
            "sacredGeometry",
            "Elianto",
            "xirod",
            "Library 3am",
            "Courier",
            "Algerian",
            "Consolas"
        ]
    },
    
    LANG: "english",
    TIME_FORMAT: 24,
    SHOW_MINUTES: true,
    
    AUTO_SIZE: true,
    COLORED_WORDS: true,
    RANDOM_COLOR: false,
    RANDOM_LETTER_COLOR: false,
    RANDOM_MINUTES_COLOR: false,
    INACTIVE_HOVER_ANIMATION: true,
    RANDOM_COLOR_BRIGHTNESS_MIN: 0,
    RANDOM_COLOR_BRIGHTNESS_MAX: 256,
    STYLE: {
        BACKGROUND_COLOR: "#0A0D0F",
        INACTIVE_COLOR: "#0A0A0A",
        ACTIVE_COLOR: "#00FFFF",
        
        MINUTES: {
            LINE_LENGTH: 64,
            LINE_WIDTH: 8,
            LINE_COLOR_0: "#FF00FF",
            LINE_COLOR_1: "#00FFFF",
            GRADIENT: true
        },
        
        VISUALIZE_COLOR_0: "#00FFFF",
        VISUALIZE_COLOR_1: "#FF00FF",
        
        SCALE: 1,
        OFFSET_X: 0,
        OFFSET_Y: 0,
        SPANN_ACROSS_SCREEN: false,
        FONT_SIZE_CHANGE: 0
    },
    AUDIO_VISUALIZING: false,
    AUDIO_SMOOTH: 0.5,
    AUDIO_MULTIPLIER: 2,
    INVERT_AUDIO_SPECTRUM: false,
    ONLY_ACTIVATED_AUDIO: true
}


// ===LIVELY LISTENERS===
function livelyPropertyListener(name, val) {
    switch(name) {
        
        case "language": settings.LANG = settings.PROPERTY_LISTENER.LANG[val]; break;
        case "reload": /* reload(); */ break;
        
        // style
        case "bgColor":
            settings.BACKGROUND_COLOR = val;
            setStyle("--backgroundColor", settings.BACKGROUND_COLOR);
            break;
        case "activeColor":
            settings.STYLE.ACTIVE_COLOR = val;
            setStyle("--activeColor", settings.STYLE.ACTIVE_COLOR);
            break;
        case "inactiveColor":
            settings.STYLE.INACTIVE_COLOR = val;
            setStyle("--inactiveColor", settings.STYLE.INACTIVE_COLOR);
            break;
        case "inactiveHoverColor": setStyle("--inactiveHoverColor", val); break;
        case "letterSpacingX": setStyle("--letterBoxWidth", `${val}px`); break;
        case "letterSpacingY": setStyle("--letterBoxHeight", `${val}px`); break;
        
        case "coloredWords": settings.COLORED_WORDS = val; break;
        case "randomColor": settings.RANDOM_COLOR = val; break;
        case "randomLetterColor": settings.RANDOM_LETTER_COLOR = val; break;
        case "randomColorBrightnessMin": settings.RANDOM_COLOR_BRIGHTNESS_MIN = val; break;
        case "randomColorBrightnessMax": settings.RANDOM_COLOR_BRIGHTNESS_MAX = val; break;
        
        case "autoClockSize": settings.AUTO_SIZE = val; break;
        case "spanOverScreen": settings.STYLE.SPANN_ACROSS_SCREEN = val; break;
        case "offsetX": setStyle("--offsetX", `${val - 50}%`); break;
        case "offsetY": setStyle("--offsetY", `${val - 50}%`); break;
        case "width": settings.STYLE.OFFSET_X = val; break;
        case "height": settings.STYLE.OFFSET_Y = val; break;
        case "scale": settings.STYLE.SCALE = val; break;
        
        case "hoverAni": settings.INACTIVE_HOVER_ANIMATION = val; break;
        // case "autoClockSize": autoClockSize(); break;
        case "activeHueRotation": setStyle("--activeHueRotation", val + "deg"); break;
        
        // fonts
        case "fontFamily": setStyle("--fontFamily", settings.PROPERTY_LISTENER.FONTS[val]); break;
        case "fontSize": settings.STYLE.FONT_SIZE_CHANGE = val; break;
        
        // minutes
        case "showMinutes": settings.SHOW_MINUTES = val; break;
        case "minutesLineLength": settings.STYLE.MINUTES.LINE_LENGTH = val; break;
        case "minutesLineWidth": settings.STYLE.MINUTES.LINE_WIDTH = val; break;
        case "minutesColorGradient": settings.STYLE.MINUTES.GRADIENT = val; break;
        case "minutesColor0": settings.STYLE.MINUTES.LINE_COLOR_0 = val; break;
        case "minutesColor1": settings.STYLE.MINUTES.LINE_COLOR_1 = val; break;
        
        // audio visualizing
        case "audioVisualizing": settings.AUDIO_VISUALIZING = val; break;
        case "audioSmooth": settings.AUDIO_SMOOTH = val; break;
        case "audioMultiplier": settings.AUDIO_MULTIPLIER = val; break;
        case "audioColor0": settings.STYLE.VISUALIZE_COLOR_0 = val; break;
        case "audioColor1": settings.STYLE.VISUALIZE_COLOR_1 = val; break;
        case "invertAudioSpectrum": settings.INVERT_AUDIO_SPECTRUM = val; break;
        case "onlyActivatedAudio": settings.ONLY_ACTIVATED_AUDIO = val; break;
    }
    reload();
}
function livelyAudioListener(audioArray) {
    if (settings.INVERT_AUDIO_SPECTRUM) audioArray = audioArray.reverse();
    if (settings.AUDIO_VISUALIZING) updateColors(audioColors(audioArray));
}

function setUp() {
    lang = setLang(settings);
    generateClockWords();
    setInterval(flashTime, 1000);
    if (settings.AUTO_SIZE) autoClockSize();
}
function generateClockWords() {
    var words = lang.WORDS;
    for (var i = 0; i < words.length; i++) {
        for (var letter of words[i]) {
            var l = document.createElement("input");
            l.type = "button";
            l.className = "letter " + i;
            l.value = letter;
            l.disabled = true;
            l.classList.add("inactive");
            for (var k of lang.SPECIAL_LETTERS) {
                // if (i == k) l.className = "letter " + (i - 1) + " " + i + " " + (i + 1);
                if (i == k) l.className = `letter ${i - 1} ${i} ${i + 1}`;
            }
            document.getElementById("clockContainer").appendChild(l);
        }
        generateColorField(i);
    }
}
function setLang(settings) {
    let r = document.querySelector(':root');
    if (settings.LANG == "german") {
        r.style.setProperty("--lettersHorizontal", 11);
        r.style.setProperty("--lettersVertical", 10);
        r.style.setProperty("--letterBoxHeight", "86px");//86
        r.style.setProperty("--letterBoxWidth", "77px");//77
        var lang = {
            WORDS: [
                "ES", "K", "IST", "A", "FÜNF",
                "ZEHN", "ZWANZIG",
                "DREI", "VIERTEL",
                "VOR", "FUNK", "NACH",
                "HALB", "A", "EL", "F", "ÜNF",
                "EIN", "S", "X", "AM", "ZWEI",
                "DREI", "PM", "J", "VIER",
                "SECH", "S", "NL", "ACHT",
                "SIEBEN", "ZWÖLF",
                "ZEH", "N", "EUN", "K", "UHR"//30
            ],
            SPECIAL_LETTERS: [33, 15],
            IT: 0,
            IS: 2,
            FIVE0: 4,
            TEN0: 5,
            TWENTY: 6,
            QUARTER: 8,
            BEFORE: 9,
            PAST: 11,
            HALF: 12,
            AM: 20,
            PM: 23,
            CLOCK: 36,
            
            ONE: 17,
            ONE_S: 18,
            TWO: 21,
            THREE: 22,
            FOUR: 25,
            FIVE1: 16,
            SIX: 26,
            SIX_S: 27,
            SEVEN: 30,
            EIGHT: 29,
            NINE: 34,
            TEN1: 32,
            ELEVEN: 14,
            TWELVE: 31
        }
    }
    else if (settings.LANG == "english") {
        r.style.setProperty("--lettersHorizontal", 13);
        r.style.setProperty("--lettersVertical", 8);
        r.style.setProperty("--letterBoxHeight", "110px");//110
        r.style.setProperty("--letterBoxWidth", "80px");//80
        var lang = {
            WORDS: [
                "IT", "I", "IS", "L", "TEN", "HALF",
                "QUARTER", "TWENTY",
                "FIVE", "O", "MINUTES", "V",
                "PAST", "TO", "E", "ONE", "TWO",
                "THREE", "FOUR", "FIVE",
                "SIX", "SEVEN", "EIGHT",
                "NINE", "TEN", "ELEVEN",
                "TWELVE", "U", "OCLOCK"
            ],
            SPECIAL_LETTERS: [],
            IT: 0,
            IS: 2,
            TEN0: 4,
            HALF: 5,
            QUARTER: 6,
            TWENTY: 7,
            FIVE0: 8,
            MINUTES: 10,
            PAST: 12,
            BEFORE: 13,
            CLOCK: 28,
            
            ONE: 15,
            TWO: 16,
            THREE: 17,
            FOUR: 18,
            FIVE1: 19,
            SIX: 20,
            SEVEN: 21,
            EIGHT: 22,
            NINE: 23,
            TEN1: 24,
            ELEVEN: 25,
            TWELVE: 26
        }
    }
    let colorArr = generateColorField();
    return lang;
}
function killClock() {
    const elements = document.getElementsByClassName("letter");
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function reload() {
    lang = setLang(settings);
    killClock();
    generateClockWords();
    flashTime();
    if (settings.AUTO_SIZE) autoClockSize();
}


// ===STYLEING===
function autoClockSize() {
    let lettersHorizontal = getStyle("--lettersHorizontal");
    let lettersVertical = getStyle("--lettersVertical");
    let correctionX = 0;
    let correctionY = 0;
    let height = Math.floor(screen.height / parseInt(lettersVertical.replace("px", "")) + correctionY) * settings.STYLE.SCALE;
    if (settings.STYLE.SPANN_ACROSS_SCREEN) width = Math.floor(screen.width / parseInt(lettersHorizontal.replace("px", "")) + correctionX) * settings.STYLE.SCALE;
    else width = Math.floor(screen.height / parseInt(lettersHorizontal.replace("px", "")) + correctionX) * settings.STYLE.SCALE;
    setStyle("--letterBoxWidth", width + settings.STYLE.OFFSET_X + "px");
    setStyle("--letterBoxHeight", height + settings.STYLE.OFFSET_Y + "px");
    
    if (settings.LANG == "german") setStyle("--fontSize", height / 2 + settings.STYLE.FONT_SIZE_CHANGE + "px");
    else setStyle("--fontSize", (height / 2) + settings.STYLE.FONT_SIZE_CHANGE + "px");
}

function setStyle(cssVar, value) {
    var r = document.querySelector(':root').style.setProperty(cssVar, value);
}
function getStyle(cssVar) {
    return document.querySelector(':root').style.getPropertyValue(cssVar);
}

var colorArr = [];
function generateColorField(id) {
    let color = randomColor(settings.RANDOM_COLOR_BRIGHTNESS_MIN, settings.RANDOM_COLOR_BRIGHTNESS_MAX);
    let bgColor = settings.STYLE.BACKGROUND_COLOR;
    // let c0Dif = Math.abs(parseInt(bgColor.slice(1, 2), 16) - parseInt(color.slice(1, 2), 16));
    // let c1Dif = Math.abs(parseInt(bgColor.slice(3, 4), 16) - parseInt(color.slice(3, 4), 16));
    // let c2Dif = Math.abs(parseInt(bgColor.slice(5, 6), 16) - parseInt(color.slice(5, 6), 16));
    let le = document.getElementsByClassName(id);
    for (var o of le) {
        colorArr.push(color);
    }
    return colorArr;
}
function randomColor(min, max) {
    let hexR = Math.floor(Math.random() * (max - min) + min).toString(16);
    let hexG = Math.floor(Math.random() * (max - min) + min).toString(16);
    let hexB = Math.floor(Math.random() * (max - min) + min).toString(16);    
    // if (hex0 < 2) hex0 = 0 + hex0;
    // if (hex1 < 2) hex1 = 0 + hex1;
    // if (hex2 < 2) hex2 = 0 + hex2;
    hexR.padStart(2, 0);
    hexG.padStart(2, 0);
    hexB.padStart(2, 0);
    return `#${hexR}${hexG}${hexB}`;
}

function audioColors(audioArray) {
    let audioColorArray = [];
    audioArray = smoothOut(audioArray, settings.AUDIO_SMOOTH);
    for (var i = 1; i < audioArray.length; i++) {
        let f = audioArray[i] * settings.AUDIO_MULTIPLIER;
        if (f > 1) f = 1;
        if (f < 0) f = 0;
        audioColorArray.push(interpolateColor(settings.STYLE.VISUALIZE_COLOR_0, settings.STYLE.VISUALIZE_COLOR_1, f));
    }
    return audioColorArray;
}

function avg (v) {
  return v.reduce((a, b) => a + b, 0) / v.length;
}
function smoothOut (vector, variance) {
    var tAvg = avg(vector) * variance;
    var ret = Array(vector.length);
    for (var i = 0; i < vector.length; i++) {(
        function () {
            var prev = i>0 ? ret[i-1] : vector[i];
            var next = i<vector.length ? vector[i] : vector[i-1];
            ret[i] = avg([tAvg, prev, vector[i], next]);
        })();
    }
    return ret;
}

function interpolateColor(color0, color1, f) {
    color0 = color0.slice(1).match(/.{1,2}/g);
    color1 = color1.slice(1).match(/.{1,2}/g);    
    let r = Math.round(parseInt(color0[0], 16) + (parseInt(color1[0], 16) - parseInt(color0[0], 16)) * f);
    let g = Math.round(parseInt(color0[1], 16) + (parseInt(color1[1], 16) - parseInt(color0[1], 16)) * f);
    let b = Math.round(parseInt(color0[2], 16) + (parseInt(color1[2], 16) - parseInt(color0[2], 16)) * f);
    return `#${Number(r).toString(16).padStart(2, 0)}${Number(g).toString(16).padStart(2, 0)}${Number(b).toString(16).padStart(2, 0)}`;
}
function updateColors(audioColorArray) {
    activeElements = document.getElementsByClassName("active");
    if (settings.ONLY_ACTIVATED_AUDIO) cLength = activeElements.length;
    else cLength = document.getElementsByClassName("letter").length;
    let c = 0;
    let cStepps = Math.floor(audioColorArray.length / cLength);
    // document.getElementById("debug").value = `${audioColorArray.length} | ${cLength} | ${cStepps}`;
    for (var i = 0; i < activeElements.length; i++) {
        activeElements[i].style.color = audioColorArray[c];
        c += cStepps;
    }
}


// ===TIME===
function flashTime() {
    var time = new Date();
    var timeArr = [
        time.getHours(),
        time.getMinutes()
    ];
    activateWords(convertTimeToWordId(timeArr));
}

function isBeforeHalf(timeArr, lang) {
    if (lang == "english" && timeArr[1] < 35) return true;
    if (lang == "german" && timeArr[1] < 30) return true;
    return false;
}
function activateWords(ids) {
    let activeElements = [];
    for (var id of ids) {
        if (settings.RANDOM_COLOR || settings.COLORED_WORDS) randColor = randomColor(settings.RANDOM_COLOR_BRIGHTNESS_MIN, settings.RANDOM_COLOR_BRIGHTNESS_MAX);
        for (var element of document.getElementsByClassName(id)) {
            if (!settings.AUDIO_VISUALIZING) {
                if (settings.RANDOM_LETTER_COLOR) {
                    element.style.color = randomColor(settings.RANDOM_COLOR_BRIGHTNESS_MIN, settings.RANDOM_COLOR_BRIGHTNESS_MAX);
                    element.classList.remove("colorSet");
                } else if (settings.RANDOM_COLOR) {
                    element.style.color = randColor;
                    element.classList.remove("colorSet");
                } else if (settings.COLORED_WORDS) {
                    if (!element.classList.contains("colorSet")) element.style.color = randColor;
                    element.classList.add("colorSet");
                } else element.style.color = settings.STYLE.ACTIVE_COLOR;
            }
            element.disabled = false;
            element.classList.remove("inactive");
            element.classList.add("active");
            activeElements.push(element);
        }
    }
    deactivateWords(activeElements);
}
function deactivateWords(ignoreIds) {
    for (var e of document.getElementsByClassName("letter")) {
        if (ignoreIds.includes(e)) continue;
        if (!settings.INACTIVE_HOVER_ANIMATION) {
            e.style.color = settings.STYLE.INACTIVE_COLOR;
            e.disabled = true;
        }
        else {
            e.disabled = false;
            e.style.color = "";
        }
        if (e.classList.contains("inactive")) continue;
        e.classList.remove("colorSet");
        e.classList.remove("active");
        e.classList.add("inactive");
        e.style.color = "";
    }
}

function drawMinute(minutes, seconds) {
    let canvas = document.getElementById("minutes");
    let ctx = canvas.getContext("2d");
    let correctionX = 0;
    let correctionY = 0;
    let lettersHorizontal = getStyle("--lettersHorizontal");
    let lettersVertical = getStyle("--lettersVertical");
    
    let height = Math.floor(screen.height / parseInt(lettersVertical.replace("px", "")) + correctionX);
    if (settings.STYLE.SPANN_ACROSS_SCREEN) width = Math.floor(screen.width / parseInt(lettersHorizontal.replace("px", "")) + correctionY) * parseInt(lettersHorizontal.replace("px", ""));
    else width = Math.floor(screen.height / parseInt(lettersHorizontal.replace("px", "")) + correctionY);
    
    width = (width * settings.STYLE.SCALE + settings.STYLE.OFFSET_X) * parseInt(lettersHorizontal.replace("px", ""));
    height = (height * settings.STYLE.SCALE + settings.STYLE.OFFSET_Y) * parseInt(lettersVertical.replace("px", ""));
    
    canvas.height = height;
    canvas.width = width;
    // style = getComputedStyle(document.querySelector("#minutes"));
    if (settings.STYLE.MINUTES.GRADIENT) {
        grd = ctx.createLinearGradient(0,0, canvas.width, canvas.height);
        grd.addColorStop(0, settings.STYLE.MINUTES.LINE_COLOR_0);
        grd.addColorStop(1, settings.STYLE.MINUTES.LINE_COLOR_1);
        ctx.strokeStyle = grd;
    } else ctx.strokeStyle = settings.STYLE.MINUTES.LINE_COLOR_0;
    let strokeLength = settings.STYLE.MINUTES.LINE_LENGTH;
    ctx.lineWidth = settings.STYLE.MINUTES.LINE_WIDTH;
    if (minutes > 0) {
        ctx.moveTo(canvas.width - strokeLength, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, strokeLength);
    } if (minutes > 1) {
        ctx.moveTo(canvas.width, canvas.height - strokeLength);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width - strokeLength, canvas.height);
    } if (minutes > 2) {
        ctx.moveTo(strokeLength, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - strokeLength);
    } if (minutes > 3) {
        ctx.moveTo(0, strokeLength);
        ctx.lineTo(0, 0);
        ctx.lineTo(strokeLength, 0);
    }
    /*
    if (minutes > 0) {
        ctx.moveTo(canvas.width - radius - correction, radius + correction);
        ctx.arc(canvas.width - radius - correction, radius + correction, radius, 0, -Math.PI / 2, true)
    }
    if (minutes > 1) {
        ctx.moveTo(canvas.width - radius - correction, canvas.height - radius - correction);
        ctx.arc(canvas.width - radius - correction, canvas.height - radius - correction, radius, 0, Math.PI / 2, false)
    }
    if (minutes > 2) {
        ctx.moveTo(radius + correction, canvas.height - radius - correction);
        ctx.arc(radius + correction, canvas.height - radius - correction, radius, Math.PI, Math.PI / 2, true)
    }
    if (minutes > 3) {
        ctx.moveTo(radius + correction, radius + correction);
        ctx.arc(radius + correction, radius + correction, radius, Math.PI, Math.PI + Math.PI / 2, false)
    }
    */
    if (minutes > 4 || minutes == 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
    else ctx.stroke();
}

function convertTimeToWordId(timeArr) {
    let ids0 = [];
    let ids1 = [];
    let ids = [];
    let prefIds = [];
    if (!isBeforeHalf(timeArr, settings.LANG)) timeArr[0]++;
    if (settings.LANG == "german") {
        prefIds = [lang.IT, lang.IS];
        switch (timeArr[0]) {
            case 0: ids0 = [lang.TWELVE, lang.CLOCK]; break;
            case 1:
            case 13: ids0 = [lang.ONE, lang.CLOCK]; break;
            case 2:
            case 14: ids0 = [lang.TWO, lang.CLOCK]; break;
            case 3:
            case 15: ids0 = [lang.THREE, lang.CLOCK]; break;
            case 4:
            case 16: ids0 = [lang.FOUR, lang.CLOCK]; break;
            case 5:
            case 17: ids0 = [lang.FIVE1, lang.CLOCK]; break;
            case 6:
            case 18: ids0 = [lang.SIX, lang.SIX_S, lang.CLOCK]; break;
            case 7:
            case 19: ids0 = [lang.SEVEN, lang.CLOCK]; break;
            case 8:
            case 20: ids0 = [lang.EIGHT, lang.CLOCK]; break;
            case 9:
            case 21: ids0 = [lang.NINE, lang.CLOCK]; break;
            case 10:
            case 22: ids0 = [lang.TEN1, lang.CLOCK]; break;
            case 11:
            case 23: ids0 = [lang.ELEVEN, lang.CLOCK]; break;
            case 12:
            case 24: ids0 = [lang.TWELVE, lang.CLOCK]; break;
        }
        if (timeArr[1] < 5) ids1 = [];
        else if (timeArr[1] < 10) ids1 = [lang.FIVE0, lang.PAST];
        else if (timeArr[1] < 15) ids1 = [lang.TEN0, lang.PAST];
        else if (timeArr[1] < 20) ids1 = [lang.QUARTER, lang.PAST];
        else if (timeArr[1] < 25) ids1 = [lang.TWENTY, lang.PAST];
        else if (timeArr[1] < 30) ids1 = [lang.FIVE0, lang.BEFORE, lang.HALF];
        else if (timeArr[1] < 35) ids1 = [lang.HALF];
        else if (timeArr[1] < 40) ids1 = [lang.FIVE0, lang.PAST, lang.HALF];
        else if (timeArr[1] < 45) ids1 = [lang.TWENTY, lang.BEFORE];
        else if (timeArr[1] < 50) ids1 = [lang.QUARTER, lang.BEFORE];
        else if (timeArr[1] < 55) ids1 = [lang.TEN0, lang.BEFORE];
        else if (timeArr[1] >= 55) ids1 = [lang.FIVE0, lang.BEFORE];
        if (timeArr[1] > 4) ids0.pop();
        if ((timeArr[0] == 1 && timeArr[1] > 4) || (timeArr[0] == 13 && timeArr[1] > 4)) ids1.push(lang.ONE_S);
        if (settings.TIME_FORMAT == 12) {
            if (timeArr[0] >= 12) prefIds.push(lang.PM);
            else prefIds.push(lang.AM);
        }
    }
    if (settings.LANG == "english") {
        prefIds = [lang.IT, lang.IS];
        switch (timeArr[0]) {
            case 0: ids0 = [lang.TWELVE, lang.CLOCK]; break;
            case 1:
            case 13: ids0 = [lang.ONE, lang.CLOCK]; break;
            case 2:
            case 14: ids0 = [lang.TWO, lang.CLOCK]; break;
            case 3:
            case 15: ids0 = [lang.THREE, lang.CLOCK]; break;
            case 4:
            case 16: ids0 = [lang.FOUR, lang.CLOCK]; break;
            case 5:
            case 17: ids0 = [lang.FIVE1, lang.CLOCK]; break;
            case 6:
            case 18: ids0 = [lang.SIX, lang.SIX_S, lang.CLOCK]; break;
            case 7:
            case 19: ids0 = [lang.SEVEN, lang.CLOCK]; break;
            case 8:
            case 20: ids0 = [lang.EIGHT, lang.CLOCK]; break;
            case 9:
            case 21: ids0 = [lang.NINE, lang.CLOCK]; break;
            case 10:
            case 22: ids0 = [lang.TEN1, lang.CLOCK]; break;
            case 11:
            case 23: ids0 = [lang.ELEVEN, lang.CLOCK]; break;
            case 12:
            case 24: ids0 = [lang.TWELVE, lang.CLOCK]; break;
        }
        if (timeArr[1] < 5) ids1 = [];
        else if (timeArr[1] < 10) ids1 = [lang.FIVE0, lang.MINUTES, lang.PAST];
        else if (timeArr[1] < 15) ids1 = [lang.TEN0, lang.MINUTES, lang.PAST];
        else if (timeArr[1] < 20) ids1 = [lang.QUARTER, lang.PAST];
        else if (timeArr[1] < 25) ids1 = [lang.TWENTY, lang.MINUTES, lang.PAST];
        else if (timeArr[1] < 30) ids1 = [lang.TWENTY, lang.FIVE0, lang.MINUTES, lang.PAST];
        else if (timeArr[1] < 35) ids1 = [lang.HALF, lang.PAST];
        else if (timeArr[1] < 40) ids1 = [lang.TWENTY, lang.FIVE0, lang.BEFORE, lang.MINUTES];
        else if (timeArr[1] < 45) ids1 = [lang.TWENTY, lang.MINUTES, lang.BEFORE];
        else if (timeArr[1] < 50) ids1 = [lang.QUARTER, lang.BEFORE];
        else if (timeArr[1] < 55) ids1 = [lang.TEN0, lang.MINUTES, lang.BEFORE];
        else if (timeArr[1] >= 55) ids1 = [lang.FIVE0, lang.MINUTES, lang.BEFORE];
        if (timeArr[1] > 4) ids0.pop();
    }
    for (var id of prefIds) {
        ids.push(id);
    }
    for (var id of ids0) {
        ids.push(id);
    }
    for (var id of ids1) {
        ids.push(id);
    }
    
    if (settings.SHOW_MINUTES) {
        if (timeArr[1].toString().length > 1) minutes = parseInt(timeArr[1].toString().slice(1));
        else minutes = timeArr[1];
        switch (minutes) {
            case 5: minutes = 0; break;
            case 6: minutes = 1; break;
            case 7: minutes = 2; break;
            case 8: minutes = 3; break;
            case 9: minutes = 4; break;
        }
        drawMinute(minutes);
    } else drawMinute(0);
    return ids;
}