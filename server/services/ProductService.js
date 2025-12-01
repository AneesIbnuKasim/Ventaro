const Product = require("../models/Product")
const { ConflictError, NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")

class ProductService {
    //GET ALL PRODUCTS
    static getProducts = async()=>{
        try {
            const products = await Product.find({})
            return products
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

        const { name, description, brandName, price, categoryId, discount, stock } = productData
        const existing = await Product.findOne({ name:name, categoryId:categoryId,
            brandName: brandName })

        if (existing) {
            logger.error('Product already exist')
            throw new ConflictError('Product already exist')
        }

        if (!req.files.length>0) {
            logger.error('No images selected to upload')
            throw NotFoundError('No images selected to upload')
        }

        const product = new Product({
            ...productData,
            images: req.files?.map(file=>`/uploads/${file.filename}`)
        })
        
        await product.save()

        return product
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

        return true
        } catch (error) {
            logger.error('Product deletion failed')
            throw error
        }
    }

}

module.exports = ProductService