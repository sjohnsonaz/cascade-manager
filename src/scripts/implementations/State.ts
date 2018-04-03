import { observable } from 'cascade';

import { IState } from '../interfaces/IState';

import BaseEventTarget from './BaseEventTarget';
export abstract class State extends BaseEventTarget implements IState {
    showCommands: boolean;
    @observable active = false;
    abstract init(): void;
    abstract dispose(): void;
    open() {
        this.active = true;
    }
    close() {
        this.active = false;
    }
}