export interface IState {
    title: any;
    showCommands: boolean;
    init();
    dispose();
    active: boolean;
    open();
    close();
}
