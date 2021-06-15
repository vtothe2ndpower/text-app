const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Initialize Nexmo
const nexmo = new Nexmo({
    apiKey: 'c97e7cb9',
    apiSecret: 'a416rBiN8yEhjz8p'
}, { debug: true });

// Initialize app
const app = express();

// Template Engine Setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public Folder Setup
app.use(express.static(__dirname + '/public'))

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// Catch Form Submit

app.post('/', (req, res) => {

    const number = req.body.number;
    const message = req.body.message;

    nexmo.message.sendSms(
        '18553987694', number, message, { type: 'unicode' },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // Get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                // Emit to the client
                io.emit('smsStatus', data);
            }
        }
    )
});

// Define Port
const PORT = 3000;

// Start Server
const server = app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected!');
    io.on('disconnect', () => {
        console.log('Disconnected!');
    })
});
