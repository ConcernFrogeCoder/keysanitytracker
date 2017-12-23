//code written by https://www.twitch.tv/crossproduct/
//modified for keysanity by Yogidamonk

var defaultItemGrid = [
    [
        "bow",
		"boomerang",
        "hookshot",
        "bomb",
        "powdermushroom",
		"name0",
		"keys0",
		"chests0",
		],
    [
        "firerod",
        "icerod",
        "bombos",
        "ether",
        "quake",
		"name1",
		"keys1",
		"chests1",
	],
    [
        "lantern",
        "hammer",
        "shovelflute",
        "net",
        "book",
		"name2",
		"keys2",
		"chests2",
    ],
    [
        "bottle",
        "somaria",
        "byrna",
        "cape",
        "mirror",
		"name3",
		"keys3",
		"chests3",
	],
	[
        "boots",
        "glove",
        "flippers",	
        "moonpearl",
		"sword",
		"name4",
		"keys4",
		"chests4",
    ],
    [
        "boss8",
        "boss9",
        "",
		"burrito",
        "",
		"name5",
		"keys5",
		"chests5",
    ],
]

var items = {
    bow: 0,
	boomerang: 0,
    hookshot: false,
    bomb: false,
    powder: false,
    glove: 0,
    moonpearl: false,
	shovelflute: 0,
	powdermushroom: 0,
    sword: 0,
    tunic: 1,
    shield: 0,
    bombos: false,
    ether: false,
    quake: false,
    somaria: false,
    lantern: false,
    flute: false,
    book: false,
    boots: false,
    flippers: false,
    mirror: false,
    shovel: false,
    mushroom: false,
    powder: false,
    bottle:0,
    cape: false,
    icerod: false,
    byrna: false,
    net: false,
	firerod: false,
	hammer: false,
	//bigkey0: false,
	//bigkey1: false,
	//bigkey2: false,
	//bigkey3: false,
	//bigkey4: false,
	//bigkey5: false,
	//bigkey6: false,
	//bigkey7: false,
	//bigkey8: false,
	//bigkey9: false,
	//bigkey10: false,
	//bigkeymini: false,
	burrito: false,
	//lordyogi: true,
	name0: true, 
	name1: true, 
	name2: true, 
	name3: true, 
	name4: true, 
	name5: true, 
	//name6: true, 
	//name7: true, 
	//name8: true, 
	//name9: true, 
	//name10: true, 
	//name11: true, 
	keys0: true, 
	keys1: true, 
	keys2: true, 
	keys3: true, 
	keys4: true, 
	keys5: true, 
	//keys6: true, 
	//keys7: true, 
	//keys8: true, 
	//keys9: true, 
	//keys10: true, 
	//keys11: true, 
	chests0: true, 
	chests1: true, 
	chests2: true, 
	chests3: true, 
	chests4: true, 
	chests5: true, 
	//chests6: true, 
	//chests7: true, 
	//chests8: true, 
	//chests9: true, 
	//chests10: true, 
	//chests11: true, 
	
	//boss0: 1,
    //boss1: 1,
    // boss2: 1,
    // boss3: 1,
    // boss4: 1,
    // boss5: 1,
    // boss6: 1,
    // boss7: 1,
    boss8: 2,
    boss9: 2,
    //agahnim: 0,
	blank: false
};

var dungeonchests = {
    0: 6,
    1: 6,
    2: 6,
    3: 14,
    4: 10,
    5: 8,
    6: 8,
    7: 8,
    8: 8,
    9: 12, 
	10: 2,
	11: 27,
}

var dungeonsmallkeys = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0, 
	10: 0,  //aga1
	11: 0,  //GT
}

var dungeonbigkeys = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0, 
	10: 0, //aga1
	11: 0, //GT
} 





var itemsMin = {
    sword:0,
    //shield:0,
    //tunic:1,

    bottle:0,
    bow:0,
    boomerang:0,
    glove:0,
	shovelflute:0,
	powdermushroom: 0,

	//boss0: 1,
	//boss1: 1,
	//boss2: 1,
	//boss3: 1,
	//boss4: 1,
	//boss5: 1,
	//boss6: 1,
	//boss7: 1,
	//boss8: 1,
	//boss9: 1,
	//agahnim: 0,
};

var itemsMax = {
    sword:4,
    //shield:3,
    //tunic:3,

    bottle:4,
    bow:3,
    boomerang:3,
    glove:2,
	shovelflute:3,
	powdermushroom:3,
	
	//boss0: 2,
	//boss1: 2,
	//boss2: 2,

    //boss3: 2,
	//boss4: 2,
	//boss5: 2,
	//boss6: 2,
	//boss7: 2,
	//boss8: 2,
	//boss9: 2,
	//agahnim: 1,	
	//GT: 1,
	
	chest0: 6,
    chest1: 6,
    chest2: 6,
	chest3: 14,
    chest4: 10,
    chest5: 8,
    chest6: 8,
    chest7: 8,
    chest8: 8,
    chest9: 12,
	chest10: 2,
	chest11: 27,
	
	smallkey0: 0, //Eastern
	smallkey1: 1, //Desert
	smallkey2: 1, //Hera
	smallkey3: 6, //Pod
	smallkey4: 1, //Swamp
	smallkey5: 3, //SW
	smallkey6: 1, //TT
	smallkey7: 2, //IP
	smallkey8: 3, //MM
	smallkey9: 4, //Trock
	smallkey10: 2, //aga1
	smallkey11: 4, //GT
	
};