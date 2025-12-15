const { sendError } = require("../controllers/baseController");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { ConflictError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

class ProductService {
  //GET ALL PRODUCTS
  static getProducts = async (req, res) => {
    try {
      const { search, sortBy, sortOrder = "asc", category } = req.query;

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      const rating = parseInt(req.query.rating);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};

      if (search) filter.name = { $regex: search, $options: "i" };

      if (category) filter.category = { $in: category.split(",") };

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.price = { $gte: minPrice };
        else if (maxPrice) filter.price = { $lte: maxPrice };
      }

      if (rating) filter.rating = { $gte: rating };

      const sortObj = { [sortBy]: sortOrder };

      const currentPage = page || 1;
      const productPerPage = limit || 6;
      const skipValue = (currentPage - 1) * productPerPage;

      const totalProducts = await Product.find(filter);

      const [products, categories] = await Promise.all([
        Product.find(filter).sort(sortObj).skip(skipValue).limit(limit),
        Category.distinct("name"),
      ]);

      return {
        products,
        pagination: {
          page,
          totalPages: Math.ceil(totalProducts.length / limit),
          totalProducts: totalProducts.length,
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
      const category = req.params.category;

      const categoryDoc = await Category.findOne({
        name: { $regex: `^${category}$`, $options: "i" },
      });

      if (!categoryDoc) sendError(res, "Category not found", 404);

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      const rating = parseInt(req.query.rating);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};

      if (categoryDoc) filter.categoryId = categoryDoc._id;

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.price = { $gte: minPrice };
        else if (maxPrice) filter.price = { $lte: maxPrice };
      }

      if (rating) filter.rating = { $lte: rating };

      sortOrder = sortOrder === "asc" ? 1 : -1;
      const sortObj = { [sortBy]: sortOrder };

      const currentPage = page || 1;
      const productPerPage = limit || 6;
      const skipValue = (currentPage - 1) * productPerPage;
      console.log("filter", filter);

      const totalProducts = await Product.countDocuments(filter);

      const products = await Product.find(filter)
        .sort(sortObj)
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
  static getProduct = async (productId) => {
    try {
      const product = await Product.findById(productId).populate("categoryId");

      return { product };
    } catch (error) {
      logger.error("Error fetching product");
      throw error;
    }
  };

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

      const product = new Product({
        ...productData,
        images: req.files?.map((file) => `/uploads/${file.filename}`),
      });

      await product.save();

      return { product };
    } catch (error) {
      logger.error("Adding product failed");
      throw error;
    }
  };

  static editProduct = async (productId, productData, req) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        logger.error("Product not found");
        throw new NotFoundError("Product not found");
      }

      if (req.files?.length > 0) {
        productData = {
          ...productData,
          images: req.files?.map((file) => `/uploads/${file.filename}`),
        };
      }

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
      const existing = await Product.findById(productId);

      if (!existing) {
        logger.error("Product not found");
        throw NotFoundError("Product not found");
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

      console.log("query:", req.query);

      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit) || 10;

      const rawCategory = req.query.category;
      const rawRating = req.query.rating;

      const category = rawCategory
        ? Array.isArray(rawCategory)
          ? rawCategory
          : rawCategory.split(",")
        : [];

      const rating = rawRating
        ? Array.isArray(rawRating)
          ? rawRating.map(Number)
          : [Number(rawRating)]
        : [];
      console.log("cats", category);
      console.log("rats", rating);

      const filter = {};

      if (search)
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brandName: { $regex: search, $options: "i" } },
        ];
      console.log("isArray: ", search);

      if (category.length) {
        filter.category = { $in: category };
      }

      if (rating.length) {
        filter.rating = { $gte: Math.max(...rating) };
      }

      console.log("filter cat", filter);

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) filter.price = { $gte: minPrice };
        else if (maxPrice) filter.price = { $lte: maxPrice };
      }

      const sortObj = { [sortBy]: sortOrder };

      const currentPage = page || 1;
      const productPerPage = limit || 6;
      const skipValue = (currentPage - 1) * productPerPage;

      const totalProducts = await Product.find(filter);

      const [products, categories] = await Promise.all([
        Product.find(filter).sort(sortObj).skip(skipValue).limit(limit),
        Category.distinct("name"),
      ]);

      console.log("page:", page);

      return {
        products,
        pagination: {
          page: currentPage,
          limit,
          totalPages: Math.ceil(totalProducts.length / limit),
          totalProducts: totalProducts.length,
        },
        allCategories: categories,
      };
    } catch (error) {
      logger("Search product failed", error);
      throw error;
    }
  };
  //   static fetchSearch = async (req) => {
  //     try {
  //       const { search, sortBy, sortOrder = "asc", category } = req.query;

  //       console.log('query:', req.query);

  //       const minPrice = parseInt(req.query.minPrice);
  //       const maxPrice = parseInt(req.query.maxPrice);
  //       const rating = parseInt(req.query.rating);
  //       const page = parseInt(req.query.page);
  //       const limit = parseInt(req.query.limit) || 10;

  //       console.log('rating:', rating);
  //       console.log('minPrice:', minPrice);

  //       const filter = {};

  //       if (search)
  //         filter.$or = [
  //           { name: { $regex: search, $options: "i" } },
  //           { description: { $regex: search, $options: "i" } },
  //           { brandName: { $regex: search, $options: "i" } },
  //         ];
  //         console.log('isArray: ', search);

  //       if (Array.isArray(category) && category.length > 0)
  //         filter.category = { $in: category };

  //       console.log('filter cat', filter);

  //       if (minPrice || maxPrice) {
  //         if (minPrice && maxPrice) {
  //           filter.price = { $gte: minPrice, $lte: maxPrice };
  //         } else if (minPrice) filter.price = { $gte: minPrice };
  //         else if (maxPrice) filter.price = { $lte: maxPrice };
  //       }

  //       if (rating) filter.rating = { $gte: rating };

  //       const sortObj = { [sortBy]: sortOrder };

  //       const currentPage = page || 1;
  //       const productPerPage = limit || 6;
  //       const skipValue = (currentPage - 1) * productPerPage;

  //       const totalProducts = await Product.find(filter);

  //       const [products, categories] = await Promise.all([
  //         Product.find(filter).sort(sortObj).skip(skipValue).limit(limit),
  //         Category.distinct("name"),
  //       ]);

  //       console.log("page:", page);

  //       return {
  //         products,
  //         pagination: {
  //           page: currentPage,
  //           limit,
  //           totalPages: Math.ceil(totalProducts.length / limit),
  //           totalProducts: totalProducts.length,
  //         },
  //         allCategories: categories,
  //       };
  //     } catch (error) {
  //       logger("Search product failed", error);
  //       throw error;
  //     }
  //   };
}

module.exports = ProductService;
