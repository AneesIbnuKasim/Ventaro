export default function formatImageUrl (image, baseUrl = "http://localhost:5001") {
    if (!image) return "";
console.log('image in start', image);

    // Case 1: S3 or Cloudinary object
    if (typeof image === "object" && image.url) {
      // If already absolute (S3), return as-is
      console.log('new img', image.url);
      
      return image.url.startsWith("http")
        ? image.url
        : `${baseUrl}${image.url}`
    }

    // Case 1: image array without url
    if (typeof image === "object") {
      // If already absolute (S3), return as-is
      console.log('new img', image.url);
      
      return image[0].startsWith("http")
        ? image[0]
        : `${baseUrl}${image[0]}`
    }

    // Case 2: Old string path
    if (typeof image === "string") {
      console.log('old img', image);
      return image.startsWith("http") ? image : `${baseUrl}${image}` ?? `${baseUrl}${image.url}`;
    }

    return "";
  };