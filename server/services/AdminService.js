const Admin = require("../models/Admin")
const { NotFoundError, ConflictError, AuthorizationError, AuthenticationError, ValidationError } = require("../utils/errors")
const { generateAdminToken } = require("../utils/jwt")
const logger = require("../utils/logger")
const path = require('path')
const fs = require('fs')

class AdminService {
    static async login (userData) {
        try {
            const { email, password } = userData
            const admin = await Admin.findByEmail(email)
        
        if (!admin || admin.role !== 'admin') {
            throw new ValidationError('Invalid admin credentials')
        }

        const isPasswordMatching = await admin.comparePassword(password)
        if (!isPasswordMatching) {
            logger.error('Invalid password')
            throw new AuthenticationError('Invalid email or password')
        }
        
        if (admin.status === 'banned') {
            logger.warn('Banned admin tried to login:',admin.email)
            throw new AuthorizationError('Admin account has been banned')
        }

        const token = generateAdminToken({
            id: admin._id,
            email: admin.email,
            role: admin.role,
        })
        logger.info(`Admin logged in: ${email}`)
        return {
            token,
            admin: await admin.getPublicProfile()
            }
        } catch (error) {
            logger.error('Admin login error',error)
            throw error
        }
    }

    static updateProfile = async (adminId, updateData) => {
        console.log('in admin uopdate', updateData);
        
        try {
          delete updateData?.password;
          delete updateData?.email;
          delete updateData?.role;
          delete updateData?.status;
          delete updateData?.isVerified;
    
          const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
            new: true,
            runValidators: true,
          });
    console.log('admin', admin);
    
          if (!admin) {
            logger.error("Admin not found");
            throw NotFoundError("Admin not found");
          }
    
          return { admin: await admin.getPublicProfile() };
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
            const adminId = req.admin._id.toString();
            const admin = await Admin.findById(adminId);
      
            if (admin.avatar) {
              const oldPath = path.join("uploads/avatars", admin.avatar);
      
              if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
              }
            }
      
            admin.avatar = req.file.filename;
            await admin.save();
      
            return { avatar: req.file.filename };
          } catch (error) {
            logger.error("Avatar updating failed");
            throw error;
          }
        };


    static getProfile = async (adminId) => {
    try {

      const admin = await Admin.findById(adminId)

      if (!admin) {
        logger.error("Admin not found", adminId);
        throw sendError(res, "Admin not found", 404);
      }
      const profileData = admin.getPublicProfile();

      return { admin: profileData };
    } catch (error) {
      logger.error("Error loading admin profile");
      throw error;
    }
  };
}

module.exports = AdminService