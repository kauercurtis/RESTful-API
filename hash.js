const crypto = require('crypto');

// Hashing function provided by Google Gemini
async function generateUniqueId(data) {

    // 1. Sort keys and stringify to ensure consistency

    const msgString = JSON.stringify(data, Object.keys(data).sort());


    // 2. Encode string as bitstream

    const msgUint8 = new TextEncoder().encode(msgString);


    // 3. Hash the message using SHA-256

    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);


    // 4. Convert buffer to byte array

    const hashArray = Array.from(new Uint8Array(hashBuffer));


    // 5. Convert bytes to hex string

    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    

    return hashHex;

} 

module.exports = {
	generateUniqueId
}
