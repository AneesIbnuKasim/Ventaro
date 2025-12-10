const Category = require("../models/Category")
const Product = require("../models/Product")
const { ConflictError, NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")

class ProductService {
    //GET ALL PRODUCTS
    static getProducts = async(req, res)=>{
        try {

            const { search, sortBy, category  } = req.query

            const minPrice = parseInt(req.query.minPrice)
            const maxPrice = parseInt(req.query.maxPrice)
            const rating = parseInt(req.query.rating)
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit) || 10
            const sortOrder = parseInt(req.query.sortOrder) || 1
            
            const filter = {}
            
            if (search) filter.name = {$regex: search, $options: 'i'}

            if (category) filter.category = category.split(',')

            if(minPrice||maxPrice) {
                if(minPrice&&maxPrice) {
                filter.price = {$gte:minPrice,$lte:maxPrice}
            }
                else if(minPrice) filter.price = {$gte:minPrice}
                else if(maxPrice) filter.price ={$lte:maxPrice}
            }

            if (rating) filter.rating = {$lte: rating}

            const sortObj = { [sortBy]: sortOrder }

            const currentPage = page || 1
            const productPerPage = limit || 6
            const skipValue = (currentPage-1)*productPerPage

            const [products, totalProducts, categories] = await Promise.all([
                Product.find(filter).sort(sortObj).skip(skipValue).limit(limit),
                Product.countDocuments(filter),
                await Category.distinct('name')
            ])
            return {products,
                pagination: {
                    currentPage,
                    totalPages: Math.ceil(products.length/limit),
                    totalProducts: totalProducts
                },
                allCategories: categories
            }
        } catch (error) {
            logger.error('Error fetching products') 
            throw error
        }
    }

    // GET SINGLE PRODUCT
    static getProduct = async(productId)=>{
        try {
            const product = await Product.findById(productId)
            return product
        } catch (error) {
            logger.error('Error fetching product') 
            throw error
        }
    }

    static addProduct = async(req)=>{
        try {
            console.log('image:', req.files);
            console.log('data:', req.body);
            const productData = req.body
            if (!productData) {
            throw new NotFoundError('No product to add')
        }        

        console.log('productdata:', productData);
        

        const { name, categoryId, brandName } = productData
        const existing = await Product.findOne({ name:name, categoryId:categoryId,
            brandName:brandName })

        if (existing) {
            logger.error('Product already exist')
            throw new ConflictError('Product already exist')
        }

        if (!req.files?.length>0) {
            logger.error('No images selected to upload')
            throw new NotFoundError('No images selected to upload')
        }

        const product = new Product({
            ...productData,
            images: req.files?.map(file=>`/uploads/${file.filename}`)
        })

        console.log('product',product);
        
        
        await product.save()

        return {product}
        } catch (error) {
            logger.error('Adding product failed')
            throw error
        }
    }

    static editProduct = async(productId, productData)=>{
        try {

            const product = await Product.findById(productId)

        if (!product) {
            logger.error('Product not found')
            throw new NotFoundError('Product not found')
        }

        Object.assign(product, productData)

        await product.save()

        return product
    }
        catch (error) {
            logger.error('Product update failed')
            throw error
        }
    }

    static deleteProduct = async(productId)=>{
        try {
            const existing = await Product.findById(productId)

        if (!existing) {
            logger.error('Product not found')
            throw NotFoundError('Product not found')
        }

        logger.info('Product deleted successfully')
        await Product.findByIdAndDelete(productId)

        return productId
        } catch (error) {
            logger.error('Product deletion failed')
            throw error
        }
    }

}

module.exports = ProductService