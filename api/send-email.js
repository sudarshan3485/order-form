export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Collect form data sent from the frontend
        const { name, email, phone, company, items, message } = req.body;

        // Construct HTML for the email
        const itemsHtml = items.map(item => 
            `<li>Color: ${item.color}, Size: ${item.size}, Qty: ${item.quantity}</li>`
        ).join('');

        const emailHtml = `
            <h2>New Order Inquiry for Nehru Jacket</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <h3>Order Details:</h3>
            <ul>${itemsHtml}</ul>
            <p><strong>Additional Message:</strong><br/>${message || 'None'}</p>
        `;

        // Call Resend API using fetch (so no extra npm packages are required)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Acme <onboarding@resend.dev>', // Change this to your verified domain if you have one
                to: ['sales@thehemploom.com'], // Change this to your email address where you want to receive leads
                subject: 'New Nehru Jacket Order Inquiry!',
                html: emailHtml
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send email: ${errorText}`);
        }

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
