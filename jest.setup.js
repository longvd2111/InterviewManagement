// jest.setup.js
import fetch, { Request, Response } from 'node-fetch';
import '@testing-library/jest-dom';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // Other Jest configurations
  };