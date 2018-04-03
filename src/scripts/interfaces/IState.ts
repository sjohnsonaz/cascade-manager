export interface IState extends EventTarget {
    showCommands: boolean;
    init(): void;
    dispose(): void;
    active: boolean;
    open(): void;
    close(): void;
}
