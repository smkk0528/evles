/**
 * @author Porker Pulgin
 */

$.extend({
	mess : function(porker) {
		var indexArray = [], result = [];
		for (var i = 0; i < porker.data.length; i++) {
			indexArray[i] = i;
		}

		var _floor = Math.floor, _random = Math.random, i = indexArray.length, j, arri;
		while (i > 1) {
			j = _floor(_random() * i);
			i--;
			if (i !== j) {
				arri = indexArray[i];
				indexArray[i] = indexArray[j];
				indexArray[j] = arri;
			}
		}

		for (var i = 0; i < indexArray.length; i++) {
			result[i] = porker.data[indexArray[i]];
		}

		return result;
	},
	porkerAsc : function(porkerArray) {
		var temp, j;
		for (var i = 1; i < porkerArray.length; i++) {
			if ((porkerArray[i].num) < (porkerArray[i - 1].num)) {
				temp = porkerArray[i];
				j = i - 1;
				do {
					porkerArray[j + 1] = porkerArray[j];
					j--;
				} while (j>-1 && (temp.num) < (porkerArray[j].num));
				porkerArray[j + 1] = temp;
			}
		}
		return porkerArray;
	},
	porkerDesc : function(porkerArray) {
		var temp, j;
		for (var i = 1; i < porkerArray.length; i++) {
			if ((porkerArray[i].num) > (porkerArray[i - 1].num)) {
				temp = porkerArray[i];
				j = i - 1;
				do {
					porkerArray[j + 1] = porkerArray[j];
					j--;
				} while (j>-1 && (temp.num) > (porkerArray[j].num));
				porkerArray[j + 1] = temp;
			}
		}
		return porkerArray;
	},
	minePorker : function(porkerArr, fapaiIndex, fapaiLength, paiLength){
		var result = [],length=(paiLength>porkerArr.length?porkerArr.length:paiLength),count = fapaiLength;
		for(var i = fapaiIndex;i<length;i++){
			if(count === 0){
				count = fapaiLength;
			}
			if(count == fapaiLength){
				result[result.length] = porkerArr[i];
			}
			count--;
		}
		return result;
	}
});

var NormalPorker = {
	// type:1 王   2 黑  3 红  4 梅  5 方块
	back : {
		sx : 0,
		sy : 250,
		sw : 40,
		sh : 61,
	},
	data : [{
		num : 100,
		color : 'red',
		cardType : 1,
		sx : 42,
		sy : 250,
		sw : 40,
		sh : 61,
	}, {
		num : 99,
		color : 'black',
		cardType : 1,
		sx : 84,
		sy : 250,
		sw : 40,
		sh : 61,
	}, {
		num : 1,
		color : 'black',
		cardType : 2,
		sx : 0,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 2,
		color : 'black',
		cardType : 2,
		sx : 42,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 3,
		color : 'black',
		cardType : 2,
		sx : 84,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 4,
		color : 'black',
		cardType : 2,
		sx : 126,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 5,
		color : 'black',
		cardType : 2,
		sx : 168,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 6,
		color : 'black',
		cardType : 2,
		sx : 210,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 7,
		color : 'black',
		cardType : 2,
		sx : 252,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 8,
		color : 'black',
		cardType : 2,
		sx : 294,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 9,
		color : 'black',
		cardType : 2,
		sx : 336,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 10,
		color : 'black',
		cardType : 2,
		sx : 378,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 11,
		color : 'black',
		cardType : 2,
		sx : 420,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 12,
		color : 'black',
		cardType : 2,
		sx : 462,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 13,
		color : 'black',
		cardType : 2,
		sx : 504,
		sy : 0,
		sw : 40,
		sh : 61,
	}, {
		num : 1,
		color : 'red',
		cardType : 3,
		sx : 0,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 2,
		color : 'red',
		cardType : 3,
		sx : 42,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 3,
		color : 'red',
		cardType : 3,
		sx : 84,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 4,
		color : 'red',
		cardType : 3,
		sx : 126,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 5,
		color : 'red',
		cardType : 3,
		sx : 168,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 6,
		color : 'red',
		cardType : 3,
		sx : 210,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 7,
		color : 'red',
		cardType : 3,
		sx : 252,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 8,
		color : 'red',
		cardType : 3,
		sx : 294,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 9,
		color : 'red',
		cardType : 3,
		sx : 336,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 10,
		color : 'red',
		cardType : 3,
		sx : 378,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 11,
		color : 'red',
		cardType : 3,
		sx : 420,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 12,
		color : 'red',
		cardType : 3,
		sx : 462,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 13,
		color : 'red',
		cardType : 3,
		sx : 504,
		sy : 63,
		sw : 40,
		sh : 61,
	}, {
		num : 1,
		color : 'black',
		cardType : 4,
		sx : 0,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 2,
		color : 'black',
		cardType : 4,
		sx : 42,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 3,
		color : 'black',
		cardType : 4,
		sx : 84,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 4,
		color : 'black',
		cardType : 4,
		sx : 126,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 5,
		color : 'black',
		cardType : 4,
		sx : 168,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 6,
		color : 'black',
		cardType : 4,
		sx : 210,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 7,
		color : 'black',
		cardType : 4,
		sx : 252,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 8,
		color : 'black',
		cardType : 4,
		sx : 294,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 9,
		color : 'black',
		cardType : 4,
		sx : 336,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 10,
		color : 'black',
		cardType : 4,
		sx : 378,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 11,
		color : 'black',
		cardType : 4,
		sx : 420,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 12,
		color : 'black',
		cardType : 4,
		sx : 462,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 13,
		color : 'black',
		cardType : 4,
		sx : 504,
		sy : 188,
		sw : 40,
		sh : 61,
	}, {
		num : 1,
		color : 'red',
		cardType : 5,
		sx : 0,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 2,
		color : 'red',
		cardType : 5,
		sx : 42,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 3,
		color : 'red',
		cardType : 5,
		sx : 84,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 4,
		color : 'red',
		cardType : 5,
		sx : 126,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 5,
		color : 'red',
		cardType : 5,
		sx : 168,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 6,
		color : 'red',
		cardType : 5,
		sx : 210,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 7,
		color : 'red',
		cardType : 5,
		sx : 252,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 8,
		color : 'red',
		cardType : 5,
		sx : 294,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 9,
		color : 'red',
		cardType : 5,
		sx : 336,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 10,
		color : 'red',
		cardType : 5,
		sx : 378,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 11,
		color : 'red',
		cardType : 5,
		sx : 420,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 12,
		color : 'red',
		cardType : 5,
		sx : 462,
		sy : 125,
		sw : 40,
		sh : 61,
	}, {
		num : 13,
		color : 'red',
		cardType : 5,
		sx : 504,
		sy : 125,
		sw : 40,
		sh : 61,
	}]
};
