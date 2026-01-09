import jwt from 'jsonwebtoken';

const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export default generateToken;
