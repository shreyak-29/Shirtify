import { Product } from "../models/product.models.js";
import { User } from "../models/user.model.js";

export const getAllProductsWithUserInfo = async (req, res) => {
	try {
		const products = await Product.find().populate(
			"userId",  
			"fullName email"
		);
		
		if (!products || products.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		
		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching products with user info:", error);
		res.status(500).json({ message: "Server error" });
	}
};
