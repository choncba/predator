'use strict';

const util = require('util');
const should = require('should');

const smtpConfig = require('./smtpConfig');
const smtpServerUrl = util.format('http://%s:%s', smtpConfig.host, smtpConfig.port);

module.exports.validateEmail = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const response = await fetch(smtpServerUrl + '/api/v1/messages', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                const messages = await response.text();

                if (messages === '[]') {
                    reject(new Error('The SMTP server did not get the email...'));
                } else {
                    should(JSON.parse(messages).length).eql(1);
                    const email = JSON.parse(messages)[0];
                    console.log(email);
                    resolve(email);
                }
            } catch (err) {
                reject(err);
            }
        }, 1000);
    });
};

module.exports.clearAllOldMails = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    await fetch(smtpServerUrl + '/api/v1/messages', {
        method: 'DELETE',
        signal: controller.signal
    });
    clearTimeout(timeoutId);
};
