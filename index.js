document.addEventListener('DOMContentLoaded', async () => {
    const participantsDiv = document.getElementById('participants');
    const resultDiv = document.getElementById('result');

    async function fetchParticipants() {
        const response = await fetch('http://localhost:3000/participants');
        const data = await response.json();
        return data;
    }

    async function updateParticipants() {
        const { givers } = await fetchParticipants();
        participantsDiv.innerHTML = '';
        givers.forEach(name => {
            const participant = document.createElement('div');
            participant.textContent = name;
            participantsDiv.appendChild(participant);
        });
    }

    document.getElementById('santa-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();

        if (name) {
            try {
                const response = await fetch('http://localhost:3000/pair', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name })
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.error);
                    return;
                }

                const { recipient } = await response.json();
                const pairing = document.createElement('div');
                pairing.textContent = `${name} has drawn ${recipient}`;
                resultDiv.appendChild(pairing);

                await updateParticipants();
                document.getElementById('name').value = '';
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    document.getElementById('reset-button').addEventListener('click', async function() {
        try {
            const response = await fetch('http://localhost:3000/reset', {
                method: 'POST'
            });

            if (response.ok) {
                alert('Secret Santa lists have been reset.');
                await updateParticipants();
                resultDiv.innerHTML = '';
            } else {
                alert('Failed to reset Secret Santa lists.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    await updateParticipants();
});