import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.models.js";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.S3_BUCKET_NAME);
console.log(process.env.AWS_REGION);

const uploadToS3 = async (buffer, fileName, mimeType) => {
	const uploadParams = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: mimeType,
	};

	try {
		const command = new PutObjectCommand(uploadParams);
		const data = await s3.send(command);
		return data;
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw new Error("Failed to upload file to S3");
	}
};

export const uploadImage = async (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded");
	}

	const userId = req.body.userId;
	if (!userId) {
		return res.status(401).send("Unauthorized");
	}

	try {
		const { buffer, originalname, mimetype } = req.file;
		const fileName = `${Date.now()}_${originalname}`;

		const uploadResponse = await uploadToS3(buffer, fileName, mimetype);
		const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send("User not found");
		}

		user.tshirt.push(fileUrl);
		await user.save();

		const newProduct = new Product({
			image: fileUrl,
			userId: userId,
		});
		await newProduct.save();

		res.status(200).send({
			message: "File uploaded successfully",
			fileUrl,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).send("Error uploading file to S3");
	}
};

export const testServer = (req, res) => {
	res.json({ message: "Server is up and running" });
};
