"use server"

export async function submitContactForm(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return {
      success: false,
      error: "All fields are required",
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    }
  }

  try {
    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP

    // For demonstration, we'll simulate the email sending
    console.log("Contact form submission:", {
      from: `${firstName} ${lastName} <${email}>`,
      to: "sisko@duck.com",
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      message: message,
    })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, you would actually send the email here
    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: "sisko@duck.com",
      from: "noreply@siskocapital.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
    */

    return {
      success: true,
      message: "Thank you for your message. We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error sending contact form:", error)
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    }
  }
}
