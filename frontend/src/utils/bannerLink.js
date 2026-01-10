export const getBannerLink = (banner) => {
    switch(banner.linkType) {
        case 'category': 
        return `/category/${banner.linkValue}`

        case 'product': 
        return `/product/${banner.linkValue}`

        case 'filter': 
        return `/products/${banner.linkValue}`

        case 'category': 
        return `/category/${banner.linkValue}`
    }
}