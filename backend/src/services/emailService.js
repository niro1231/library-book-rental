const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendRentalConfirmation = async ({
  email,
  order,
}) => {
  const bookList = order.books
    .map(
      (item) =>
        `${item.book.title} - Format: ${item.format} - Quantity: ${item.quantity}`
    )
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Library Rental Confirmation",

    text: `
Your library rental has been confirmed.

Order ID: ${order._id}

Rental Date: ${order.orderDate.toLocaleDateString()}

Due Date: ${order.dueDate.toLocaleDateString()}

Rental Summary:

${bookList}

Total Fee: Rs. ${order.totalFee}

Thank you for using our library rental system.
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRentalConfirmation,
};