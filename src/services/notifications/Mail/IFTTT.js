// const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


class MailIFTTT {

	async sendEmail({sensor, zone, value}) {

        const body = {
            value1: sensor,
            value2: value,
            value3: zone,
        };
		const response = await fetch('https://maker.ifttt.com/trigger/greenhouse_sensors_alert/with/key/c2hDUk3irr0hmsIx2e74re', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        });

        console.log(response);
	}
}

module.exports = { MailIFTTT };