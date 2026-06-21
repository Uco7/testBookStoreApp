import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'moderator'],
    default: 'manager'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Built-in Middleware: Pre-save hook to hash passwords automatically before saving to DB
// ✅ Modernized to rely cleanly on async/await instead of mixing next() callbacks
AdminSchema.pre('save', async function () {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return; // Exiting the async function automatically hands control back to Mongoose
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Throwing an error inside an async middleware tells Mongoose to abort the save sequence
    throw error; 
  }
});

// Instance Method: Helper function to compare passwords during login
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Admin', AdminSchema);