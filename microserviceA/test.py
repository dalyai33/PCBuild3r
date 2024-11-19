import os
import time


def addTest():
    print("Running add test...")
    with open("request.txt", "w") as file:
        file.write("add\n")
        file.write("user123\n")
        file.write("securepassword\n")
        file.write("1000\n")  # Total budget can also be a list or None
    print("Add test command written to request.txt.")


def readTest(password):
    print("Running read test...")
    with open("request.txt", "w") as file:
        file.write("read\n")
        file.write("user123\n")
        file.write(password+"\n")
    print("Read test command written to request.txt.")


def updateTest():
    print("Running update test...")
    with open("request.txt", "w") as file:
        file.write("update\n")
        file.write("user123\n")
        file.write("securepassword\n")
        file.write("{\"budget\":\"[500, 200, 300, 100, 50, 20, 15, 10]\"}\n")  # Budget as an array of numbers
    print("Update test command written to request.txt.")


def loginTest():
    print("Running login test...")
    with open("request.txt", "w") as file:
        file.write("login\n")
        file.write("user123\n")
        file.write("securepassword\n")
    print("Login test command written to request.txt.")


def removeTest():
    print("Running remove test...")
    with open("request.txt", "w") as file:
        file.write("remove\n")
        file.write("user123\n")
        file.write("securepassword\n")
    print("Remove test command written to request.txt.")


if __name__ == "__main__":
    time.sleep(3)
    print("Test service running...")
    addTest()
    time.sleep(3)
    readTest(password="securepassword")
    time.sleep(3)
    updateTest()
    time.sleep(3)
    readTest(password="securepassword")
    time.sleep(3)
    loginTest()
    time.sleep(3)
    removeTest()
    time.sleep(3)
    loginTest()
    time.sleep(3)
    print("All tests completed.")
