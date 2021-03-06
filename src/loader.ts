export class LoaderTrigger {

    container: HTMLElement | null
    text: HTMLElement | null
    imagesList: HTMLCollectionOf<HTMLImageElement> | null
    numberImagesLoad: number
    numberImages: number
    rate: number
    finish: boolean

    constructor() {
        this.container = document.querySelector('#loader')
        this.text = document.querySelector('#loader > p')
        this.numberImages = 0
        this.numberImagesLoad = 0
        this.rate = 0
        this.finish = false
        this.imagesList = null
    }

    init() {
        this.imagesList = document.images
        this.numberImages = this.imagesList.length
        if (this.text)
        this.text.innerHTML = this.rate + ' %'
        setTimeout(() => {
            if ((document as any).fonts.ready) {
                this.checkLoad()
            } else {
                this.init()
            }
        }, 20);
    }

    private checkLoad() {
        this.numberImagesLoad = 0
        if(this.imagesList)
        for (let i = 0; i < this.imagesList.length; i++) {
            this.imagesList[i].complete ? this.numberImagesLoad++ : null

        }

        this.rate = this.getRate()

        if(this.text)
        this.text.innerHTML = this.rate + ' %'


        setTimeout(() => {
            this.numberImagesLoad === this.numberImages ? setTimeout(() => {
                this.finish = true
                if(this.container)
                this.container.style.display = 'none'
            }, 200) : this.checkLoad()
        }, 20)
    }

    isFinish() {
        return this.finish
    }

    private getRate() {
        return Math.round(100 * this.numberImagesLoad / this.numberImages)
    }

}