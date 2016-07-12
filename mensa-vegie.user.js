// ==UserScript==
// @id		MensaGoettingenVegieFilter
// @name        Vegie Filter (Mensa Göttingen, nicht-offiziell)
// @namespace   http://github.com/rosievers
// @description Removes most non-vegetarian foods from the mensa overview. 	
// @author	Rolf Sievers
// @include     http://www.studentenwerk-goettingen.de/speiseplan.html*
// @version     0.1
// @grant       none
// ==/UserScript==

// This software may be used, modified and redistributed under the MIT license.
// http://opensource.org/licenses/MIT

// Namen von Einträgen, die nicht-vegetarische Anteile haben,
// jedoch fast immer auch vegetarische Portionen erlauben.
var erlaubteMenues = ["Salatbuffet", "Beilagen", "Stamm 1 vegetarisch", "Salatbuffet/Pastapoint", "Pasta und Gratins"];
// Manchmal enthält der Beschreibungstext "vegetarisch", auch wenn
// das menü mit einem 
var erlaubteSchluessel = ["Vegetarisch", "vegetarisch", "vegan", "Vegan"];
var nichtVegetarischeTitel = ["mit Fleisch", "MSC zertifiziert",
	"mit Fisch/ Meeresfrüchten"];

// Hier beginnt jetzt der eingentliche Progammcode

function contains (list, item) {
	return list.indexOf(item) >= 0;
}

function bildNichtVegetarisch (img) {
	return contains(nichtVegetarischeTitel, img.title);
}

var images = document.getElementsByTagName("img");
// Convert the htmlCollection to a javascript array.
var images = [].slice.call(images);

var meatImages = images.filter(bildNichtVegetarisch);
var meatRows = meatImages.map(function (img) {return img.parentNode.parentNode;});

// Run saving graces
function menuNotWhitelisted (row) {
	var menuName = row.children[0].childNodes[0].innerHTML;
	return !contains(erlaubteMenues, menuName);
}

function descriptionNotWhitelisted (row) {
	var text = row.textContent;
	// console.log(text)
	for (var i=0; i < erlaubteSchluessel.length; i++) {
		if (contains(text, erlaubteSchluessel[i])) {
			return false;
		}
	}
	return true;
}

meatRows = meatRows.filter(menuNotWhitelisted)
console.log(meatRows.length)
meatRows = meatRows.filter(descriptionNotWhitelisted)
console.log(meatRows.length)

var affectedLists = []

function remove (row) {
	var parent = row.parentNode;
	if (parent !== null) {
		// some rows may contains two non-veg symbols
		row.parentNode.removeChild(row);
		// generate a list of all affected lists
		if (!contains(affectedLists, parent.parentNode)) {
			affectedLists.push(parent);
		}
	}
}

meatRows.map(remove);

// Recollor all affected lists with alternating colors
function recolorList (tbody) {
	var nodes = tbody.children;
	for (var i=0; i < nodes.length; i++) {
		nodes[i].className = (i % 2 == 0 ? "ext_sits_speiseplan" : "ext_sits_speiseplan_odd")
	}
}

affectedLists.map(recolorList)
