import 'whatwg-fetch';
import 'core-js';

export { IConnection } from './interfaces/IConnection';
export { ICrudConnection } from './interfaces/ICrudConnection';
export { IData } from './interfaces/IData';
export { IListQuery } from './interfaces/IListQuery';
export { IListResult } from './interfaces/IListResult';
export { IModel } from './interfaces/IModel';
export { IQueryModel } from './interfaces/IQueryModel';
export { ISelectable } from './interfaces/ISelectable';
export { IStore } from './interfaces/IStore';

export { default as Connection } from './implementations/Connection';
export { default as CrudConnection } from './implementations/CrudConnection';
export { default as Model } from './implementations/Model';
export { default as QueryModel } from './implementations/QueryModel';
export { default as Store } from './implementations/Store';
