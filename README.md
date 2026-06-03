# Yoco to Xperiencify Webhook

Automatically adds students to your Xperiencify course when they pay via Yoco.

## Setup
1. Add your keys in Vercel Environment Variables:
   - `e75e6e37d57bb510d1144bfadb5e6f2cf58238ca`
   - `1009590` (optional)

2. Deploy on Vercel.

3. Use this URL in Yoco Webhooks:
   `https://your-project.vercel.app/api/yoco-webhook`

When creating Yoco payment, pass metadata like: `{ "course_id": "12345" }`
