const fs = require("fs");
// Dobivanje svih imena filova koji sadrže teme
let files = fs.readdirSync(__dirname + "/themes");

// Array sa svim temema
let allThemes = [];

// Spremanje svih tema u Array
files.forEach((file) => {
  if (file !== "template.js")
    allThemes.push(require(__dirname + "/themes/" + file));
});

const getAllThemeNames = () => {
  let result = []; // array sa imenima svih tema

  result = allThemes.map((Theme) => Theme.themeName); // Stavlja ime svake teme u Array

  return result;
};

const getThemePropertiesByName = (ThemeName) => {
  let result;

  result = allThemes.find((theme) => theme.themeName === ThemeName);

  return result;
};
module.exports = { getAllThemeNames, getThemePropertiesByName };