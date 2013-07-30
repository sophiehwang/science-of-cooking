function HeatSolver(startingTemps){
    
    var tempArray = [startingTemps];
    var D = .14; // in units of mm^2/sec
    
    var timestep = 1;
    var spacestep = 0.1;
    
    var alpha = (D*timestep);
    var alphacn = (D*timestep)/(2);
    
    var laplacian = makeLaplacian();
    
    var cnLaplacian = makecnLaplacian();
    var invcn = numeric.inv(cnLaplacian);
    
    var nonconductive = [0,1];
    
    function get_tempArray(){
        return tempArray;
    }
    
    /*
        makes a laplacian matrix with 0s as the first and last rows because the boundary values (the temps of the pan and the air) do not change
        looks like: 
        0  0  0  0  0
        1 -2  1  0  0
        0  1 -2  1  0
        0  0  1 -2  1
        0  0  0  0  0 
        for a five-temperature probe system.
        
        this means that the next temperature of each point is simply determined by the difference between this point and its two neighbors
    */
    function makeLaplacian(){
        var num_of_measurements = tempArray[0].length;
        var newLaplacian = [];
        var firstRow = [];
        for(var i=0; i<num_of_measurements; i++){
            firstRow.push(0)
        }
        newLaplacian.push(firstRow);
    //    var lastrow = Array.prototype.slice.call(firstRow)
    //    lastrow.reverse();
        for(var i=1; i<num_of_measurements-1; i++){
            var newRow = [];
            for(var j=1; j<i; j++){
                newRow.push(0);
            }
            newRow.push(1*alpha,-2*alpha,1*alpha);
            for(var j= i+2; j<num_of_measurements; j++){
                newRow.push(0);
            }
            newLaplacian.push(newRow);
        }
        newLaplacian.push(firstRow);
        
        return newLaplacian;
    }
    
    function makecnLaplacian(){
        var num_of_measurements = tempArray[0].length;
        var newLaplacian = [];
        var firstRow = [1];
        for(var i=1; i<num_of_measurements; i++){
            firstRow.push(0)
        }
        newLaplacian.push(firstRow);
        var lastrow = Array.prototype.slice.call(firstRow)
        lastrow.reverse();
        
        for(var i=1; i<num_of_measurements-1; i++){
            var newRow = [];
            for(var j=1; j<i; j++){
                newRow.push(0);
            }
            newRow.push(-1*alphacn,(1+2*alphacn),-1*alphacn);
            for(var j= i+2; j<num_of_measurements; j++){
                newRow.push(0);
            }
            newLaplacian.push(newRow);
        }
        newLaplacian.push(lastrow);
        
        return newLaplacian;
    }
    /*
        uses the explicit form of Euler's method to calculate the next time step's temperatures based on the most current temperatures
    */
    function calculate_next_explicit(){
        var currentTemps = tempArray[tempArray.length-1];
        var dudt = numeric.dotMV(laplacian,currentTemps);
    //    dudt = numeric.neg(dudt);
        var nextTemps = numeric.add(dudt,currentTemps);
        tempArray.push(nextTemps)
    }
    
    function calculate_next_cn(cnVector){
        var nextTemps = numeric.dotMV(invcn,cnVector);
        tempArray.push(nextTemps);
    }
    
    function calculate_next_n_cn(n){   
        for(var i=0; i<n; i++){
            var cnVector = make_crank_nicolson_vector();
            calculate_next_cn(cnVector);
        }
    }
    
    function calculate_next_n_exp(n){   
        for(var i=0; i<n; i++){
            calculate_next_explicit();
        }
    }
    
    function sixty_graph_arrays(time_top_bottom){
        var grapharray = [];
        var graphlabels = [];
        var temperatures = [];
		var count=0;
        
        var lastTime = time_top_bottom[time_top_bottom.length-1][0];
        
        for(var j=0; j<time_top_bottom.length; j++){
            var thisTime = time_top_bottom[j][0];
            var nextTime;
            if(j==time_top_bottom.length-1){
                nextTime= lastTime;
            }
            else{
                nextTime = time_top_bottom[j+1][0];
            }
            
            //set the conductivity of air to zero
            if(time_top_bottom[j][1] == 23){
                nonconductive[1] = 1;
            }
            else{
                nonconductive[1] = 0;
            }
            if(time_top_bottom[j][2] == 23){
                nonconductive[0] = 1;
            }
            else{
                nonconductive[0] = 0;
            }

            change_temp(time_top_bottom[j][1], time_top_bottom[j][2])
           
            
            for(var i=thisTime; i<nextTime; i+=timestep){
                if(i==thisTime){
                    temperatures.push([time_top_bottom[j][1], time_top_bottom[j][2]])
                }
                else{
                    temperatures.push(temperatures[temperatures.length-1]);
                }
                var cnVector = make_crank_nicolson_vector();
                calculate_next_cn(cnVector);                
            }
        }
 var arrays = tempArray.length-1;
var len= tempArray[0].length;
        var step = arrays/60.0;
        for(var i=0; i<60*step; i+=step){

            grapharray.push(tempArray[parseInt(i)].slice(1,len-1));
			
			if(temperatures[parseInt(i)][0] > 25 && temperatures[parseInt(i)][1] > 25){
				
                graphlabels.push([count,0,temperatures[parseInt(i)][0]]);
				graphlabels.push([count,1,temperatures[parseInt(i)][1]]);
			
            }
            else if(temperatures[parseInt(i)][0] > 25){
		
                graphlabels.push([count,0,temperatures[parseInt(i)][0]]);
			
            }
            else if(temperatures[parseInt(i)][1] > 25){
			
                graphlabels.push([count,1,temperatures[parseInt(i)][1]]);
			
            }
            else{
//              	graphlabels.push([count,0,temperatures[parseInt(i/60)][1]]);
            }
       

            count++;
			
        }
        
        
        return {temps: grapharray, points: graphlabels}

    }
    
    function change_temp(toptemp,bottomtemp){
        tempArray[tempArray.length-1][0] = bottomtemp;
        tempArray[tempArray.length-1][tempArray[0].length-1] = toptemp;
    }
    
    function flip(){
        change_temp(tempArray[tempArray.length-1][0], tempArray[tempArray.length-1][tempArray[0].length-1]);
//        var top = tempArray[tempArray.length-1][tempArray[0].length-1];
//        var bottom = tempArray[tempArray.length-1][0];
//        tempArray[tempArray.length-1][0] = top;
//        tempArray[tempArray.length-1][tempArray[0].length-1] = bottom;
        nonconductive.reverse();
    }
    
    function fifteen_flip_method(duration){
        for(var i=0; i<duration; i++){
            var cnVector = make_crank_nicolson_vector();
            calculate_next_cn(cnVector);
            if(i%150 == 0){
                flip();
            }
        }
    }
    
    function make_crank_nicolson_vector(){
        var currentTemps = tempArray[tempArray.length-1];
        var cnVector = [];
        
        for(var i=0; i<currentTemps.length; i++){
            if(i==0 && nonconductive[0] == 0){
                cnVector.push(currentTemps[0]);//((1+2*alpha)*currentTemps[i]-alpha*(currentTemps[i+1]));
            }
            else if(i==0 && nonconductive[0] == 1){
                cnVector.push(alphacn*currentTemps[i]+(1-2*alphacn)*currentTemps[i+1]+alphacn*(currentTemps[i+2]));//((1+2*alpha)*currentTemps[i]-alpha*(currentTemps[i+1]));
            }
            else if(i==currentTemps.length-1 && nonconductive[1] == 1){
                cnVector.push(cnVector[i-1]);//(-alpha*currentTemps[i-1]+(1+2*alpha)*currentTemps[i]);
            }
            else if(i==currentTemps.length-1 && nonconductive[1] == 0){
                cnVector.push(currentTemps[i]);
            }
            else{
                cnVector.push(alphacn*currentTemps[i-1]+(1-2*alphacn)*currentTemps[i]+alphacn*(currentTemps[i+1]));
            }
        }
        return cnVector;
    }
 
    return {get_tempArray: get_tempArray, make_crank_nicolson_vector: make_crank_nicolson_vector, makecnLaplacian: makecnLaplacian, makeLaplacian: makeLaplacian, fifteen_flip_method: fifteen_flip_method, flip: flip, change_temp: change_temp, calculate_next_cn: calculate_next_cn, calculate_next_explicit: calculate_next_explicit, calculate_next_n_cn: calculate_next_n_cn, sixty_graph_arrays: sixty_graph_arrays, calculate_next_n_exp: calculate_next_n_exp}
}

