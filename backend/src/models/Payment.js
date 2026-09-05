const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  transactionId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  studentName: String, studentEmail: String, plan: String, amount: Number, date: String,
  status: { type: String, enum: ['Successful','Pending','Failed'], default: 'Pending' },
  paymentMethod: String, gatewayOrderId: String, gatewayPaymentId: String, gatewaySignature: String
}, { timestamps: true });
module.exports = mongoose.model('Payment', paymentSchema);
