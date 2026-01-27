const { sendError } = require("../controllers/baseController");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { ConflictError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../config/multer");
const config = require("../config/config");

class ProductService {
  //GET ALL PRODUCTS
  static getProducts = async (req, res) => {
    try {
      const {
        search = "",
        sortBy = "createdAt",
        sortOrder = "asc",
        category = "",
      } = req.query;

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      const rating = parseInt(req.query.rating);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};

      if (search) filter.name = { $regex: search, $options: "i" };

      if (category) filter.category = { $in: category.split(",") };

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.sellingPrice = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.sellingPrice = { $gte: minPrice };
        else if (maxPrice) filter.sellingPrice = { $lte: maxPrice };
      }
      if (rating) filter.ratings.rating = { $gte: rating };

      const sortObj = { [sortBy]: sortOrder };

      const productPerPage = limit || 6;
      const skipValue = (page - 1) * productPerPage;

      const totalProducts = await Product.find(filter).countDocuments();

      const [products, categories] = await Promise.all([
        Product.find(filter).skip(skipValue).limit(limit),
        Category.distinct("name"),
      ]);

      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        pagination: {
          limit,
          page,
          totalPages,
          totalProducts,
        },
        allCategories: categories,
      };
    } catch (error) {
      logger.error("Error fetching products");
      throw error;
    }
  };

  //GET PRODUCTS BY CATEGORY
  static getProductsByCategory = async (req, res) => {
    try {
      const { sortBy } = req.query;
      let { sortOrder = "asc" } = req.query;
      const category = req.params.category ?? "Mobile";

      const categoryDoc = await Category.findOne({
        name: { $regex: `^${category}$`, $options: "i" },
      });

      if (!categoryDoc) sendError(res, "Category not found", 404);

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      let rating = req.query.rating;
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};

      if (categoryDoc) filter.categoryId = categoryDoc._id;

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.sellingPrice = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.sellingPrice = { $gte: minPrice };
        else if (maxPrice) filter.sellingPrice = { $lte: maxPrice };
      }

      if (rating) rating = rating.split(",");

      const ratings = Array.isArray(rating)
        ? rating.map(Number).filter(Number.isFinite)
        : [];

      if (ratings.length) filter.avgRating = { $gte: Math.min(...ratings) };

      sortOrder = sortOrder === "asc" ? 1 : -1;
      const sortObj = { [sortBy]: sortOrder };

      const currentPage = page || 1;
      const productPerPage = limit || 6;
      const skipValue = (currentPage - 1) * productPerPage;

      const totalProducts = await Product.countDocuments(filter);

      const products = await Product.find(filter)
        .sort(sortObj)
        .collation({ locale: "en", strength: 2 })
        .skip(skipValue)
        .limit(limit);
      return {
        products,
        pagination: {
          limit,
          page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts: totalProducts,
        },
      };
    } catch (error) {
      logger.error("Error fetching products");
      throw error;
    }
  };

  // GET SINGLE PRODUCT
  static getProduct = async (productId, userId) => {
    try {
      const product = await Product.findById(productId).populate("categoryId");

      const orders = await Order.exists({
        user: userId,
        "items.product": productId,
      });

      const alreadyReviewed = await Product.exists({
        _id: productId,
        "ratings.user": userId,
      });

      const hasPurchased = !!orders;
      const hasReviewed = !!alreadyReviewed;

      return { product, hasPurchased, hasReviewed };
    } catch (error) {
      logger.error("Error fetching product");
      throw error;
    }
  };

  // GET FEATURED/BEST SELLER PRODUCTS
  static fetchHomePageProducts = async () => {
    try {
      const [featuredProducts, clearanceProducts] = await Promise.all([
        Product.find({ isFeatured: true }).limit(10),
        Product.find({
          $expr: {
            $gte: [
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: ["$originalPrice", "$sellingPrice"],
                      },
                      "$originalPrice",
                    ],
                  },
                  100,
                ],
              },
              30,
            ],
          },
        }).limit(10),
      ]);

      return { featuredProducts, clearanceProducts };
    } catch (error) {
      logger.error("Error fetching product");
      throw error;
    }
  };

  //TOGGLE PRODUCT STATUS
  static toggleProductStatus = async (productId) => {
    try {
      const product = await Product.findById(productId);
      if (!product) return new NotFoundError("Product not found");
      product.status = product.status === "active" ? "inactive" : "active";

      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  };

  //SUBMIT PRODUCT REVIEW
  static async submitReview(productId, reviewData, userId) {
    try {
      const { name, email, rating, review } = reviewData;
      if (!productId) return new NotFoundError("Product Not found");
      if (!reviewData) return new NotFoundError("No review data provided");

      const product = await Product.findById(productId);

      if (!product) return new NotFoundError("Product not found");

      product.ratings = {
        user: userId,
        name,
        rating,
        review,
      };

      product.ratingCount = product.ratings.length;

      product.avgRating =
        product.ratings.reduce((sum, r) => sum + r.rating, 0) /
        product.ratingCount;

      await product.save();

      return product;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  //ADD PRODUCT
  static addProduct = async (req) => {
    try {
      const productData = req.body;
      if (!productData) {
        throw new NotFoundError("No product to add");
      }

      const { name, categoryId, brandName } = productData;
      const existing = await Product.findOne({
        name: name,
        categoryId: categoryId,
        brandName: brandName,
      });

      if (existing) {
        logger.error("Product already exist");
        throw new ConflictError("Product already exist");
      }

      if (!req.files?.length > 0) {
        logger.error("No images selected to upload");
        throw new NotFoundError("No images selected to upload");
      }

      // if (productData.images && !Array.isArray(productData.images)) {
      //   productData.images = [
      //     {
      //       url: productData.images.url || productData.images,
      //       key: productData.images.key || productData.images,
      //     },
      //   ];
      // }

      const product = new Product({
        ...productData,
        images: req.files?.map((file) => ({
          url: file.location || `/uploads/${file.filename}`, //s3 for prod and local for dev
          key: file.key || file.filename,
        })),
      });

      await product.save();

      return { product };
    } catch (error) {
      logger.error("Adding product failed");
      throw error;
    }
  };

  static editProduct = async (productId, productData, prevImages, req) => {
    console.log('prod data:', productData)
    
    
    try {
      const product = await Product.findById(productId);

      if (!product) {
        logger.error("Product not found");
        throw new NotFoundError("Product not found");
      }

      if (req.files?.length > 0) {
        productData = {
          ...productData,
          images: req.files?.map((file) => ({
            url: file.location || `/uploads/${file.filename}`,
            key: file.key || file.filename,
          })),
        };
      }

      prevImages = Array.isArray(prevImages)
        ? prevImages.map((img) =>
            typeof img === "string" ? JSON.parse(img) : img
          )
        : [JSON.stringify(prevImages)]
        
        console.log('prev Image:', prevImages)
      const deletedImages = product.images.filter(
        (image) => (
          !prevImages.some((prev) => (
            prev?.key === image?.key
          ))
        )
      );
      console.log('deleted', deletedImages)

      if (deletedImages?.length > 0 ) {
        console.log('in deleted');
        
        await Promise.all(
        deletedImages.map((img) =>
          s3.send(
            new DeleteObjectCommand({
              Bucket: config.AWS.BUCKET_NAME,
              Key: img.key,
            })
          )
        )
      )
      }

      if (productData.images && !Array.isArray(productData.images)) {
        productData.images = [
          {
            url: productData.images.url || productData.images,
            key: productData.images.key || productData.images,
          },
        ];
      }

      if (prevImages && !Array.isArray(prevImages)) {
        prevImages = [prevImages];
      }
      const newImages = Array.isArray(productData.images)
        ? productData.images
        : [];

      productData.images = [...prevImages, ...newImages];
      Object.assign(product, productData);

      await product.save();

      return product;
    } catch (error) {
      logger.error("Product update failed");
      throw error;
    }
  };

  static deleteProduct = async (productId) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        logger.error("Product not found");
        throw NotFoundError("Product not found");
      }

      //delete image from s3 in prod
      for (const img of product.images) {
        if (config.NODE_ENV === "production") {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: config.AWS.BUCKET_NAME,
              Key: img?.key,
            })
          );
        }
      }

      logger.info("Product deleted successfully");
      await Product.findByIdAndDelete(productId);

      return productId;
    } catch (error) {
      logger.error("Product deletion failed");
      throw error;
    }
  };

  static searchSuggestions = async (req) => {
    try {
      const { search } = req.query;

      const filter = {};

      if (search)
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brandName: { $regex: search, $options: "i" } },
        ];
      const suggestions = await Product.find(filter).select("name brandName");

      logger.info("Search suggestion generated");

      return { suggestions };
    } catch (error) {
      throw error;
    }
  };

  static fetchSearch = async (req) => {
    try {
      const { search, sortBy, sortOrder = "asc" } = req.query;

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;

      const rawCategory = req.query?.category;
      let rating = req.query?.rating;

      const categoryNames = rawCategory
        ? Array.isArray(rawCategory)
          ? rawCategory
          : rawCategory.split(",")
        : [];

      const categoryDoc = categoryNames.length
        ? await Category.find({ name: { $in: categoryNames } }, { _id: 1 })
        : [];
      const categoryIds = categoryDoc.map((c) => c._id);

      if (rating) rating = rating.split(",");

      const ratings = Array.isArray(rating)
        ? rating.map(Number).filter(Number.isFinite)
        : [];

      const filter = {};
      if (ratings.length) filter.avgRating = { $gte: Math.min(...ratings) };

      if (search)
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brandName: { $regex: search, $options: "i" } },
        ];

      if (categoryIds.length) {
        filter.categoryId = { $in: categoryIds };
      }

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.sellingPrice = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.sellingPrice = { $gte: minPrice };
        else if (maxPrice) filter.sellingPrice = { $lte: maxPrice };
      }

      const sortObj = { [sortBy]: sortOrder };

      const currentPage = page || 1;
      const productPerPage = limit || 6;
      const skipValue = (currentPage - 1) * productPerPage;

      const totalProducts = await Product.countDocuments(filter);

      const [products, categories] = await Promise.all([
        Product.find(filter).sort(sortObj).skip(skipValue).limit(limit),
        Category.distinct("name"),
      ]);

      return {
        products,
        pagination: {
          page: currentPage,
          limit,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts: totalProducts,
        },
        allCategories: categories,
      };
    } catch (error) {
      logger.error("Search product failed", error);
      throw error;
    }
  };
}

module.exports = ProductService;
