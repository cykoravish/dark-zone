import { connectDB } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import bcryptjs from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return Response.json(
        { error: 'Admin account already exists. This endpoint can only be used once.' },
        { status: 403 }
      );
    }

    // Create new admin
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name: email.split('@')[0],
      role: 'admin',
      active: true,
    });

    await newAdmin.save();

    return Response.json(
      {
        message: 'Admin account created successfully',
        email,
        note: 'You can now login at /admin/login',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return Response.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
