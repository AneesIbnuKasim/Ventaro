const User = require("../models/User");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const { sendError } = require("../utils/response");
const path = require("path");
const fs = require("fs");
const Address = require("../models/Address");
const mongoose = require("mongoose");

class UserService {
  static getProfile = async (req, res) => {
    try {
      const id = req?.user?._id?.toString();

      const user = await User.findById(id).populate("addresses");

      if (!user) {
        logger.error("User not found", id);
        throw sendError(res, "User not found", 404);
      }
      const profileData = user.getPublicProfile();

      return { user: profileData };
    } catch (error) {
      logger.error("Error loading user profile");
      throw error;
    }
  };

  static updateProfile = async (userId, updateData) => {
    try {
      delete updateData?.password;
      delete updateData?.email;
      delete updateData?.role;
      delete updateData?.status;
      delete updateData?.isVerified;

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        logger.error("User not found");
        throw NotFoundError("User not found");
      }

      return { user: user.getPublicProfile() };
    } catch (error) {
      logger.error("Profile update failed");
      throw error;
    }
  };

  static updateAvatar = async (req) => {
    try {
      if (!req.file) {
        logger.error("No file uploaded");
        throw new Error("No file uploaded");
      }
      const userId = req.user._id.toString();
      const user = await User.findById(userId);

      if (user.avatar) {
        const oldPath = path.join("uploads/avatars", user.avatar);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      user.avatar = req.file.filename;
      await user.save();

      return { avatar: req.file.filename };
    } catch (error) {
      logger.error("Avatar updating failed");
      throw error;
    }
  };

  static addAddress = async (req, addressData) => {
    try {
      const userId = req.user._id.toString();
      const user = await User.findById(userId);
      if (!user) {
        logger.error("User not found");
        throw new NotFoundError("User not found");
      }

      const data = { ...addressData, userId };

      if (user.addresses.length === 0) {
        data.isDefault = true;
      } else if (addressData.isDefault) {
        await Address.updateMany({ isDefault: false });
      }

      const address = await Address.create(data);

      await user.updateOne(
        { $push: { addresses: address._id } },
        { new: true }
      );

      logger.info("Address added successfully");
      return address;
    } catch (error) {
      logger.error("Adding address failed");
      throw error;
    }
  };

  static updateAddress = async (addressId, updateData) => {
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        updateData,
        {
          new: true,
        }
      );

      logger.info("Address updated successfully", updatedAddress);

      return updatedAddress;
    } catch (error) {
      logger.error("Address updating failed");
      throw error;
    }
  };

  static deleteAddress = async (req) => {
    try {
      const addressId = req.params.id;

      const user = await User.findOne(req.user._id);

      if (user.addresses.length === 1) {
        return sendError(res, "Primary address cannot be deleted");
      }

      const res = await User.findOneAndUpdate(
        { addresses: new mongoose.Types.ObjectId(addressId) },
        { $pull: { addresses: addressId } },
        { new: true }
      );

      await Address.findByIdAndDelete(addressId);

      return addressId;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };

  //CHANGE PASSWORD FROM USER PROFILE
  static async changePassword(userId, passwordData) {
    try {
      const { currentPassword, newPassword } = passwordData;

      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      user.password = newPassword;
      await user.save();

      logger.info("Password changed successfully");

      return true;
    } catch (error) {
      logger.error("Password change error");
      throw error;
    }
  }

  //fetch wallet
  static fetchWallet = async (userId) => {
    try {
      const user = await User.findById(userId);

      if (!user) throw new NotFoundError("User not found");
      return { wallet: user.wallet };
    } catch (error) {
      throw error;
    }
  };

  //FETCH WISHLIST
  static fetchWishlist = async (userId, productId) => {
    try {
      const user = await User.findById(userId).populate('wishlist')

      if (!user) throw new NotFoundError("User not found");
      return user.wishlist
    } catch (error) {
      throw error;
    }
  };

  //TOGGLE TO WISHLIST
  static toggleWishlist = async (productId, userId) => {
    try {
      const user = await User.findById(userId)

      console.log('user', user);

      if (!user) throw new NotFoundError("User not found");
      const exists = user.wishlist?.includes(productId);

      if (exists) {
        user.wishlist.pull(productId)
      } else {
        user.wishlist.push(productId)
      }

      await user.save()

      return user.wishlist
    } catch (error) {
      throw error;
    }
  };

}

module.exports = UserService;
