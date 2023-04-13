const db = require('../connect');

// Dobivanje id-a zadnjeg master tablea
exports.getLastMasterId = async () => {
  let query = `SELECT MAX(id) AS id FROM ras_master_table`;

  let result = await db.Connection.query(query);

  return result[0].id;
};


exports.prepareForSQL = (input) => {
    let output = '';
    for (character of input) {
        if (character === "'" || character === "\\") {
            output += "\\" + character;
        } else {
            output += character;
        }
    }
    return output;
}

exports.onlyASCII = str => /^[\x00-\x7F]+$/.test(str);