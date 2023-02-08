const rand = () => {
    return Math.random().toString(36).substr(2);
};
  
const token = () => {
    return rand() + rand() + rand();
};

module.exports = token;