import { LightningElement, api } from 'lwc';

export default class CardBlock extends LightningElement {
    static renderMode = 'light';
    @api title = '';
    @api content = '';
    @api action = '';

    handleAction() {
        console.log('Card action clicked');
    }
}
