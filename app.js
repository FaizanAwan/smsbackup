/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/
require('dotenv-extended').load();

var spellService = require('./spell-service');


var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}



var documentDbOptions = {
    host: 'https://myndb.documents.azure.com:443/', 
    masterKey: 'tgLChriPoyX1XzRKNMEJR3weBrqcykiBYEKjDtEclhTWi9s3Os5b5CJGg5OcdjOXOEPQZYuTqTU0k35jcuK4gQ==', 
    database: 'botdocs',   
    collection: 'botdata'
};


var docDbClient = new botbuilder_azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, docDbClient);


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});
bot.set('storage', tableStorage);


// var mongo = require('mongodb');
// var version = mongo.version;

// console.log(version);


// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb+srv://Nayatel1234:5ia8h7JyGA2lEt4F@Cluster0.mongodb.net/test";
// MongoClient.connect(uri, function(err, client) {
//    const collection = client.db("test").collection("devices");
//    // perform actions on the collection object
//    client.close();
// });

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
// Add the recognizer to the bot
bot.recognizer(recognizer);






bot.dialog('sales',[
    function(session)
    {
        session.send('Your message has been forwarded to respective sales department')
        session.endDialog();
    }
]).triggerAction({
    matches:'sales'
});




bot.dialog('billing',[
    function(session)
    {
        session.send('Your message has been forwarded to respective billing department')
        session.endDialog();
    }
]).triggerAction({
    matches:'billing'
});

bot.dialog('technical',[
    function(session)
    {
        session.send('Your message has been forwarded to respective technical department')
        session.endDialog();
    }
]).triggerAction({
    matches:'technical'
});

bot.dialog('accesssngn',[
    function(session)
    {
        session.send('Your message has been forwarded to respective Access department')
        session.endDialog();
    }
]).triggerAction({
    matches:'accessngn'
});

bot.dialog('video',[
    function(session)
    {
        session.send('Your message has been forwarded to respective Video department')
        session.endDialog();
    }
]).triggerAction({
    matches:'video'
});
