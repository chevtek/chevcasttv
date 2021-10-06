"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudio = exports.initialize = exports.englishVoices = void 0;
var text_to_speech_1 = require("@google-cloud/text-to-speech");
var config_1 = __importDefault(require("config"));
var logger_1 = __importDefault(require("../logger"));
var log = logger_1.default.extend("GOOGLE_TTS_CLIENT");
var GOOGLE_API_KEY = config_1.default.GOOGLE_API_KEY;
var googleTTSClient = new text_to_speech_1.TextToSpeechClient({ credentials: JSON.parse(GOOGLE_API_KEY) });
exports.englishVoices = [];
var initialize = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, voices;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log("Initializing Google text to speech client...");
                return [4 /*yield*/, googleTTSClient.listVoices()];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), voices = _a[0].voices;
                if (!voices || voices.length === 0)
                    throw new Error("Problem retrieving available Google TTS voices.");
                exports.englishVoices.push.apply(exports.englishVoices, __spreadArray([], __read(voices
                    .filter(function (voice) { var _a; return ((_a = voice.languageCodes) === null || _a === void 0 ? void 0 : _a[0].match(/^en-/)) && typeof voice.name === "string"; })
                    .map(function (voice) { return voice.name; })), false));
                exports.englishVoices.sort();
                log("Google text to speech client ready.");
                return [2 /*return*/];
        }
    });
}); };
exports.initialize = initialize;
var createAudio = function (text, voice) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, audioContent;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log("Creating audio with for \"" + text + "\"...");
                return [4 /*yield*/, googleTTSClient.synthesizeSpeech({
                        input: { text: text },
                        voice: { name: voice, languageCode: "en-US" },
                        audioConfig: { audioEncoding: "MP3" }
                    })];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), audioContent = _a[0].audioContent;
                log("Audio content generated using voice " + voice + ".");
                return [2 /*return*/, audioContent];
        }
    });
}); };
exports.createAudio = createAudio;