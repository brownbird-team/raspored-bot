// Generiraj random string
const rand = () => {
    return Math.random().toString(36).substring(2);
};

// Spoji nekoliko random stringova da budu dulji
const token = () => {
    return rand() + rand() + rand() + rand();
};

module.exports = token;