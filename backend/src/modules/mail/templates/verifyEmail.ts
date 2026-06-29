interface VerifyEmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

export const verifyEmailTemplate = ({
  firstName,
  verificationUrl,
}: VerifyEmailTemplateProps): string => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Verify Email</title>
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

<h2>Welcome to FreshFold 👋</h2>

<p>
Hello <strong>${firstName}</strong>,
</p>

<p>
Thank you for creating your account.
</p>

<p>
Please verify your email address by clicking the button below.
</p>

<a
 href="${verificationUrl}"

 style="
 display:inline-block;
 margin-top:20px;
 background:#2563eb;
 color:white;
 text-decoration:none;
 padding:12px 24px;
 border-radius:6px;
 "
>

Verify Email

</a>

<p
 style="
 margin-top:40px;
 color:#666;
 font-size:14px;
 "
>

If you didn't create this account,
please ignore this email.

</p>

</div>

</body>

</html>
`;
};
