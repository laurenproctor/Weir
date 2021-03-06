/*

This script makes a copy of my configuration file with all personal information wiped out, 
so I can change it as much as I want and still have an example for checking into source 
control.

It turns out, despite the stupid name, that JSON.stringify() already has a value replacer 
built in. Handy!

Running this script will also generate a package.json file, or update your existing package 
with the current node_modules, and it logs out a list of credits for the packages used. I 
place this in the Credits section of the settings dialog.

*/

var cfg = require("./Config");
var fs = require("fs");
var path = require("path");

var replacer = function(key, value) {
  if (key === "") return value;
  switch (typeof value) {
    case "number": return 0;
    case "string": return "";
    case "boolean": return false;
    case "function": return "f()";
    case "object":
      if (value instanceof Array) return [];
      return value;
  }
}

fs.writeFileSync("cfg-example.json", JSON.stringify(cfg, replacer, 2));
var credits = "";

var package = {};
if (fs.existsSync("package.json")) {
  package = JSON.parse(fs.readFileSync("package.json"))
}
package.dependencies = {};
var modules = fs.readdirSync("./node_modules");
modules.forEach(function(mod) {
  var packagePath = path.join("./node_modules/", mod, "/package.json");
  if (fs.existsSync(packagePath)) {
    var modPackage = JSON.parse(fs.readFileSync(packagePath));
    package.dependencies[modPackage.name] = modPackage.version || "*";
    var site = modPackage.homepage;
    credits += "<li> "
    if (site) {
      credits += '<a href="' + site + '">';
    }
    credits += modPackage.name;
    if (site) {
      credits += "</a>";
    }
    credits += " - ";
    if (modPackage.author && modPackage.author.url) {
      credits += "<a href='" + modPackage.author.url + "'>";
      credits += modPackage.author.name;
      credits += "</a>";
    } else {
      credits += modPackage.author.name || modPackage.author;
    }
    credits += "\n";
  }
});
fs.writeFileSync("package.json", JSON.stringify(package, null, 2), "utf8");
console.log(credits);
