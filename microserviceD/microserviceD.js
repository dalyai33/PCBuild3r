
const fs = require("fs").promises;
const pipe = "pipe.txt"

//monitors the pipe file and 
async function monitorFile() {
    while (true) {
        try {
            // Read the file content
            let data = await fs.readFile(pipe, "utf-8");

            //Tokenize the input by the space delimiter 
            data = data.trim().split(" ");

            //If a command is put in
            if (data[0] === "budget") {
                //TODO: take in the data from the json and find the pcs in the budget

                //Get budget from pipe
                const budget = data[1]

                //get .json file from the communication pipe
                const jsonFile  = data[2]

                //Parse the data from the json file
                const jsonData = require(jsonFile)

                //Array to keep track of the names of the builds 
                let budgetBuilds = []

                //iterate through each user
                for(const user in jsonData){
                    //iterate through each pc build of the current user
                    jsonData[user].forEach((build)=>{
                        if(build.price <= budget){
                            budgetBuilds.push(build)
                        }
                    })
                }

                if(budgetBuilds.length === 0){
                    await fs.writeFile(pipe, "NoneFound")
                }
                else{
                    budgetBuilds = JSON.stringify(budgetBuilds, null, 2) 

                    // Write to the file
                    await fs.writeFile(pipe, budgetBuilds)
                }

                

               
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
