const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Set the Rasa server URL
const rasaURL = 'http://localhost:5005';

//ngrok http 3000
//node index.js

// Define a function to send a message to Rasa
/*async function sendMessagetotelegram(message) {
  try {
    const response = await axios.post(`${rasaURL}/webhooks/rest/webhook`, {
      sender: 'user', // You can customize the sender ID
      message: message,
      
    });
    s=""
    n=response.data
    for(let i=0;i<n.length;i++){
      s+=response.data[i]['text']
      s+="\n\n"
    }
    const rasaResponse= s || 'Sorry, I didn\'t understand that.'
    return rasaResponse;
  } catch (error) {
    console.error('Error connecting to Rasa:', error.message);
    return 'Error connecting to Rasa.';
  }
}*/

async function sendMessagetotelegram(message, chatId) {
  try {
    const response = await axios.post(`${rasaURL}/webhooks/rest/webhook`, {
      sender: 'user',
      message: removeStringBetweenCaret(message),
    });

    // Extract the text messages and buttons from Rasa's response
    var rasaMessages = response.data.map((item) => item.text);
    
    rasaMessages = rasaMessages.map((msg) => removeStringBetweenCaret(msg));

    const rasaButtons = response.data.map((item) => item.buttons);

    // Handle the Rasa response here
    const rasaResponse = rasaMessages.join('\n\n');

    // Check if there are buttons for the current message
    if (rasaButtons && rasaButtons.length > 0 && Array.isArray(rasaButtons[0])) {
      const buttons = rasaButtons[0].map((button) => [{ text: button }]);
      const replyMarkup = {
        keyboard: buttons,
        resize_keyboard: true,
        one_time_keyboard: true,
      };

      // Send the message with custom buttons
      bot.sendMessage(chatId, rasaResponse, { reply_markup: JSON.stringify(replyMarkup) });
    } else {
      // Send the message without buttons
      bot.sendMessage(chatId, rasaResponse);
    }

    return rasaResponse;
  } catch (error) {
    console.error('Error connecting to Rasa:', error.message);
    return 'Error connecting to Rasa.';
  }
}

function removeStringBetweenCaret(inputString) {
  // Find the indices of the first and last '^'
  const startIndex = inputString.indexOf('^');
  const endIndex = inputString.lastIndexOf('^');

  // Check if both '^' symbols are found
  if (startIndex !== -1 && endIndex !== -1) {
      // Remove the substring between the '^' symbols
      const resultString = inputString.substring(0, startIndex) + inputString.substring(endIndex + 1);
      return resultString;
  } else {
      // If '^' symbols are not found, return the original string
      return inputString;
  }
}

const botToken = '6685735454:AAGiL8CJqQYaTBpIPQHs--fcYPNQda79gBY';
const ngrokUrl = 'https://5ff0-117-240-115-98.ngrok-free.app'; // Replace with your ngrok URL
const botEndpoint = '/your-webhook-endpoint';

const bot = new TelegramBot(botToken, { webHook: true });

// Set the webhook URL
bot.setWebHook(`${ngrokUrl}${botEndpoint}`);

const app = express();
app.use(bodyParser.json());

// Handle incoming webhooks
app.post('/your-webhook-endpoint', async (req, res) => {
  try {
    // Check if req.body and req.body.message are defined
    if (req.body && req.body.message) {
      const chatId = req.body.message.chat?.id; // Use optional chaining to handle undefined
      const messageText = req.body.message.text;
      const firstName = req.body.message.from?.first_name;
      const lastName = req.body.message.from?.last_name;

      console.log(`${firstName} ${lastName}`);
      console.log(`Received message: ${messageText}`);

      // Send back the received text from Rasa with buttons
      await sendMessagetotelegram(messageText, chatId);

      res.sendStatus(200);
    } else {
      console.error('Error: Invalid message format');
      res.sendStatus(400); // Bad request status
    }
  } catch (error) {
    console.error('Error handling incoming webhook:', error.message);
    res.sendStatus(500); // Internal server error status
  }
});

// Start the express app
const port = 3000;
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
