import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('✅ Yoco Webhook Received:', JSON.stringify(body, null, 2));

    // Check for successful payment
    const isSuccessful = 
      body.event === 'payment.success' || 
      body.status === 'successful' || 
      body?.data?.status === 'successful';

    if (!isSuccessful) {
      return NextResponse.json({ message: 'Not a successful payment' });
    }

    // Extract customer information
    const email = body.customer?.email || body.email || body?.data?.customer?.email;
    const firstName = body.customer?.first_name || body.first_name || body?.data?.customer?.first_name || 'Student';
    const lastName = body.customer?.last_name || body.last_name || body?.data?.customer?.last_name || '';

    // Get course ID from metadata or environment variable
    const courseId = body.metadata?.course_id || body.course_id || process.env.DEFAULT_COURSE_ID;

    if (!email) {
      return NextResponse.json({ error: 'No email received from Yoco' }, { status: 400 });
    }
    if (!courseId) {
      return NextResponse.json({ error: 'No course_id found. Please add it in metadata or set DEFAULT_COURSE_ID' }, { status: 400 });
    }

    // Add student to Xperiencify
    const xpResponse = await fetch(
      `https://api.xperiencify.io/api/public/student/create/?api_key=${process.env.XP_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: email,
          first_name: firstName,
          last_name: lastName,
          course_id: courseId,
        }),
      }
    );

    const xpResult = await xpResponse.json();
    console.log('Xperiencify Response:', xpResult);

    return NextResponse.json({ 
      success: true, 
      message: 'Student successfully added to Xperiencify course' 
    });

  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
