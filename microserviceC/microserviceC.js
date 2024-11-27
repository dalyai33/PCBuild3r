
const fs = require("fs").promises;
const pipe = "pipe.txt"

//monitors the pipe file and 
async function monitorFile() {
    while (true) {
        try {

            //Request: image cpuBrand gpuBrand

            // Read the file content
            let data = await fs.readFile(pipe, "utf-8");

            //Tokenize the input by the space delimiter 
            data = data.trim().split(" ");

            //If a command is put in
            if (data[0] === "image") {
                //TODO: take in the data from the json and find the pcs in the budget

                //Get cpu brand from pipe
                const cpuBrand = data[1]

                //get gpu brand from pipe
                const gpuBrand  = data[2]

                //Initialize result 
                let result = "result";

                //If cpuBrand is intel
                if(cpuBrand === "Intel"){
                    result = result + " /images/intel-cpu.jpg"
                }
                else if(cpuBrand == "AMD")
                //Brand is AMD
                {
                    result = result + " /images/amd-cpu.png"
                }

                //if gpuBrand is Nvidia
                if(gpuBrand === "Nvidia"){
                    result = result + " /images/nvidia-gpu.jpg"
                }
                else if(gpuBrand == "AMD")
                //brand is amd
                {
                    result = result + " /images/amd-gpu.png"
                }

            
                //Write to pipe
                await fs.writeFile(pipe, result)
                

                

               
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
