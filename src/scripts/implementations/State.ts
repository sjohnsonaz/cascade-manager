import { observable } from 'cascade';

import { IState } from '../interfaces/IState';

/*
export interface IStates {
    [index: string]: IState;
};
*/

export abstract class State implements IState {
    title: string | JSX.Element;
    showCommands: boolean;
    @observable active = false;
    abstract init();
    abstract dispose();
    open() {
        this.active = true;
    }
    close() {
        this.active = false;
    }
}