import admin from "../config/firebase.js"; // Firebase setup
import sgMail from "@sendgrid/mail"; // Import SendGrid

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send emails
export const sendEmailsToCustomers = async (req, res) => {
  const firestore = admin.firestore();
  const today = new Date();
  const past7Days = new Date(today.setDate(today.getDate() - 7));

  try {
    const customersRef = firestore.collection("customers");
    const snapshot = await customersRef
      .where("latestVisitDate", ">=", past7Days)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No customers to email." });
    }

    const emailsSent = [];
    const emailPromises = [];

    snapshot.forEach((doc) => {
      const customer = doc.data();
      const msg = {
        to: customer.email, // Recipient email address
        from: process.env.EMAIL_USER, // Your verified sender email address
        subject: "We miss you!",
        text: `Hello ${customer.name},\n\nIt's been a while since your last visit! We hope to see you again soon.`,
      };

      // Send email and push the promise to the array
      emailPromises.push(
        sgMail
          .send(msg)
          .then((info) => {
            console.log("Email sent:", info);
            emailsSent.push(customer.email);
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          })
      );
    });

    // Wait for all email promises to resolve
    await Promise.all(emailPromises);

    res.status(200).json({ message: "Emails sent to customers.", emailsSent });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Error sending emails." });
  }
};
