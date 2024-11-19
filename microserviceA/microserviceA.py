import json
import os
import hashlib
import time

userDataFile = "users.txt"
requestFile = "request.txt"
responseFile = "response.txt"

# Helper function to hash passwords
def hashPassword(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Helper function to load user data from file
def loadUsers():
    if os.path.exists(userDataFile):
        with open(userDataFile, "r") as file:
            return json.load(file)
    return {}

# Helper function to save user data to file
def saveUsers(users):
    with open(userDataFile, "w") as file:
        json.dump(users, file)

# Register a user with optional budget
def registerUser(username, password, budget=None):
    users = loadUsers()
    if username in users:
        return {"status": "error", "message": "Username already exists"}
    users[username] = {
        "password": hashPassword(password),
        "budget": budget
    }
    saveUsers(users)
    return {"status": "success", "message": "User successfully registered"}

# Remove a user
def removeUser(username, password):
    users = loadUsers()
    if username not in users or users[username]["password"] != hashPassword(password):
        return {"status": "error", "message": "Invalid username or password"}
    del users[username]
    saveUsers(users)
    return {"status": "success", "message": "User removed successfully"}

# Log in user
def loginUser(username, password):
    users = loadUsers()
    if username in users and users[username]["password"] == hashPassword(password):
        return {"status": "success", "message": "Login successful"}
    return {"status": "error", "message": "Invalid username or password"}

# Read all data for a user
def readUserData(username, password):
    users = loadUsers()
    if username not in users or users[username]["password"] != hashPassword(password):
        return {"status": "error", "message": "Invalid username or password"}
    userData = users[username]
    return {"status": "success", "data": userData}

# Update or add attributes for a user
def updateUser(username, password, updates):
    users = loadUsers()
    
    # Validate user existence and password
    if username not in users or users[username]["password"] != hashPassword(password):
        return {"status": "error", "message": "Invalid username or password"}
    
    # Handle username update if "username" is in updates
    if "username" in updates:
        newUsername = updates["username"]
        
        # Check if the new username already exists
        if newUsername in users:
            return {"status": "error", "message": "Username already exists"}
        
        # Move data to the new username and delete the old one
        users[newUsername] = users.pop(username)
        username = newUsername  # Update current username to reflect the change

    # Update other attributes dynamically
    for key, value in updates.items():
        if key == "password":  # Special handling for password hashing
            users[username][key] = hashPassword(value)
        elif key != "username":  # Skip "username" as it's already handled
            users[username][key] = value

    saveUsers(users)
    return {"status": "success", "message": "User data updated successfully"}

def processRequest(jsonResponceType):
    # Read request
    if os.path.exists(requestFile):
        with open(requestFile, "r") as file:
            lines = [line.strip() for line in file.readlines() if line.strip()]
        if len(lines) < 3:
            response = {"status": "error", "message": "Invalid request format"}
        else:
            command = lines[0].lower()
            username = lines[1]
            password = lines[2]
            updateData = None
            if len(lines) > 3:
                try:
                    updateData = json.loads(lines[3])
                except json.JSONDecodeError:
                    updateData = lines[3]
            
            if command == "add":
                budget = updateData if isinstance(updateData, (int, float, list)) else None
                response = registerUser(username, password, budget)
            elif command == "remove":
                response = removeUser(username, password)
            elif command == "login":
                response = loginUser(username, password)
            elif command == "read":
                response = readUserData(username, password)
            elif command == "update":
                if isinstance(updateData, str):  # Handle simple password update
                    response = updateUser(username, password, {"password": updateData})
                elif isinstance(updateData, dict):  # Handle dynamic updates
                    response = updateUser(username, password, updateData)
                else:
                    response = {"status": "error", "message": "Invalid update format"}
            else:
                response = {"status": "error", "message": "Unknown command"}
        # Write response to response file
        with open(responseFile, "w") as file:
            if jsonResponceType:
                json.dump(response, file)
            else:
                for x in response:
                    if isinstance(response[x], str):
                        file.write(str(response[x])+"\n")
                    if isinstance(response[x], dict):
                        for y in response[x]:
                            file.write(str(y)+":\n")
                            file.write(str(response[x][y])+"\n")
        os.remove(requestFile)

# Run the service in a loop
if __name__ == "__main__":
    print("User management service running...")
    while True:
        processRequest(jsonResponceType = False) # True = json False = plain text
        time.sleep(1)  # Wait before checking for the next request
