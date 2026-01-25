const Admin = require("../models/Admin")
const { NotFoundError, ConflictError, AuthorizationError, AuthenticationError, ValidationError } = require("../utils/errors")
const { generateAdminToken } = require("../utils/jwt")
const logger = require("../utils/logger")
const path = require('path')
const fs = require('fs')
const User = require("../models/User")

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

    //UPDATE ADMIN PROFILE
    static updateProfile = async (adminId, updateData) => {
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
    
          if (!admin) {
            logger.error("Admin not found");
            throw NotFoundError("Admin not found");
          }

          const sanitizedAdmin = await admin.getPublicProfile()
    
          return { admin: sanitizedAdmin };
        } catch (error) {
          logger.error("Profile update failed");
          throw error;
        }
      };

      //UPDATE ADMIN AVATAR
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


    //FETCH ADMIN PROFILE DETAILS
    static getProfile = async (adminId) => {
    try {

      const admin = await Admin.findById(adminId)

      if (!admin) {
        logger.error("Admin not found", adminId);
        throw sendError(res, "Admin not found", 404);
      }
      const profileData = await admin.getPublicProfile();

      return { admin: profileData };
    } catch (error) {
      logger.error("Error loading admin profile");
      throw error;
    }
  };

  //GET ALL USERS
  static getUsers = async (req, res) => {
      try {
        const {
          search = "",
          sortBy = "createdAt",
          sortOrder = "asc",
          category = "",
          status = ''
        } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
  
        const filter = {};
  
        if (search) filter.$or = [{name: { $regex: search, $options: "i" }},
          {email: { $regex: search, $options: "i" }}
        ]
  
        if (status) filter.status = status
  
        const sortObj = { [sortBy]: sortOrder };
  
        const usersPerPage = limit || 6;
        const skipValue = (page - 1) * usersPerPage;
  
        const [users, totalUsers] = await Promise.all([
          User.find(filter).skip(skipValue).limit(limit),
          User.countDocuments(filter)
        ]);
  
        const totalPages = Math.ceil(totalUsers / limit);
  
        return {
          users,
          pagination: {
            limit,
            page,
            totalPages,
            totalUsers,
          }
        };
      } catch (error) {
        logger.error("Error fetching users");
        throw error;
      }
    };

    //BAN USER
    static banUser = async(userId) => {
      try {
        const user = await User.findByIdAndUpdate(
        userId, {status:'banned'}, 
        {new: true}
      )

      if (!user) {
        new NotFoundError('User not found')
      }
      return {user}

      } catch (error) {
        throw error
      }
    }

    //UN BAN USER
    static unBanUser = async(userId) => {
      try {
        const user = await User.findByIdAndUpdate(
        userId, {status:'active'}, 
        {new: true}
      )

      if (!user) {
        new NotFoundError('User not found')
      }
      return {user}

      } catch (error) {
        throw error
      }
    }
}

module.exports = AdminService