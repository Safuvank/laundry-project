interface ForgotPasswordTemplateProps {
  firstName: string;
  resetPasswordUrl: string;
}

export const forgotPasswordTemplate = ({
  firstName,
  resetPasswordUrl,
}: ForgotPasswordTemplateProps): string => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>

<body
  style="
    font-family: Arial, sans-serif;
    background:#f4f4f4;
    padding:40px;
  "
>

<div
  style="
    max-width:600px;
    margin:auto;
    background:white;
    padding:40px;
    border-radius:10px;
  "
>

<h2>Reset Your Password</h2>

<p>
Hello <strong>${firstName}</strong>,
</p>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to create a new password.
</p>

<a
href="${resetPasswordUrl}"

style="
display:inline-block;
padding:12px 24px;
background:#2563eb;
color:white;
text-decoration:none;
border-radius:6px;
margin-top:20px;
"
>

Reset Password

</a>

<p
style="
margin-top:30px;
font-size:14px;
color:#666;
"
>

This link will expire in 15 minutes.

</p>

<p
style="
font-size:14px;
color:#666;
"
>

If you didn't request a password reset,
you can safely ignore this email.

</p>

</div>

</body>

</html>
`;
};
