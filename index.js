// Initial list of participants
const initialGivers = ["Cami", "Mati", "Anto", "Doc", "Leo", "Marghe", "Nunzio", "Silvia", "Angelica", "Virgi", "Marco", "Su", "Vera", "Dario", "Eleonora", "Dom", "Fra Calandro"];

// Load givers and receivers from localStorage or use the initial list
let givers = JSON.parse(localStorage.getItem('givers')) || [...initialGivers];
let receivers = JSON.parse(localStorage.getItem('receivers')) || [...initialGivers];
let participantsWhoPressed = JSON.parse(localStorage.getItem('participantsWhoPressed')) || [];

// Display participants
const participantsDiv = document.getElementById('participants');
givers.forEach(name => {
    const participant = document.createElement('div');
    participant.textContent = name;
    participantsDiv.appendChild(participant);
});

document.getElementById('santa-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();

    if (name) {
        // Check if participant has already drawn a name
        if (participantsWhoPressed.includes(name)) {
            alert(`${name}, you have already received your Secret Santa.`);
            return;
        }

        // Check if the name is in the givers list
        if (givers.includes(name)) {
            // Remove self from potential recipients
            const availableReceivers = receivers.filter(r => r !== name);
            if (availableReceivers.length === 0) {
                alert('No available recipients for ' + name);
                return;
            }

            // Assign a random recipient
            const randomIndex = Math.floor(Math.random() * availableReceivers.length);
            const recipient = availableReceivers[randomIndex];

            // Display the pairing
            const resultDiv = document.getElementById('result');
            const pairing = document.createElement('div');
            pairing.textContent = `${name} has drawn ${recipient}`;
            resultDiv.appendChild(pairing);

            // Update lists and localStorage
            givers = givers.filter(g => g !== name);
            participantsWhoPressed.push(name);

            localStorage.setItem('givers', JSON.stringify(givers));
            localStorage.setItem('participantsWhoPressed', JSON.stringify(participantsWhoPressed));

            // Remove the giver's name from the participants display
            const participantsElements = Array.from(participantsDiv.children);
            participantsElements.forEach(elem => {
                if (elem.textContent === name) {
                    participantsDiv.removeChild(elem);
                }
            });
        } else {
            alert(`${name} is not in the participant list or has already drawn a name.`);
            return;
        }

        // Clear the input field
        document.getElementById('name').value = '';
    }
});