import { LightningElement, api } from 'lwc';

export default class ImageBlock extends LightningElement {
    static renderMode = 'light';
    @api src = '';
    @api alt = '';
    @api caption = '';
}
