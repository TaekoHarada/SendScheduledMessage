import admin from "../config/firebase.js"; // Firebase setup
import sgMail from "@sendgrid/mail"; // Import SendGrid

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send emails
export const sendEmailsToCustomers = async (req, res) => {
  const firestore = admin.firestore();
  const today = new Date();
  const pastDays = new Date(today.setDate(today.getDate() - 10));

  try {
    const customersRef = firestore.collection("customers");
    const snapshot = await customersRef
      // .where("latestVisitDate", "<=", pastDays)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No customers to email." });
    }

    const emailsSent = [];
    const emailPromises = [];

    snapshot.forEach((doc) => {
      const customer = doc.data();
      console.log("Sending email to:", customer);
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

// Get all mail templates
export const getAllMailTemps = async (req, res) => {
  const firestore = admin.firestore();
  try {
    const snapshot = await firestore.collection("mails").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No mail templates found" });
    }

    const mailTemplates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(mailTemplates);
  } catch (error) {
    console.error("Error retrieving mail templates:", error);
    res.status(500).json({ error: "Failed to retrieve mail templates" });
  }
};

// Create a new mail template
export const createMailTemp = async (req, res) => {
  const firestore = admin.firestore();
  const { title, message } = req.body;

  try {
    console.log("Creating mail template:", req.body);
    const docRef = await firestore.collection("mails").add({
      title,
      message,
    });
    res
      .status(201)
      .json({ message: "Mail template created successfully", id: docRef.id });
  } catch (error) {
    console.error("Error creating mail template:", error);
    res.status(500).json({ error: "Failed to create mail template" });
  }
};

// Get a mail template by ID
export const getMailTempById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  try {
    const doc = await firestore.collection("mails").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Mail template not found" });
    }

    const mailTemplate = { id: doc.id, ...doc.data() };
    res.status(200).json(mailTemplate);
  } catch (error) {
    console.error("Error retrieving mail template:", error);
    res.status(500).json({ error: "Failed to retrieve mail template" });
  }
};

// Update a mail template by ID
export const updateMailTempById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  const { title, message } = req.body;

  try {
    const docRef = firestore.collection("mails").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Mail template not found" });
    }

    console.log("Updating mail template:", { title, message });
    await docRef.update({ title, message });
    res.status(200).json({ message: "Mail template updated successfully" });
  } catch (error) {
    console.error("Error updating mail template:", error);
    res.status(500).json({ error: "Failed to update mail template" });
  }
};

// Delete a mail template by ID
export const deleteMailTempById = async (req, res) => {
  const firestore = admin.firestore();
  const { id } = req.params;
  try {
    const docRef = firestore.collection("mails").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Mail template not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Mail template deleted successfully" });
  } catch (error) {
    console.error("Error deleting mail template:", error);
    res.status(500).json({ error: "Failed to delete mail template" });
  }
};
