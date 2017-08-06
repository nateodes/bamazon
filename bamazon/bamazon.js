var mysql = require("mysql");
var inquirer = require("inquirer");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "bulls123!",
  database: "bamazon_db"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {

  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // console.log("got into products db");
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "itemName",
          type: "list",
          message: "Here is our list of items",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].itemName);
            }
            return choiceArray;
          },
          message: "What item are you interested in?"
        },
        {
          name: "quantity",
          // type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].itemName === answer.itemName) {
            chosenItem = results[i];
          }
        }
        // console.log(chosenItem);
        // determine if bid was high enough
        if (chosenItem.stock > parseInt(answer.quantity)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock: chosenItem.stock - answer.quantity
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
             
            inquirer
              .prompt([
                
                {
                  type: "input",
                  message: "What is your name?",
                  name: "username"
                },
                {
                  type: "input",
                  message: "What is your address?",
                  name: "address"
                  
                },
                
                {
                  type: "password",
                  message: "Set your password",
                  name: "password"
                },
                {
                  type: "confirm",
                  message: "Are you sure:",
                  name: "confirm",
                  default: true
                },
                
                {
                  type: "list",
                  message: "Are you done shopping?",
                  choices: ["Yes", "No", "Not-sure"],
                  name: "done"
                }
              ])
              .then(function(response) {
                console.log("Inserting consumer info into database...\n");
                      var query = connection.query(
                        "INSERT INTO consumerInfo SET ?",
                        {
                          consumer: response.username,
                          address: response.address,
                          moneySpent: chosenItem.price * answer.quantity 
                        }
                        
                      )
                      // logs the actual query being run
                      console.log(query.sql);
                    

                
                if (response.choices === "Yes" || response.choices === "Not-sure") {
                  start();
                }
                else {
                  console.log("\nThat's okay " + response.username + ", come again when you have more money.\n");
                  console.log("Your credit card will be charged: " + chosenItem.price * answer.quantity + "$");
                  console.log("Your order will be shipped to: " + response.address);
                  connection.end();
              
                }
              })}
              )}
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("We don't have enough. Try a lower quantity...");
          start();
        }
      
  }
)})}
;
