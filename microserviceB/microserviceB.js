
const fs = require("fs").promises;
const pipe = "pipe.txt"

let budget;

let totalCost = 0;

let intendedUse;


//Finds the best gpu for the budget
function gpuFinder(){

    //Get the json file for GPUs
    let gpuJson = require('./video-card.json')

    //Iterate through the JSON file
    for(const key in gpuJson){

        //Get the current gpu
        const gpu = gpuJson[key]

        //Calculate the range of GPU prices for the current budget
        if(gpu.price <= parseFloat(budget)/2.5 && gpu.price > parseFloat(budget)/4){
            
            //Update to the remaining budget
            budget-= gpu.price

            //Update to the total cost so far
            totalCost+=gpu.price

            return gpu.name + " "+ gpu.chipset
        }
    }
}


//Finds the CPU in the budget range and intendedUse
function cpuFinder(){

    //Use the cpu json file
    let cpuJSON = require('./cpu.json')

    //iterate through the json file
    for(const key in cpuJSON){

        //Get the current cpu object
        const cpu =cpuJSON[key]

        //Calculate the best cpu for the budget
        if(cpu.price <= budget / 3){
           
            //Gaming CPUs will use AMD
            if(intendedUse === "gaming"){
                
                if(cpu.socket === "AM5" ){
                     //amd cpu
                     budget-= cpu.price
                     totalCost += cpu.price

                     return cpu.name
                }   
               
            }
            //Productivity CPUs will use Intel
            else{
                if(cpu.socket === "LGA1700" ){
                    //intel cpu
                    budget-= cpu.price
                    totalCost += cpu.price

                    return cpu.name
               }   
            }
        }
    }

    
}

function moboFinder(){

    //Use the motherboard json file
    let moboJSON = require('./motherboard.json')

    //iterate through the json file
    for(const key in moboJSON){

        //Get the current motherboard
        const mobo = moboJSON[key]

        //Calculate the budget range for motherboards  and make sure they are the ATX formfactor
        if(mobo.price <= budget/3 && mobo.price > budget/6 && mobo.form_factor === "ATX"){
                
            //AMD socket
                if(mobo.socket === "AM5"){
                    if(intendedUse === "gaming"){
                        //intel cpu

                        //Update cost and budgt
                        budget-= mobo.price
                        totalCost += mobo.price
    
                        return mobo.name
                    }
                    
               }

               //Intel socket
               else {

                    if(intendedUse === "productivity"){
                        //intel cpu

                        //Update cost and budget
                        budget-= mobo.price
                        totalCost += mobo.price
    
                        return mobo.name
                    }
                    
               }
            }
           
        }
    }



function ramFinder(){
    //only use DDR5

    //get the json file
    let ramJSON = require('./memory.json')

    //iterate through the file
    for(const key in ramJSON){

        //get the current object
        const ram = ramJSON[key]

        //find the ram in the budget range
        if(ram.price <= budget/4 && ram.price > budget/8 && ram.speed[0] === 5){
             
            //intel cpu

            //update budget and total cost
             budget-= ram.price
             totalCost += ram.price

             return ram.name + " DDR"+ ram.speed[0]
        }
    }
}

function caseFinder(){
    //get case json file
    const caseJSON = require('./case.json')


    //iterate through file
    for(const key in caseJSON){

        //get the current object
        const pcCase = caseJSON[key]

        //find the case in the users budget
        if(pcCase.price <= budget/3 &&  pcCase.price > budget/6 && pcCase.type.includes('ATX') && !pcCase.type.includes('MicroATX')){
            
            //update budget and cost
            budget-= pcCase.price
            totalCost += pcCase.price

            return pcCase.name
        }
    }

    //only use atx

}

function psuFinder(){

    //use psu json file
    const psuJSON = require('./power-supply.json')

    //loop through file
    for(const key in psuJSON){

        //get current object
        const psu = psuJSON[key]

        //find the correct psu at the current budget
        if(psu.price <= budget/2 && psu.price > budget/4){
           
           //update budget and total cost
            budget-= psu.price
            totalCost += psu.price
            
            return psu.name
        }
    }
}

function ssdFinder(){
    //only use ssds

    //use ssd json file
    const ssdJSON = require('./internal-hard-drive.json')

    //iterate through file
    for(const key in ssdJSON){

        //get current object
        const ssd = ssdJSON[key]

        //FInd the correct ssd at the given price
        if(ssd.price <= budget/2 && ssd.price > budget/6 && ssd.type ==="SSD" ){
            
            //Convert to terabytes
            let size = parseFloat(ssd.capacity) / 1000;

            //update budget and total cost
            budget-= ssd.price
            totalCost += ssd.price
            
            //add unit to capacity based on the result of size
            if(size >= 1){
                return ssd.name + " "+ size +"TB"
            }else{
                return ssd.name + " "+ ssd.capacity + " GB"
            }
            
        }
    }
}



function coolerFinder(){
    //use cpu cooler json file
    const coolerJSON = require('./cpu-cooler.json')

    //iterate file
    for(const key in coolerJSON){

        //get the current cooler 
        const cooler = coolerJSON[key]

        //use the remaining budget to find the correct part
        if(cooler.price <= budget && cooler.price > budget/2){
            //update total cost and budget
            budget-= cooler.price
            totalCost += cooler.price
            return cooler.name
        }
    }

}

//monitors the pipe file and 
async function monitorFile() {

   
    while (true) {
        totalCost = 0
        budget = 0
        try {
            // Read the file content
            let data = await fs.readFile(pipe, "utf-8");

            //Tokenize the input by the space delimiter 
            data = data.trim().split(" ");

            //If a command is put in
            if (data[0] === "recommend") {

                //Set budget to first parameter in the command
                budget = data[1]

                //Set budget to the highest pc possible to recommend
                if(budget >6000 ){
                    budget = 6000
                }

                //Set intendedUse to second parameter in the command
                intendedUse = data[2]

                    //gpu
                    let result = gpuFinder()

                    //cpu
                    result = cpuFinder() + "\n" + result
                    
                    //motherboard
                    result = result + "\n" + moboFinder()

                    //ram 100ish
                    result = result + "\n" +ramFinder()
                    //case 100ish
                    result = result +"\n"+caseFinder()
                    
                    //psu 100ish

                    result = result + '\n'+psuFinder()
                    
                    //ssd 50ish
                    result = result + '\n' +ssdFinder()
                    
                    //cpu cooler 30-50
                    result = result +'\n' + coolerFinder()

                    console.log("result\n", result)

                    console.log("total cost", totalCost)
                    console.log("budget", budget)
                    
                    //Write result to the pipe
                    await fs.writeFile(pipe, "result\n"+"$"+totalCost+"\n"+result)


            }

            // Add a small delay to avoid CPU hogging
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error("Error accessing file:", error);
            break; // Exit loop on error
        }
    }
}

//Call the function
monitorFile();
