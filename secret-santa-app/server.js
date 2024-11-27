const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const initialGivers = ["Cami", "Mati", "Anto", "Doc", "Leo", "Marghe", "Nunzio", "Silvia", "Angelica", "Virgi", "Marco", "Su", "Vera", "Dario", "Eleonora", "Dom", "Fra Calandro"];
let givers = [...initialGivers];
let receivers = [...initialGivers];
let participantsWhoPressed = [];
let assignedRecipients = [];

app.get('/participants', (req, res) => {
    res.json({ givers, receivers, participantsWhoPressed, assignedRecipients });
});

app.post('/pair', (req, res) => {
    const { name } = req.body;

    if (participantsWhoPressed.includes(name)) {
        return res.status(400).json({ error: `${name}, you have already received your Secret Santa.` });
    }

    if (!givers.includes(name)) {
        return res.status(400).json({ error: `${name} is not in the participant list or has already drawn a name.` });
    }

    const availableReceivers = receivers.filter(r => r !== name && !assignedRecipients.includes(r));
    if (availableReceivers.length === 0) {
        return res.status(400).json({ error: 'No available recipients for ' + name });
    }

    const randomIndex = Math.floor(Math.random() * availableReceivers.length);
    const recipient = availableReceivers[randomIndex];

    givers = givers.filter(g => g !== name);
    participantsWhoPressed.push(name);
    assignedRecipients.push(recipient);

    res.json({ name, recipient });

    // Optionally, you can save the state to a file or database here
});

app.post('/reset', (req, res) => {
    givers = [...initialGivers];
    receivers = [...initialGivers];
    participantsWhoPressed = [];
    assignedRecipients = [];
    res.json({ message: 'Secret Santa lists have been reset.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});