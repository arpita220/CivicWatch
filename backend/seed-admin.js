const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured.');
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) {
    throw new Error('Set ADMIN_PASSWORD to a strong value of at least 16 characters.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'admin@civicwatch.com';
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      throw new Error(`An account already exists for ${email} but is not an administrator. Resolve it manually.`);
    }
    console.log(`Administrator account ${email} already exists; its password was not changed.`);
    return;
  }

  if (await User.exists({ role: 'admin' })) {
    throw new Error(`An administrator already exists under a different email. Resolve it before creating ${email}.`);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({
    name: 'Municipal Admin',
    email,
    password: hashedPassword,
    role: 'admin'
  });
  console.log(`Administrator account ${email} created.`);
};

seedAdmin()
  .catch((error) => {
    console.error('Error seeding admin:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
