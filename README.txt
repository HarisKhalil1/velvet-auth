🚀 QUICK DEPLOY INSTRUCTIONS

Method 1: Netlify Drag & Drop (EASIEST - 30 seconds!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open your folder in File Explorer:
   d:\smit\firebase\firebase class1 second work

2. Select ALL files (Ctrl+A)
   - index.html
   - styles.css
   - app.js
   - netlify.toml

3. Right-click → "Send to" → "Compressed (zipped) folder"
   Name it: velvet-auth.zip

4. Go to https://app.netlify.com/drop

5. Drag & drop the velvet-auth.zip file onto the page

6. DONE! Your site is live instantly!

Your site URL will look like: https://velvet-auth-abc123.netlify.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Method 2: Using Netlify CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Install Node.js from https://nodejs.org

2. Open PowerShell and run:
   npm install -g netlify-cli

3. Navigate to your project:
   cd "d:\smit\firebase\firebase class1 second work"

4. Deploy:
   netlify deploy --prod --dir .

5. Follow the prompts to create a site

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT: Firebase Setup After Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After deploying, add your Netlify URL to Firebase:

1. Go to https://console.firebase.google.com/project/hariskhan-b3b81/authentication/settings
2. Click "Authorized Domains" tab
3. Add your deployed URL (e.g., velvet-auth-abc123.netlify.app)
4. Click "Add Domain"

This is REQUIRED for Google/GitHub sign-in to work!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Your Velvet Auth system will be live!
   All features working: Email, Google, GitHub authentication
