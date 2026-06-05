import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

function signToken(userId: string, role: string): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign({ userId, role }, secret, { expiresIn: TOKEN_EXPIRY });
}

function sanitizeUser(user: IUser) {
  return { _id: user._id, name: user.name, email: user.email, role: user.role };
}

interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
  role?: 'student' | 'instructor';
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body as RegisterBody;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'name, email, password, and role are required' });
    return;
  }
  if (role !== 'student' && role !== 'instructor') {
    res.status(400).json({ error: 'role must be student or instructor' });
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user._id.toString(), user.role);

  res.status(201).json({ data: { user: sanitizeUser(user), token } });
}

interface LoginBody {
  email?: string;
  password?: string;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken(user._id.toString(), user.role);
  res.json({ data: { user: sanitizeUser(user), token } });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ data: user });
}
