'use strict';
const logger = require('./logger');

const defaultOptions = {
    timeout: 15 * 1000
};

module.exports.send = async (options) => {
    const { url, method = 'GET', body, headers = {}, json = true, timeout = defaultOptions.timeout, ...rest } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
        method,
        headers: { ...headers },
        signal: controller.signal
    };

    if (body) {
        if (json) {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        } else {
            fetchOptions.body = body;
        }
    }

    try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.text();
            const error = new Error(`Request failed with status ${response.status}: ${errorBody}`);
            error.statusCode = response.status;
            error.response = errorBody;
            throw error;
        }

        let responseBody;
        if (json) {
            const text = await response.text();
            responseBody = text ? JSON.parse(text) : undefined;
        } else {
            responseBody = await response.text();
        }

        logger.info({ method, url, response: responseBody }, 'Successful request');
        return responseBody;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            const timeoutError = new Error(`Request to ${url} timed out after ${timeout}ms`);
            timeoutError.statusCode = 408;
            logger.error({ method, url, error: timeoutError }, 'Error occurred sending request');
            throw timeoutError;
        }
        logger.error({ method, url, error }, 'Error occurred sending request');
        throw error;
    }
};
