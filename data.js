var tempScale={
			   "Steak":
                [{'info':'No protein denaturization below 40\xB0 C Raw','position':6},
                {'info':'Myosin breaks down 40-55\xB0 C Rare','position':5},
                {'info':'Glycogen breaks down 55-60\xB0 C Medium Rare','position':4},
                {'info':'Myoglobin denatures 60-70\xB0 C Medium','position':3},
                {'info':'Actin denatures 70-120\xB0 C Well','position':2},
                {'info':'Browning reactions occur 120-180\xB0 C','position':1},
				{'info':'Charring at 180+\xB0 C','position':0}],

              "Tuna":

                [{'info':'No protein denaturization below 40\xB0 C','position':6},
                {'info':'Myosin breaks down 40-50\xB0 C','position':5},
                {'info':'Myocommata begins to rupture 50\xB0 C','position':4},
                {'info':'Myoglobin denatures 60-70\xB0 C','position':3},
                {'info':'Actin denatures 70\xB0 C','position':2},
                {'info':'Fibers begin to disintegrate 90+\xB0 C+','position':1},
				{'info':'Charring at 180+\xB0 C+','position':0}],
			   "Turkey":
                 [{'info':'No protein denaturization below 40\xB0 C Raw','position':6},
                {'info':'Myosin breaks down 40-55\xB0 C Rare','position':5},
                {'info':'Glycogen breaks down 55-60\xB0 C Medium Rare','position':4},
                {'info':'Myoglobin denatures 60-70\xB0 C Medium','position':3},
                {'info':'Actin denatures 70-120\xB0 C Well','position':2},
                {'info':'Browning reactions occur 120-180\xB0 C','position':1},
				{'info':'Charring at 180+\xB0 C','position':0}]
              };

//color
var color = {
     
	"Steak":
            d3.scale.linear()
            .domain([0,1,3,6,9,11,12])
            .range(['black','#693d34' ,"#FFC4C5","#8B0000","#FFC4C5",'#693d34','black']),
        "Tuna":
            d3.scale.linear()
            .domain([0,1,3,6,9,11,12])
            .range(['black','#692901','#FAEEE6','#FA3491', '#FAEEE6','#692901','black']),

        "Turkey":
            d3.scale.linear()
            .domain([0,1,3,6,9,11,12])
            .range(['black','#692901','#FAEEE6','#B56980','#FAEEE6','#692901'],'black')
};
//boundaries where color change occurs
var boundaries= {"Steak":[180,120,70,60,55,40], "Tuna": [180,90,70,60,50,40],"Turkey":[180,120,70,60,55,40]};
