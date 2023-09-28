function generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?';
    let key = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
  
    return key;
  }


function* generateRC4(key) {

  //Initialization of S
  const s = [];
  const t = [];

  for (let i = 0; i < 256; i++) {
      s[i] = i;
      t[i] = key[i % key.length];
  }

  let j = 0;

  for (let i = 0; i < 256; i++) {
      j = (j + s[i] + t[i].charCodeAt(0)) % 256;
      let temp = s[i];
      s[i] = s[j];
      s[j] =  temp;
  }

// Stream generation
  let i = 0;
  j = 0;


  while (true) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;

    let temp = s[i];
    s[i] = s[j];
    s[j] =  temp;

    const m = (s[i] + s[j]) % 256;
    yield s[m];
  }
}

function encryptRC4(plainText, prngGenerator, skip) {
  let cipherText = ''

  for (let i = 0; i < skip; i++) {
    prngGenerator.next();
  }

  for (let i = 0; i < plainText.length; i++) {
    const k = prngGenerator.next().value;
    const encrypted = k ^ plainText[i].charCodeAt(0);
    cipherText = cipherText + String.fromCharCode(encrypted);
  }

  return cipherText;
}

function decryptRC4(cipherText, prngGenerator, skip) {
  let plainText = '';

  for (let i = 0; i < skip; i++) {
    prngGenerator.next();
  }

  for (let i = 0; i < cipherText.length; i++) {
    const k = prngGenerator.next().value;
    const decrypted = k ^ plainText[i].charCodeAt(0);
    plainText = cipherText + String.fromCharCode(decrypted);
  }
  
  return plainText;
}

const plainText = 'This is a text to be encrypted with RC4.'; //An arbitrary text to encrypt.
const KEYLEN = 150; //The length of the key; can vary based on the need.
const SKIP = 1000;
const key = generateRandomKey(KEYLEN);

const cipherText = encryptRC4(plainText, generateRC4(key), SKIP);
const retrievedText = encryptRC4(cipherText, generateRC4(key), SKIP);