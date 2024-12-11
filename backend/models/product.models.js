import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	image: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

export const Product = mongoose.model("Product", productSchema);
