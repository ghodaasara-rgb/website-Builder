import { LightningElement, api } from 'lwc';

export default class Footer extends LightningElement {
    static renderMode = 'light';
    @api copyright = '© 2026 FlexSite';
    get year() {
        return new Date().getFullYear();
    }
}
