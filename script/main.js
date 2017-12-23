//code written by https://www.twitch.tv/crossproduct/
//modified for keysanity by Yogidamonk, not very elegant as I just wanted to make it work and don't really know HTML
var prizes = [];
var medallions = [];
var bosses = [];

var itemGrid = [];
var itemLayout = [];
var showchests = true;
var showsmallkeys = true;
var shownames = true;
var showprizes = true;
var showmedals = true;

var editmode = false;
var selected = {};

function setCookie(obj) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    var val = JSON.stringify(obj);
    document.cookie = "key=" + val + ";" + expires + ";path=/";
}

function getCookie() {
    var name = "key=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return {};
}

var cookiekeys = ['map', 'iZoom', 'mZoom', 'mOrien', 'mPos', 'chest', 'prize', 'medal', 'items', 'smallkey', 'name'];
var cookieDefault = {
    map:1,
    iZoom:100,
    mZoom:51,
    mOrien:0,
    mPos:0,
    chest:1,
	smallkey:1,
    prize:1,
    medal:1,
	name:1,
    items:defaultItemGrid
}

var cookielock = false;
function loadCookie() {
    if (cookielock)
        return;
    cookielock = true;

    cookieobj = getCookie();

    cookiekeys.forEach(function (key) {
        if (cookieobj[key] === undefined) {
            cookieobj[key] = cookieDefault[key];
        }
    });

    initGridRow(JSON.parse(JSON.stringify(cookieobj.items)));

    document.getElementsByName('showmap')[0].checked = !!cookieobj.map;
    document.getElementsByName('showmap')[0].onchange();
    document.getElementsByName('itemdivsize')[0].value = cookieobj.iZoom;
    document.getElementsByName('itemdivsize')[0].onchange();
    document.getElementsByName('mapdivsize')[0].value = cookieobj.mZoom;
    document.getElementsByName('mapdivsize')[0].onchange();

    document.getElementsByName('maporientation')[cookieobj.mOrien].click();
    document.getElementsByName('mapposition')[cookieobj.mPos].click();

    document.getElementsByName('showchest')[0].checked = !!cookieobj.chest;
    document.getElementsByName('showchest')[0].onchange();
	document.getElementsByName('showsmallkey')[0].checked = !!cookieobj.smallkey;
    document.getElementsByName('showsmallkey')[0].onchange();
    document.getElementsByName('showcrystal')[0].checked = !!cookieobj.prize;
    document.getElementsByName('showcrystal')[0].onchange();
    document.getElementsByName('showmedallion')[0].checked = !!cookieobj.medal;
    document.getElementsByName('showmedallion')[0].onchange();

    cookielock = false;
}

function saveCookie() {
    if (cookielock)
        return;
    cookielock = true;

    cookieobj = {};

    cookieobj.map = document.getElementsByName('showmap')[0].checked ? 1 : 0;
    cookieobj.iZoom = document.getElementsByName('itemdivsize')[0].value;
    cookieobj.mZoom = document.getElementsByName('mapdivsize')[0].value;


    cookieobj.mOrien = document.getElementsByName('maporientation')[1].checked ? 1 : 0;
    cookieobj.mPos = document.getElementsByName('mapposition')[1].checked ? 1 : 0;


    cookieobj.chest = document.getElementsByName('showchest')[0].checked ? 1 : 0;
	cookieobj.smallkey = document.getElementsByName('showsmallkey')[0].checked ? 1 : 0;
    cookieobj.prize = document.getElementsByName('showcrystal')[0].checked ? 1 : 0;
    cookieobj.medal = document.getElementsByName('showmedallion')[0].checked ? 1 : 0;

    cookieobj.items = JSON.parse(JSON.stringify(itemLayout));

    setCookie(cookieobj);

    cookielock = false;
}

// Event of clicking a chest on the map
function toggleChest(x){
    chests[x].isOpened = !chests[x].isOpened;
    if(chests[x].isOpened)
        document.getElementById(x).className = "mapspan chest opened";
    else
        document.getElementById(x).className = "mapspan chest " + chests[x].isAvailable();
}

// Highlights a chest location and shows the name as caption
function highlight(x){
    document.getElementById(x).style.backgroundImage = "url(images/highlighted.png)";
    document.getElementById("caption").innerHTML = chests[x].name;
}

function unhighlight(x){
    document.getElementById(x).style.backgroundImage = "url(images/poi.png)";
    document.getElementById("caption").innerHTML = "&nbsp;";
}

// Highlights a chest location and shows the name as caption (but for dungeons)
function highlightDungeon(x){
    document.getElementById("dungeon"+x).style.backgroundImage = "url(images/highlighted.png)";
    document.getElementById("caption").innerHTML = dungeons[x].name;
}

function unhighlightDungeon(x){
    document.getElementById("dungeon"+x).style.backgroundImage = "url(images/poi.png)";
    document.getElementById("caption").innerHTML = "&nbsp;";
}

function showChest(sender) {
    showchests = sender.checked;
    updateGridItemAll();
    saveCookie();
}
function showSmallkey(sender) {
    showsmallkeys = sender.checked;
    updateGridItemAll();
    saveCookie();
}

function showCrystal(sender) {
    showprizes = sender.checked;
    updateGridItemAll();
    saveCookie();
}

function showMedallion(sender) {
    showmedals = sender.checked;
    updateGridItemAll();
    saveCookie();
}

function setOrder(H) {
    if (H) {
        document.getElementById('layoutdiv').classList.remove('flexcontainer');
    } 
    else {
        document.getElementById('layoutdiv').classList.add('flexcontainer');
    }
    saveCookie();
}

function setOrientation() {
    
}

function setZoom(target, sender) {
    document.getElementById(target).style.zoom = sender.value / 100;

    //    -moz-transform: scale(0.5);

    document.getElementById(target + 'size').innerHTML = (sender.value) + '%';
    saveCookie();
}

var prevH = false;
function setMapOrientation(H) {
    if (H == prevH) {
        return;
    }
    prevH = H;


    var chest = document.getElementsByClassName("mapspan");
    var i;

    if (H) {
        document.getElementById("mapdiv").classList.remove('mapdiv');
        document.getElementById("mapdiv").classList.add('mapvdiv');
        for (i = 0; i < chest.length; i++) {
            var x = parseFloat(chest[i].style.left) / 100;
            var y = parseFloat(chest[i].style.top) / 100;

            if (x > 0.5) {
                chest[i].style.left = (((x - 0.5) * 2) * 100) + '%';
                chest[i].style.top = (((y / 2) + 0.5) * 100) + '%';
            }
            else {
                chest[i].style.left = ((x  * 2) * 100) + '%';
                chest[i].style.top = ((y / 2) * 100) + '%';
            }
        }
    }
    else {
        document.getElementById("mapdiv").classList.add('mapdiv');
        document.getElementById("mapdiv").classList.remove('mapvdiv');
        for (i = 0; i < chest.length; i++) {
            var x = parseFloat(chest[i].style.left) / 100;
            var y = parseFloat(chest[i].style.top) / 100;

            if (y > 0.5) {
                chest[i].style.left = (((x / 2) + 0.5) * 100) + '%';
                chest[i].style.top = (((y - 0.5) * 2) * 100) + '%';
            }
            else {
                chest[i].style.left = ((x / 2) * 100) + '%';
                chest[i].style.top = ((y * 2) * 100) + '%';
            }
        }
    }
    saveCookie();
}

function showSettings(sender) {
    if (editmode) {
        var r, c;
        var startdraw = false;
        for (r = 8; r >= 0 && !startdraw; r--) {  //was 7
            if (!itemLayout[r] || !itemLayout[r].length) {
                itemGrid[r]['row'].style.display = 'none';
            } else {
                for (c = 0; c < 8; c++) {
                    if (!!itemLayout[r][c] && itemLayout[r][c] != 'blank') {
                        startdraw = true;
                        r++;
                        break;
                    }
                }		

                if (!startdraw) {
                    itemGrid[r]['row'].style.display = 'none';
                    itemGrid[r]['half'].style.display = 'none';
                }	
            }
        }

        for (; r >= 0; r--) {
            itemGrid[r]['row'].style.display = '';	
            itemGrid[r]['button'].style.display = 'none';
        }

        showchests = document.getElementsByName('showchest')[0].checked;
		showsmallkeys = document.getElementsByName('showsmallkey')[0].checked;
        showprizes = document.getElementsByName('showcrystal')[0].checked;
        showmedals = document.getElementsByName('showmedallion')[0].checked;
        editmode = false;
        updateGridItemAll();
        showTracker('mapdiv', document.getElementsByName('showmap')[0]);
        document.getElementById('itemconfig').style.display = 'none';

        sender.innerHTML = '🔧';
        saveCookie();
    } else {
        var x = document.getElementById("settings");
        if (!x.style.display || x.style.display == 'none') {
            x.style.display = 'initial';
            sender.innerHTML = 'X';
        } else {
            x.style.display = 'none';		
            sender.innerHTML = '🔧';
        } 
    }
}

function showTracker(target, sender) {
    if (sender.checked) {
        document.getElementById(target).style.display = '';
    }
    else {
        document.getElementById(target).style.display = 'none';
    }
}

function clickRowButton(row) {
    if (itemLayout[row].length % 2 == 0) {
        itemGrid[row]['button'].innerHTML = '-';
        itemGrid[row]['button'].style.backgroundColor = 'red';
        itemGrid[row][6]['item'].style.display = '';
        itemGrid[row]['half'].style.display = 'none';	
        itemLayout[row][6] = 'blank';
    } else {
        itemGrid[row]['button'].innerHTML = '+';
        itemGrid[row]['button'].style.backgroundColor = 'green';
        itemGrid[row][6]['item'].style.display = 'none';
        itemGrid[row]['half'].style.display = '';	
        document.getElementById(itemLayout[row][6]).style.opacity = 1;
        itemLayout[row].splice(-1, 1);
    }
    updateGridItem(row, 6);
}


function EditMode() {
    var r, c;

    for (r = 0; r < 9; r++) {  //was 8
        itemGrid[r]['row'].style.display = '';
        itemGrid[r]['button'].style.display = '';
    }

    showchests = false;
	showsmallkeys = false;
    showprizes = false;
    showmedals = false;
    updateGridItemAll();
    editmode = true;
    updateGridItemAll();
    showTracker('mapdiv', {checked:false});
    document.getElementById('settings').style.display = 'none';
    document.getElementById('itemconfig').style.display = '';

    document.getElementById('settingsbutton').innerHTML = 'Exit Edit Mode';
}


function createItemTracker(sender) {
    var r;
    for (r = 0; r < 9; r++) { //was 8
        itemGrid[r] = [];
        itemLayout[r] = [];

        itemGrid[r]['row'] = document.createElement('table');
        itemGrid[r]['row'].className = 'tracker';
        sender.appendChild(itemGrid[r]['row']);

        var tr = document.createElement('tr');
        itemGrid[r]['row'].appendChild(tr);

        itemGrid[r]['half'] = document.createElement('td');
        itemGrid[r]['half'].className = 'halfcell';
        tr.appendChild(itemGrid[r]['half']);

        var i;
        for (i = 0; i < 8; i++) {	
            itemGrid[r][i] = [];
            itemLayout[r][i] = 'blank';

            itemGrid[r][i]['item'] = document.createElement('td');
            itemGrid[r][i]['item'].className = 'griditem';
            tr.appendChild(itemGrid[r][i]['item']);

            var tdt = document.createElement('table');
            tdt.className = 'lonk';
            itemGrid[r][i]['item'].appendChild(tdt);

                var tdtr1 = document.createElement('tr');
                tdt.appendChild(tdtr1);
                    itemGrid[r][i][0] = document.createElement('th');
                    itemGrid[r][i][0].className = 'corner';
                    itemGrid[r][i][0].onclick = new Function("gridItemClick("+r+","+i+",0)");
                    tdtr1.appendChild(itemGrid[r][i][0]);
                    itemGrid[r][i][1] = document.createElement('th');
                    itemGrid[r][i][1].className = 'corner';
                    itemGrid[r][i][1].onclick = new Function("gridItemClick("+r+","+i+",1)");
                    tdtr1.appendChild(itemGrid[r][i][1]);
                var tdtr2 = document.createElement('tr');
                tdt.appendChild(tdtr2);
                    itemGrid[r][i][2] = document.createElement('th');
                    itemGrid[r][i][2].className = 'corner';
                    itemGrid[r][i][2].onclick = new Function("gridItemClick("+r+","+i+",2)");
                    tdtr2.appendChild(itemGrid[r][i][2]);
                    itemGrid[r][i][3] = document.createElement('th');
                    itemGrid[r][i][3].className = 'corner';
                    itemGrid[r][i][3].onclick = new Function("gridItemClick("+r+","+i+",3)");
                    tdtr2.appendChild(itemGrid[r][i][3]);
        }

        var half = document.createElement('td');
        half.className = 'halfcell';
        tr.appendChild(half);
        itemGrid[r]['button'] = document.createElement('button');
        itemGrid[r]['button'].innerHTML = '-';
        itemGrid[r]['button'].style.backgroundColor = 'red';		
        itemGrid[r]['button'].style.color = 'white';	
        itemGrid[r]['button'].onclick = new Function("clickRowButton(" + r + ")");;
        half.appendChild(itemGrid[r]['button']);
    }
}

function updateGridItem(row, index) {
    var item = itemLayout[row][index];

    if (editmode) {
        if (!item || item == 'blank') {
            itemGrid[row][index]['item'].style.backgroundImage = ("url(images/blank.png)");
        }
        else if((typeof items[item]) == "boolean"){
            itemGrid[row][index]['item'].style.backgroundImage = "url(images/" + item + ".png)";
        }
        else{
            itemGrid[row][index]['item'].style.backgroundImage = "url(images/" + item + itemsMax[item] + ".png)";
        }

        itemGrid[row][index]['item'].style.border = '1px solid white';
        itemGrid[row][index]['item'].style.opacity = 1;

        return;
    }

    itemGrid[row][index]['item'].style.border = '0px';
    itemGrid[row][index]['item'].style.opacity = '';

    if (!item || item == 'blank') {
        itemGrid[row][index]['item'].style.backgroundImage = '';
        return;
    }

    if((typeof items[item]) == "boolean"){
        itemGrid[row][index]['item'].style.backgroundImage = "url(images/" + item + ".png)";
    }
    else{
        itemGrid[row][index]['item'].style.backgroundImage = "url(images/" + item + items[item] + ".png)";
    }
	

    itemGrid[row][index]['item'].className = "griditem " + (!!items[item]);

    if (item.substring(0,4) == "boss"){//moved most of this elsewhere but need to keep medallions somehow
        var d = item.substring(4,5);
        
		if (showmedals && d >= 8) {
            itemGrid[row][index][1].style.backgroundImage = "url(images/medallion" + medallions[d] + ".png)";
        } else {
            itemGrid[row][index][1].style.backgroundImage = '';
        }
    }
	
	else if (item.substring(0,4) == "name"){ //boss icons and prizes in column5
											 //could use 2i & 2i+1 here to shorten code	
											 //for i=0 to 5  itemGrid[i][5][0]  bosses[2i] bosses[2i+1]
	
		itemGrid[0][5][0].style.backgroundImage = "url(images/bossmini0" + bosses[0] + ".png)";
        itemGrid[0][5][1].style.backgroundImage = "url(images/dungeon" + prizes[0] + ".png)";
		itemGrid[0][5][2].style.backgroundImage = "url(images/bossmini1" + bosses[1] + ".png)";
		itemGrid[0][5][3].style.backgroundImage = "url(images/dungeon" + prizes[1] + ".png)";
		
		itemGrid[1][5][0].style.backgroundImage = "url(images/bossmini2" + bosses[2] + ".png)";
        itemGrid[1][5][1].style.backgroundImage = "url(images/dungeon" + prizes[2] + ".png)";
		itemGrid[1][5][2].style.backgroundImage = "url(images/bossmini3" + bosses[3] + ".png)";
		itemGrid[1][5][3].style.backgroundImage = "url(images/dungeon" + prizes[3] + ".png)";
	
		itemGrid[2][5][0].style.backgroundImage = "url(images/bossmini4" + bosses[4] + ".png)";
        itemGrid[2][5][1].style.backgroundImage = "url(images/dungeon" + prizes[4] + ".png)";
		itemGrid[2][5][2].style.backgroundImage = "url(images/bossmini5" + bosses[5] + ".png)";
		itemGrid[2][5][3].style.backgroundImage = "url(images/dungeon" + prizes[5] + ".png)";
		
		itemGrid[3][5][0].style.backgroundImage = "url(images/bossmini6" + bosses[6] + ".png)";
        itemGrid[3][5][1].style.backgroundImage = "url(images/dungeon" + prizes[6] + ".png)";
		itemGrid[3][5][2].style.backgroundImage = "url(images/bossmini7" + bosses[7] + ".png)";
		itemGrid[3][5][3].style.backgroundImage = "url(images/dungeon" + prizes[7] + ".png)";
		
		itemGrid[4][5][0].style.backgroundImage = "url(images/bossmini8" + bosses[8] + ".png)";
        itemGrid[4][5][1].style.backgroundImage = "url(images/dungeon" + prizes[8] + ".png)";
		itemGrid[4][5][2].style.backgroundImage = "url(images/bossmini9" + bosses[9] + ".png)";
		itemGrid[4][5][3].style.backgroundImage = "url(images/dungeon" + prizes[9] + ".png)";
		
		itemGrid[5][5][0].style.backgroundImage = "url(images/agamini0" + bosses[10] + ".png)";
        itemGrid[5][5][1].style.backgroundImage = "";
		itemGrid[5][5][2].style.backgroundImage = "url(images/agamini0" + bosses[11] + ".png)";
		itemGrid[5][5][3].style.backgroundImage = "";
         }
		 
	else if (item.substring(0,4) == "keys"){ //smallkeys and bigkeys in column6
		itemGrid[0][6][0].style.backgroundImage = "";
        itemGrid[0][6][1].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[0] + ".png)";
		itemGrid[0][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[1] + ".png)";
		itemGrid[0][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[1] + ".png)";
		
		itemGrid[1][6][0].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[2] + ".png)";
        itemGrid[1][6][1].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[2] + ".png)";
		itemGrid[1][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[3] + ".png)";
		itemGrid[1][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[3] + ".png)";
		
		itemGrid[2][6][0].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[4] + ".png)";
        itemGrid[2][6][1].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[4] + ".png)";
		itemGrid[2][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[5] + ".png)";
		itemGrid[2][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[5] + ".png)";
		
		itemGrid[3][6][0].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[6] + ".png)";
        itemGrid[3][6][1].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[6] + ".png)";
		itemGrid[3][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[7] + ".png)";
		itemGrid[3][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[7] + ".png)";
	
		itemGrid[4][6][0].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[8] + ".png)";
        itemGrid[4][6][1].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[8] + ".png)";
		itemGrid[4][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[9] + ".png)";
		itemGrid[4][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[9] + ".png)";
		
		itemGrid[5][6][0].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[10] + ".png)";
        itemGrid[5][6][1].style.backgroundImage = "";
		itemGrid[5][6][2].style.backgroundImage = "url(images/smallkey" + dungeonsmallkeys[11] + ".png)";
		itemGrid[5][6][3].style.backgroundImage = "url(images/bigkey" + dungeonbigkeys[11] + ".png)";
         }	

	else if (item.substring(0,4) == "ches"){ //chests in left half of column7
		itemGrid[0][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[0] + ".png)";
 	    itemGrid[0][7][1].style.backgroundImage = "";
		itemGrid[0][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[1] + ".png)";
		itemGrid[0][7][3].style.backgroundImage = "";
		
		itemGrid[1][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[2] + ".png)";
		itemGrid[1][7][1].style.backgroundImage = "";
		itemGrid[1][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[3] + ".png)";
		itemGrid[1][7][3].style.backgroundImage = "";
		
		itemGrid[2][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[4] + ".png)";
		itemGrid[2][7][1].style.backgroundImage = "";
		itemGrid[2][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[5] + ".png)";
		itemGrid[2][7][3].style.backgroundImage = "";
		
		itemGrid[3][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[6] + ".png)";
		itemGrid[3][7][1].style.backgroundImage = "";
		itemGrid[3][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[7] + ".png)";
		itemGrid[3][7][3].style.backgroundImage = "";
	
		itemGrid[4][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[8] + ".png)";
		itemGrid[4][7][1].style.backgroundImage = "";
		itemGrid[4][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[9] + ".png)";
		itemGrid[4][7][3].style.backgroundImage = "";
		
		itemGrid[5][7][0].style.backgroundImage = "url(images/chest" + dungeonchests[10] + ".png)";
		itemGrid[5][7][1].style.backgroundImage = "";
		itemGrid[5][7][2].style.backgroundImage = "url(images/chest" + dungeonchests[11] + ".png)";
		itemGrid[5][7][3].style.backgroundImage = "";


}		
}

function updateGridItemAll() {
    for (r = 0; r < 9; r++) {  //was 8 but I want another row for keys
        for (c = 0; c < 8; c++) {
            updateGridItem(r, c);
        }
    }
}

function setGridItem(item, row, index) {
    var previtem = itemLayout[row][index];
    itemLayout[row][index] = item;
    if (item != 'blank')
        document.getElementById(item).style.opacity = 0.25;
    updateGridItem(row, index)
}

function initGridRow(itemsets) {
    prizes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    medallions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	bosses = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];//starting lighted, if killed goes dark

    var r, c;
    var startdraw = false;
    for (r = 8; r >= 0 && !startdraw; r--) { //was 7
        if (!itemsets[r] || !itemsets[r].length) {
            itemGrid[r]['row'].style.display = 'none';
            itemGrid[r]['half'].style.display = 'none';
        } else {
            for (c = 0; c < 8; c++) {
                if (!!itemsets[r][c] && itemsets[r][c] != 'blank') {
                    startdraw = true;
                    r++;
                    break;
                }
            }	

            if (!startdraw) {
                itemGrid[r]['row'].style.display = 'none';
                itemGrid[r]['half'].style.display = 'none';
            }			
        }
    }

    for (; r >= 0; r--) {
        itemGrid[r]['row'].style.display = '';	

        if (itemsets[r].length % 2 != 0) {
            itemGrid[r]['half'].style.display = 'none';
            itemGrid[r][6]['item'].style.display = '';
        } else {
            clickRowButton(r);
        }
        itemGrid[r]['button'].style.display = 'none';

        for (c = 0; c < 8; c++) {
            if (itemsets[r][c]) {
                setGridItem(itemsets[r][c], r, c);
            } 
        }
    }
}

function gridItemClick(row, col, corner) {
    if (editmode) {		
        if (selected.item) {
            document.getElementById(selected.item).style.border = '1px solid white';
            var old = itemLayout[row][col];

            if (old == selected.item) {
                selected = {};
                return;
            }

            if (selected.item != 'blank') {
                document.getElementById(selected.item).style.opacity = 0.25;

                var r,c;
                var found = false;
                for (r = 0; r < 9; r++) { //was 8
                    for (c = 0; c < 8; c++) {
                        if (itemLayout[r][c] == selected.item) {
                            itemLayout[r][c] = 'blank';
                            found = true;
                            break;
                        }
                    }

                    if (found)
                        break;
                }
            }

            itemLayout[row][col] = selected.item;
            updateGridItem(row, col);

            document.getElementById(old).style.opacity = 1;

            selected = {};
        } else if (selected.row !== undefined) {
            itemGrid[selected.row][selected.col]['item'].style.border = '1px solid white';

            var temp = itemLayout[row][col]
            itemLayout[row][col] = itemLayout[selected.row][selected.col];
            itemLayout[selected.row][selected.col] = temp;
            updateGridItem(row, col);
            updateGridItem(selected.row, selected.col);

            selected = {};
        } else {
            itemGrid[row][col]['item'].style.border = '3px solid yellow';
            selected = {row:row, col:col};		
        }
        return;
    }

    var item = itemLayout[row][col];
	
    if(item.substring(0,4) == "boss"){
        var d = item.substring(4,5);

        if (corner == 1 && showmedals && d >= 8) {
            medallions[d]++;
            if(medallions[d] == 4)
                medallions[d] = 0;
            // Update availability of dungeon boss AND chests
            if(dungeons[d].isBeaten)
                document.getElementById("bossMap"+d).className = "mapspan boss opened";
            else
                document.getElementById("bossMap"+d).className = "mapspan boss " + dungeons[d].isBeatable();

            if(dungeonchests[d] > 0)
                document.getElementById("dungeon"+d).className = "mapspan 1dungeon " + dungeons[d].canGetChest();
            // TRock medallion affects Mimic Cave
            if(d == 9){
                chests[4].isOpened = !chests[4].isOpened;
                toggleChest(4);
            }
            // Change the mouseover text on the map
            var dungeonName;
            if(d == 8)
                dungeonName = "Misery Mire";
            else
                dungeonName = "Turtle Rock";
            dungeons[d].name = dungeonName + " <img src='images/medallion"+medallions[d]+".png' class='mini'><img src='images/lantern.png' class='mini'>";
        } 
   
		
        
      
    }
	
	else if(item.substring(0,4) == "name") { //this is what happens when you click, has to have name substring to allow click
        var e = (row*2)   //index for even rows
		var f = (row*2)+1 //index for odd rows
		
		if (corner == 0) {
			bosses[e]++; //boss dead or alive array
			if(bosses[e] == 2)
                bosses[e] = 0;
			dungeons[e].isBeaten = !dungeons[e].isBeaten;
            if(dungeons[e].isBeaten)
                document.getElementById("bossMap"+e).className = "mapspan boss opened";
            else
                document.getElementById("bossMap"+e).className = "mapspan boss " + dungeons[e].isBeatable();
        } 
		else if (corner == 2) {
			bosses[f]++;
			if(bosses[f] == 2)
                bosses[f] = 0;
			dungeons[f].isBeaten = !dungeons[f].isBeaten;
            if(dungeons[f].isBeaten)
                document.getElementById("bossMap"+f).className = "mapspan boss opened";
            else
                document.getElementById("bossMap"+f).className = "mapspan boss " + dungeons[f].isBeatable();
        } 
        else if (corner == 1) {
            prizes[e]++;
            if(prizes[e] == 5)
                prizes[e] = 0;
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendantChests = [25, 61, 62];
            for(k=0; k<pendantChests.length; k++){
                if(!chests[pendantChests[k]].isOpened)
                    document.getElementById(pendantChests[k]).className = "mapspan chest " + chests[pendantChests[k]].isAvailable();
            }
        } 
		else if (corner == 3 && showprizes){
			prizes[f]++;
            if(prizes[f] == 5)
                prizes[f] = 0;
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendantChests = [25, 61, 62];
            for(k=0; k<pendantChests.length; k++){
                if(!chests[pendantChests[k]].isOpened)
                    document.getElementById(pendantChests[k]).className = "mapspan chest " + chests[pendantChests[k]].isAvailable();
			}
		}
		
       
    }
	
	else if(item.substring(0,4) == "keys") { //this is what happens when you click, has to have key substring to allow click
        var g = (row*2)
		var h = (row*2)+1
		
		if (corner == 0) {
			
            var smallkeyitem = 'smallkey' + g;
            dungeonsmallkeys[g]++;
            if(dungeonsmallkeys[g] > itemsMax[smallkeyitem])
                dungeonsmallkeys[g] = 0;
         
        } 
		else if (corner == 2) {
			var smallkeyitem = 'smallkey' + h;
            dungeonsmallkeys[h]++;
            if(dungeonsmallkeys[h] > itemsMax[smallkeyitem])
                dungeonsmallkeys[h] = 0;
        } 
        else if (corner == 1) {
            dungeonbigkeys[g]++;
            if(dungeonbigkeys[g] > 1)
                dungeonbigkeys[g] = 0;
            
        } 
		else if (corner == 3){
			dungeonbigkeys[h]++;
            if(dungeonbigkeys[h] > 1)
                dungeonbigkeys[h] = 0;
            
		}
		
       
    }
	
	else if(item.substring(0,4) == "ches") { //this is what happens when you click, has to have ches substring to allow click
        var g = (row*2)
		var h = (row*2)+1
		
		if (corner == 0) {
			var chestitem = 'chest' + g;
            dungeonchests[g]--; //counts down from total chests in the dungeon
            if(dungeonchests[g] < 0)
                dungeonchests[g] = itemsMax[chestitem];

            if(dungeonchests[g] == 0)
                document.getElementById("dungeon"+g).className = "mapspan dungeon opened";
            else
                document.getElementById("dungeon"+g).className = "mapspan dungeon " + dungeons[g].canGetChest();
        } 
		else if (corner == 2) {
			var chestitem = 'chest' + h;
            dungeonchests[h]--;
            if(dungeonchests[h] < 0)
                dungeonchests[h] = itemsMax[chestitem];

            if(dungeonchests[h] == 0)
                document.getElementById("dungeon"+h).className = "mapspan dungeon opened";
            else
                document.getElementById("dungeon"+h).className = "mapspan dungeon " + dungeons[h].canGetChest();
        } 
		
		//only using left half of the tile so don't need these anymore
        //else if (corner == 1) 
        //    dungeonbigkeys[g]++;
        //    if(dungeonbigkeys[g] > 1)
        //        dungeonbigkeys[g] = 0;
            
        //
		//else if (corner == 3)
		//	dungeonbigkeys[h]++;
        //    if(dungeonbigkeys[h] > 1)
        //        dungeonbigkeys[h] = 0;
            
		}

	    
	

    else if((typeof items[item]) == "boolean"){
		
        items[item] = !items[item]; //for most items like hammer
    }
	///else if(item.substring(0,3) == "aga") //redundant
		 //	items[item]++;
       ///       if(items[item] > itemsMax[item])
         //       items[item] = itemsMin[item];
       ///      

        //    dungeons[10].isBeaten = !dungeons[10].isBeaten;
        //    if(dungeons[10].isBeaten)
        //        document.getElementById("bossMap"+10).className = "mapspan boss opened";
        //    else
        //        document.getElementById("bossMap"+10).className = "mapspan boss " + dungeons[10].isBeatable();
			
			

	///


	
    else{
        items[item]++; //this is for items like bow and glove
        if(items[item] > itemsMax[item]){
            items[item] = itemsMin[item];
        }
    }

    for(k=0; k<chests.length; k++){
        if(!chests[k].isOpened)
            document.getElementById(k).className = "mapspan chest " + chests[k].isAvailable();
    }
    for(k=0; k<dungeons.length; k++){
        if(!dungeons[k].isBeaten)
            document.getElementById("bossMap"+k).className = "mapspan boss " + dungeons[k].isBeatable();
        if(dungeonchests[k])
            document.getElementById("dungeon"+k).className = "mapspan dungeon " + dungeons[k].canGetChest();
    }

    updateGridItem(row,col);
}

function itemConfigClick (sender) {
    var item = sender.id;

    if (selected.item) {
        document.getElementById(selected.item).style.border = '0px';
        sender.style.border = '3px solid yellow';
        selected = {item:item};	
    } else if (selected.row !== undefined) {
        itemGrid[selected.row][selected.col]['item'].style.border = '1px solid white';
        var old = itemLayout[selected.row][selected.col];

        if (old == item) {
            selected = {};
            return;
        }

        if (item != 'blank') {
            sender.style.opacity = 0.25;

            var r,c;
            var found = false;
            for (r = 0; r < 9; r++) {  //was 8
                for (c = 0; c < 8; c++) {
                    if (itemLayout[r][c] == item) {
                        itemLayout[r][c] = 'blank';
                        updateGridItem(r, c);
                        found = true;
                        break;
                    }
                }

                if (found)
                    break;
            }
        }

        itemLayout[selected.row][selected.col] = item;
        updateGridItem(selected.row, selected.col);

        document.getElementById(old).style.opacity = 1;

        selected = {};
    } else {
        sender.style.border = '3px solid yellow';
        selected = {item:item}
    }
}

function populateMapdiv() {
    var mapdiv = document.getElementById('mapdiv');

    // Initialize all chests on the map
    for(k=0; k<chests.length; k++){
        var s = document.createElement('span');
        s.style.backgroundImage = 'url(images/poi.png)';
        s.style.color = 'black';
        s.id = k;
        s.onclick = new Function('toggleChest('+k+')');
        s.onmouseover = new Function('highlight('+k+')');
        s.onmouseout = new Function('unhighlight('+k+')');
        s.style.left = chests[k].x;
        s.style.top = chests[k].y;
        if(chests[k].isOpened)
            s.className = "mapspan chest opened";
        else
            s.className = "mapspan chest " + chests[k].isAvailable();
        mapdiv.appendChild(s);
    }

    // Dungeon bosses & chests
    for(k=0; k<dungeons.length; k++){
        var s = document.createElement('span');
        s.style.backgroundImage = 'url(images/' + dungeons[k].image + ')';
        s.id = 'bossMap' + k;
        s.onmouseover = new Function('highlightDungeon('+k+')');
        s.onmouseout = new Function('unhighlightDungeon('+k+')');
        s.style.left = dungeons[k].x;
        s.style.top = dungeons[k].y;
        s.className = "mapspan boss " + dungeons[k].isBeatable();
        mapdiv.appendChild(s);

        s = document.createElement('span');
        s.style.backgroundImage = 'url(images/poi.png)';
        s.id = 'dungeon' + k;
        s.onmouseover = new Function('highlightDungeon('+k+')');
        s.onmouseout = new Function('unhighlightDungeon('+k+')');
        s.style.left = dungeons[k].x;
        s.style.top = dungeons[k].y;
        s.className = "mapspan dungeon " + dungeons[k].canGetChest();
        mapdiv.appendChild(s);
    }
}

function populateItemconfig() {
    var grid = document.getElementById('itemconfig');

    var i = 0;

    var row;

    for (var key in items) {
        if (i % 10 == 0){
            row = document.createElement('tr');
            grid.appendChild(row);
        }
        i++;

        var rowitem = document.createElement('td');
        rowitem.className = 'corner';
        rowitem.id = key;
        rowitem.style.backgroundSize = '100% 100%';
        rowitem.onclick = new Function('itemConfigClick(this)');
        if((typeof items[key]) == "boolean"){
            rowitem.style.backgroundImage = "url(images/" + key + ".png)";
        }
        else{
            rowitem.style.backgroundImage = "url(images/" + key + itemsMax[key] + ".png)";
        }
        row.appendChild(rowitem);
    }		
}

function init() {
    createItemTracker(document.getElementById('itemdiv'));
    populateMapdiv();
    populateItemconfig();

    loadCookie();
    saveCookie();  
}