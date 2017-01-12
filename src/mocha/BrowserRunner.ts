/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

import 'reflect-metadata';

import '../tests/requiredTest0';
import '../tests/ConnectionTest0';
import '../tests/CrudConnectionTest0';
import '../tests/StoreTest0';
import '../tests/ManagerTest0';
