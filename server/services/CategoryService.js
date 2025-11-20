const Category = require("../models/Category")

class CategoryService {
    static getAllCategories = (req, res)=>{

    }

    static addCategory = async (categoryData)=>{
        const { name, description } = categoryData
        
        const category = new Category({
            name: name[0].toUpperCase()+name.slice(1),
            description: description[0].toUpperCase()+description.slice(1)
        })
        
        console.log('cat: ', name, description);
        await category.save()

        return {category}
    }

    static updateCategory = ()=>{
    }

    static deleteCategory = ()=>{

    }
}

module.exports = CategoryService