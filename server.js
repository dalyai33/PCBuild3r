'use strict'

//Express object
const express = require('express')

//body parser
const bodyParser = require('body-parser')

//cookie parser
const cookieParser = require('cookie-parser')

//handlebars object
const handlebars = require('express-handlebars')

//app object
const app = express()

//Set up handlebars engine
app.engine("handlebars", handlebars.engine({defaultLayout: "main"}))

//set the engine view
app.set("view engine", "handlebars")

//Port variable
const PORT = 4000

//Use the public folder
app.use(express.static('public'))

//Use body parser to parse request bodies
app.use(bodyParser.urlencoded({extended:true}))

//Use cookie-parser to handle cookies
app.use(cookieParser())

//file system module
const fs = require('fs')
const { error } = require('console')

//initialize declare profiles object
let profiles = {}

//Initialize profiles object

profiles = JSON.parse(fs.readFileSync('./profiles.json', 'utf-8'))


//declare pcBuilds object
let pcBuilds = {}

//initialize pcBuilds object
pcBuilds = JSON.parse(fs.readFileSync('./pcBuilds.json','utf-8'))

//Render the welcome page
app.get('/', (req,res)=>{
    res.status(200).render("welcome")
})

//When the user logs out
app.get('/logout',(req,res)=>{

    //clear the cookie
    res.clearCookie('username')

    //Render the welcome page
    res.status(200).render('welcome')
})

//Render the homepage
app.get('/home', (req,res)=>{

    //retrieve the username from the cookie
    const username = req.cookies.username

    //render the homepage with the cookie
    res.status(200).render('home',{username})
})

//Render the register page
app.get('/register', (req,res)=>{
    res.status(200).render("register")
})

//Render the edit profile page
app.get('/editProfile', (req,res)=>{
    //render the page
    res.status(200).render('editProfile')
})
//Render the add build page
app.get('/addBuild', (req,res)=>{
    //render the page
    res.status(200).render('newBuild')
})
//Render the view profile page
app.get('/viewProfile', (req,res)=>{
    //get username from cookie
    const username = req.cookies.username

    //Get the budget
    const budget = profiles[username].preferences.budget

    //Get intendedUse
    const intendedUse = profiles[username].preferences.intendedUse


    //Render the page
    res.status(200).render('profile', {username, budget, intendedUse, pcBuilds: pcBuilds[username] })
})


//renders sign in page
app.get('/signIn', (req,res)=>{
    res.status(200).render("signIn")
})

//register post and add user to profiles 
app.post('/register', (req,res)=>{
    //retrieve form results
    const formResults = req.body

    //username result
    const username = formResults.username

    //Password result
    const password = formResults.password

    //password confirmation result 
    const confirmPassword = formResults.confirmPassword

    //error string
    let err =""

    //check if the passwords match
    if(password !== confirmPassword){
        err += 'passwords do not match'
        //Send the register error page
        res.status(200).render("register", {error:err})
        return
    }

    //TODO use microservice A

    //Microservice request pipe
    const requestPath  =  "microserviceA/request.txt"

    //Microservice repsonse pipe
    const responsePath = "microserviceA/response.txt"

    //Create the command
    let requestCommand = "add\n"+username+"\n"+password
    //Make a request to the microservice
    fs.writeFileSync(requestPath, requestCommand);

    setTimeout(()=>{
        //Get the response
        fs.readFile(responsePath, 'utf-8', function(err,responseData){
            responseData = responseData.trim()
            let lines = responseData.split('\n').map(line=>line.trim())
        
            if(lines[0] === "error"){
                console.log(lines[1])
        
                res.status(200).render("register", {error: lines[1]})
                return;
            }

            //get user initial preferences and append to the profiles
            let budget = parseInt(formResults.cpu)
            budget += parseInt(formResults.ram)
            budget += parseInt(formResults.gpu)
            budget += parseInt(formResults.motherboard)
            budget += parseInt(formResults.case)
            budget += parseInt(formResults.storage)
            budget += parseInt(formResults.cooler)
            budget += parseInt(formResults.psu)
            const intendedUse = formResults.intendedUse


            //create new JSON object for the user
            var user = {
                password:password,
                preferences:{
                    budget:budget,
                    intendedUse:intendedUse
                }
            };

            //Add to the profiles object
            profiles[username] = user

            //write new object to the file
            fs.writeFile('./profiles.json', JSON.stringify(profiles,null,2), 'utf-8', (err)=>{
                if(err){
                    console.log(err)
                }
            })

            //redirect to signIn page
            res.status(200).render('signIn');
        

        })

    }, 500)


    
   

    //Monolithic design
    // //check if the username hasn't been used already
    // if(profiles[username]){
    //     err += ' username already in use'
    //     //Send the register error page
    //     res.status(200).render("register", {error:err})
    //     return
    // }


    
})

//Signs user in
app.post('/signIn', (req,res)=>{
    //Retrieve the input
    const formResults = req.body

    //Set username
    const username = formResults.username

    //set password
    const password = formResults.password


    //TODO use microservice A

    //Microservice request pipe
    const requestPath  =  "microserviceA/request.txt"

    //Microservice repsonse pipe
    const responsePath = "microserviceA/response.txt"

    //Create command
    let requestCommand = "login\n"+ username + "\n" + password

    //Write command to the requestPath
    fs.writeFileSync(requestPath, requestCommand)

    setTimeout(()=>{
        //Retrieve the response
        fs.readFile(responsePath, "utf-8", function (err, responseData){
            //trim the response
        responseData = responseData.trim()

        //Split the response into lines 
        let lines = responseData.split('\n').map(line=>line.trim())
        console.log(lines[0])
        //Check for log in error
        if(lines[0] === "error"){
            //Render the error
            res.status(200).render("signIn", {error: lines[1]})
            return;
        }


        //Set up the cookie and log the user in
        res.cookie('username', username, {maxAge:8640000, httpOnly:true})

        //render the homepage with the username
        res.status(200).render('home', {username})

        })
    }, 400)
    

   

    //Monolithic microservice A,
    // //Account doesn't exist
    // if(!profiles[username]){
    //     res.status(200).render('signIn', {error: `account does not exist`})
    //     return;
    // }

    // //Password was wrong
    // if(profiles[username].password !== password){
    //     res.status(200).render('signIn', {error: 'wrong password'})
    //     return;
    // }

    
})

//change budget by component
app.post('/editProfileByComponent', (req,res)=>{
    //Retrieve username from cookie
    const username = req.cookies.username
    //retrieve form results
    const formResults = req.body;

    //Calculate the budget
    let budget = parseInt(formResults.cpu)
    budget += parseInt(formResults.ram)
    budget += parseInt(formResults.gpu)
    budget += parseInt(formResults.motherboard)
    budget += parseInt(formResults.case)
    budget += parseInt(formResults.storage)
    budget += parseInt(formResults.cooler)
    budget += parseInt(formResults.psu)

    //Retrieve the intended use from radio button
    const intendedUse = formResults.intendedUse

    //Change budget
    profiles[username].preferences.budget = budget

    //Change intended use
    profiles[username].preferences.intendedUse = intendedUse

     //write new object to the file
     fs.writeFile('./profiles.json', JSON.stringify(profiles,null,2), 'utf-8', (err)=>{
        if(err){
            console.log(err)
        }
    })

    //redirect to home
    res.redirect('home')

})

//edit profile by total budget
app.post('/editProfileByTotal', (req,res)=>{
    //Retrieve username from cookie
    const username = req.cookies.username
    //retrieve form results
    const formResults = req.body;

    //retrieve the budget
    const budget = parseInt(formResults.budget)


    //Retrieve the intended use from radio button
    const intendedUse = formResults.intendedUse

    //Change budget
    profiles[username].preferences.budget = budget

    //Change intended use
    profiles[username].preferences.intendedUse = intendedUse

     //write new object to the file
     fs.writeFile('./profiles.json', JSON.stringify(profiles,null,2), 'utf-8', (err)=>{
        if(err){
            console.log(err)
        }
    })

    //redirect to home
    res.redirect('home')
})

//Add build form
app.post('/addBuild', (req,res) =>{
    //retrieve username
    const username = req.cookies.username
    
    //retrieve form submission
    const formResults = req.body

    //get the names of the parts
    const cpu = formResults.cpu
    const ram = formResults.ram
    const gpu = formResults.gpu
    const motherboard = formResults.motherboard
    const pcCase = formResults.case
    const storage = formResults.storage
    const cooler = formResults.cooler
    const psu = formResults.psu

    //get the intended use
    const intendedUse = formResults.intendedUse

    //get the total price of the build
    const price = parseInt(formResults.price)

    //get the name of the build
    const name = formResults.name

    //Create new json object
    var pcBuild = {
        name:name,
        components: {
            cpu:cpu,
            ram:ram,
            gpu:gpu,
            motherboard:motherboard,
            pcCase:pcCase,
            storage:storage,
            cooler:cooler,
            psu:psu
        },
        intendedUse:intendedUse,
        price:price
    };

    //Check if the array hasn't been initialized already
    if(!pcBuilds[username]){
        //create an array in pcBuilds to store the builds
        pcBuilds[username] = [];
    }
   

    //map the new object to the pcBuilds 
    pcBuilds[username].push(pcBuild)

    //write new object to the file
    fs.writeFile('./pcBuilds.json', JSON.stringify(pcBuilds,null,2), 'utf-8', (err)=>{
        if(err){
            console.log(err)
        }
    })


    //redirect to home
    res.redirect('home')
})

app.get('/viewMore', (req,res)=>{
    //Get username
    const username = req.cookies.username

    res.status(200).render('detailedBuilds', {pcBuilds: pcBuilds[username], components: pcBuilds[username].components})
})


//Listen to the port
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})