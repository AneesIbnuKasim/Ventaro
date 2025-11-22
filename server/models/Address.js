const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
    },
  userId: {
    type: String,
    required: true
  },
  phone: { 
    type: String, 
    required: true 
    },
  pinCode: { 
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

    addressSchema.index({fullName:1, phone:1, pinCode:1, city:1, state:1, addressLine:1},
      {unique: true}
    )

module.exports = mongoose.model('Address',addressSchema)