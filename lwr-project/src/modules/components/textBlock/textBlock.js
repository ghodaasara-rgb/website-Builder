import { LightningElement, api } from 'lwc';

export default class TextBlock extends LightningElement {
    static renderMode = 'light';
    @api heading;
    _content;

    @api
    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
        this.renderHtml();
    }

    renderedCallback() {
        this.renderHtml();
    }

    renderHtml() {
        if (this._content) {
            const container = this.querySelector('.text-content');
            if (container) {
                // eslint-disable-next-line @lwc/lwc/no-inner-html
                container.innerHTML = this._content;
            }
        }
    }
}
