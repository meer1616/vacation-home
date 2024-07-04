const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

exports.handler = async (event) => {
    const { action, data } = event
    
    if (!action) {
        return {
            statusCode: 400,
            success: false,
            error: "Missing required fields"
        };
    }

    if (action.toLowerCase() == "generate") {
        const key = Math.floor(Math.random() * 9) + 1
        return {
            statusCode: 200,
            success: true,
            data: {
                key,
                cipherText: caesarEncrypt(generateRandomPlainText(4), key),
            }
        }
    } else if (action.toLowerCase() == "verify") {
        const { key, cipherText, plainText } = data
        const expectedPlainText = caesarDecrypt(cipherText, key)
        if (expectedPlainText.toLowerCase() == plainText.toLowerCase()) {
            return {
                statusCode: 200,
                success: true,
                data: "Verified Successfully"
            };            
        } else {
            return {
                statusCode: 200,
                success: false,
                data: "Verification Failed"
            }; 
        }
    } else {
        return {
            statusCode: 400,
            success: false,
            error: "Action not valid"
        };
    }
};

function caesarEncrypt(plaintext, shift) {
    const length = characters.length;
    shift = shift % length;

    const encryptedText = plaintext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const originalIndex = characters.indexOf(char);
            const shiftedIndex = (originalIndex + shift) % length;
            return characters[shiftedIndex];
        }
        return char;
    }).join('');

    return encryptedText;
}

function caesarDecrypt(ciphertext, shift) {
    const length = characters.length;
    shift = shift % length;

    const decryptedText = ciphertext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const shiftedIndex = (characters.indexOf(char) - shift + length) % length;
            return characters[shiftedIndex];
        }
        return char;
    }).join('');

    return decryptedText;
}

function generateRandomPlainText(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
