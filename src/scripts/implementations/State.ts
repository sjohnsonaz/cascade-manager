import { observable } from 'cascade';

import { IState } from '../interfaces/IState';

export default class State implements IState {
    title: string | JSX.Element;
    showCommands: boolean;
    @observable active = false;
    init() {
        this.active = false;
    }
    dispose() {

    }
    open() {
        this.active = true;
    }
    close() {
        this.active = false;
    }
}