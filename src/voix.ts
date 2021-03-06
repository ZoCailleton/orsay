import text from './text.json'

export class SlideSubtitle {

  voice: { text: string, duration: number }[];
  finish: boolean;
  numSentences: number;
  duration: number;
  step: number;
  containerSubtitle: HTMLInputElement | null
  textSubtitle: HTMLParagraphElement
  play: boolean

  constructor(slideStep: number) {
    this.voice = text[slideStep];
    this.finish = false;
    this.numSentences = 0;
    this.duration = 0;
    this.step = 0;
    this.containerSubtitle = document.querySelector<HTMLInputElement>('.subtitles--wrapper')
    this.textSubtitle = document.createElement('p')
    this.play = true
  }

  init() {
    if (this.containerSubtitle) {
      this.containerSubtitle.appendChild(this.textSubtitle)
    }
    this.step = 0
    this.play = true
    this.finish = false
    this.durationVoice()
    this.getNewSentence(this.play)
    this.textSubtitle.classList.remove('hidden')
  }

  private getNewSentence(play: boolean) {
    this.textSubtitle.innerHTML = this.voice[this.step].text
    const duration = play ? this.voice[this.step].duration * 1000 : 0
    this.finish = false
    setTimeout(() => {
      if (this.voice[this.step + 1] && play === true) {
        this.step++
        this.getNewSentence(this.play)
      } else {
        this.finish = true
        this.textSubtitle.innerHTML = ''
        this.textSubtitle.classList.add('hidden')
        this.step = 0
      }
    }, duration);
  }

  private durationVoice() {
    let durationVoice = 0
    let numS = 0

    this.voice.forEach(sentence => {
      numS++
      durationVoice = durationVoice + sentence.duration
    });

    this.numSentences = numS
    this.duration = durationVoice
  }

  getDuration() {
    return this.duration * 1000
  }

  isFinish() {
    if (this.finish === true) {
      return true
    } else {
      return false
    }
  }

  stop() {
    this.play = false
    this.finish = false
    this.step = 0
    this.getNewSentence(this.play)
  }
}

export class AudioClass {
  url: string
  contexteAudio: AudioContext
  yodelBuffer: AudioBuffer | null
  source: AudioBufferSourceNode | null
  isInit: boolean
  gainNode: GainNode | null
  startInstant: boolean
  constructor(url: string, startInstant: boolean) {
    this.url = url
    this.contexteAudio = new AudioContext()
    this.yodelBuffer = null
    this.source = null
    this.isInit = false
    this.gainNode = null
    this.startInstant = startInstant || false
  }

  init() {
    this.gainNode = this.contexteAudio.createGain();
    this.gainNode.connect(this.contexteAudio.destination);

    window.fetch(this.url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.contexteAudio.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.yodelBuffer = audioBuffer
        this.isInit = true
        if (this.startInstant) this.start()
      })
  }

  start() {
    if (this.isInit === true) {
      this.source = this.contexteAudio.createBufferSource();
      this.source.buffer = this.yodelBuffer;
      if(this.gainNode)
      this.source.connect(this.gainNode)


      this.source.start();
      this.gainNode?.gain.setValueAtTime(0.01, this.contexteAudio.currentTime);

      this.gainNode?.gain.exponentialRampToValueAtTime(1, this.contexteAudio.currentTime + 0.3)

    }
  }

  stop() {
    if (this.isInit === true) {

      this.gainNode?.gain.setValueAtTime(this.gainNode.gain.value, this.contexteAudio.currentTime)

      this.gainNode?.gain.exponentialRampToValueAtTime(0.001, this.contexteAudio.currentTime + 1)

      setTimeout(
        () => this.source?.stop()
        , 2000
      )
    }
  }

}