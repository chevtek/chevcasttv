import emojiRegex from "emoji-regex";
import { playAudio } from "./api-clients/discordClient";
import { createAudio, englishVoices } from "./api-clients/googleTTSClient";
import { listen, listen as restreamListen } from "./api-clients/restreamClient";
import logger from "./logger";
import config from "config";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

const {
  CONTEXT_TIMEOUT
} = config;

type Options = {
  discordChannelIds: string[];
};

export default class Chatbot {

  private userVoices: Record<string, string> = {
    "chevcast": "en-US-Wavenet-I",
    "chev": "en-US-Wavenet-I",
    "alex ford": "en-US-Wavenet-I",
    "alopex_art": "en-GB-Standard-A",
    "codemanis": "en-AU-Standard-B",
    "ember_stone": "en-US-Wavenet-H",
    "dollzie": "en-US-Wavenet-F",
    "noobpieces": "en-IN-Wavenet-D"
  };

  private availableVoices: string[] = [];
  private currentUser?: string;
  private discordChannelIds: string[];
  private log: debug.Debugger;
  private ttsQueue: { username: string, message: string }[] = [];
  private voiceContextTimeout?: NodeJS.Timeout;
  private queueInProgress = false;

  constructor(options: Options) {
    const { discordChannelIds } = options;
    this.discordChannelIds = discordChannelIds;
    this.log = logger.extend("CHATBOT");
  }

  async initialize() {
    this.log("Listening to restream chat...");
    const listeners: Promise<() => void>[] = [];
    await listen((username, message) => {
      if (message.match(/^\s*$/)) return;
      if (message.match(/^[a-zA-Z][a-zA-Z][a-zA-Z]?[a-zA-Z]?[ \.][ \.]?[a-zA-Z][a-zA-Z][a-zA-Z]?[a-zA-Z]?$/g)) return;
      this.queueMessage(username, message);
    });
    await Promise.all(listeners);
    this.log("Chevbot online.");
    const audioContent = await readFile("./media/chevbot-online.wav");
    await this.sendTTS(audioContent);
  }

  async sendTTS(audioContent: Buffer) {
    return Promise.all(this.discordChannelIds.map(channelId => playAudio(channelId, audioContent)));
  }

  fillAvailableVoices() {
    this.log("Filling available voices...");
    this.availableVoices = [...englishVoices.filter(voice =>
      !Object.values(this.userVoices).includes(voice.toLowerCase()))];

    // Shuffle voices to ensure variety.
    let currentIndex = this.availableVoices.length;
    let randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [
        this.availableVoices[currentIndex],
        this.availableVoices[randomIndex]
      ] = [
        this.availableVoices[randomIndex],
        this.availableVoices[currentIndex]
      ];
    }
    this.log(`${this.availableVoices.length} voices available.`);
  }

  queueMessage(username: string, message: string) {
    const blackList = ["streamelements", "soundalerts", "pretzelrocks"];
    if (blackList.includes(username.toLowerCase())) return;
    if (message.startsWith("!")) return;
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    message = message.replace(urlRegex, "");
    this.ttsQueue.unshift({ username, message });
    this.processQueue();
  }

  async processQueue() {
    if (this.queueInProgress) return;
    this.queueInProgress = true;
    while (this.ttsQueue.length > 0) {
      const { username, message } = this.ttsQueue.pop()!;
      let voice: string | undefined = this.userVoices[username.toLowerCase()];
      if (!voice) {
        voice = this.userVoices[username.toLowerCase()] = this.availableVoices.pop()!;
        if (this.availableVoices.length === 0) {
          this.fillAvailableVoices();
        }
      }
      const ttsMessage = username === this.currentUser || message.startsWith("ALEXA")
        ? message : `${this.enunciateUsername(username)} says ${message}`;
      const audioContent = await createAudio(ttsMessage, voice);
      await this.sendTTS(audioContent);
      this.currentUser = username;
      if (this.voiceContextTimeout) clearTimeout(this.voiceContextTimeout);
      this.voiceContextTimeout = setTimeout(() => this.currentUser = undefined, parseInt(CONTEXT_TIMEOUT) * 1000);
    }
    this.queueInProgress = false;
  }

  cleanUsername(username: string) {
    return username.replace(/(\d+|[_-])/g, " ");
  }

  enunciateUsername(username: string) {
    username = this.cleanUsername(username);
    return username;
  }

}