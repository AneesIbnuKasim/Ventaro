const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
    },
  phone: { 
    type: String, 
    required: true 
    },
  pincode: { 
    type: String, 
    required: true 
    },
  state: { 
    type: String, 
    required: true 
    },
  city: { 
    type: String, 
    required: true 
    },
  addressLine: { 
    type: String, 
    required: true 
    },
  label: { 
    type: String, 
    enum: ["Home", "Work", "Other"], 
    default: "Home" 
    },

  isDefault: { 
    type: Boolean, 
    default: false 
    }
    }, { timestamps: true });

module.exports = mongoose.model('Address',addressSchema)