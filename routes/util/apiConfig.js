const express = require("express");
const router = express.Router();
const allApi = require('../api/allApi');

module.exports = function (app) {
    allApi.forEach(api => {
        router[api.method.toLowerCase()](api.path, api.handler);
    });
    app.use(router);
}