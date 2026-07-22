// const pool = require("../config/db");

// const createProperty = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             price,
//             city,
//             address,
//             bedrooms,
//             bathrooms,
//             image_url
//         } = req.body;

//         if (
//             !title ||
//             !description ||
//             !price ||
//             !city ||
//             !address ||
//             !bedrooms ||
//             !bathrooms
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill all required fields"
//             });
//         }

//         const owner_id = req.user.id;

//         const newProperty = await pool.query(
//             `INSERT INTO properties
//             (title, description, price, city, address, bedrooms, bathrooms, image_url, owner_id)
//             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//             RETURNING *`,
//             [
//                 title,
//                 description,
//                 price,
//                 city,
//                 address,
//                 bedrooms,
//                 bathrooms,
//                 image_url,
//                 owner_id
//             ]
//         );

//         return res.status(201).json({
//             success: true,
//             message: "Property created successfully",
//             property: newProperty.rows[0]
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// const getAllProperties = async (req, res) => {
//     try {

//         const {
//             city,
//             bedrooms,
//             minPrice,
//             maxPrice
//         } = req.query;

//         let query = "SELECT * FROM properties WHERE 1=1";

//         let values = [];

//         if (city) {
//             values.push(city);
//             query += ` AND city = $${values.length}`;
//         }

//         if (bedrooms) {
//             values.push(bedrooms);
//             query += ` AND bedrooms = $${values.length}`;
//         }

//         if (minPrice) {
//             values.push(minPrice);
//             query += ` AND price >= $${values.length}`;
//         }

//         if (maxPrice) {
//             values.push(maxPrice);
//             query += ` AND price <= $${values.length}`;
//         }

//         query += " ORDER BY created_at DESC";

//         const properties = await pool.query(
//             query,
//             values
//         );

//         return res.status(200).json({
//             success: true,
//             count: properties.rows.length,
//             properties: properties.rows
//         });

//     } catch (err) {

//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }
// };

// const getPropertyById = async (req, res) => {
//     try {

//         const { id } = req.params;

//         const property = await pool.query(
//             "SELECT * FROM properties WHERE id=$1",
//             [id]
//         );

//         if (property.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             property: property.rows[0]
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// const updateProperty = async (req, res) => {
//     try {

//         const { id } = req.params;

//         const {
//             title,
//             description,
//             price,
//             city,
//             address,
//             bedrooms,
//             bathrooms,
//             image_url
//         } = req.body;

//         const property = await pool.query(
//             "SELECT * FROM properties WHERE id=$1",
//             [id]
//         );

//         if (property.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found"
//             });
//         }

//         if (property.rows[0].owner_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const updatedProperty = await pool.query(
//             `UPDATE properties
//             SET title=$1,
//                 description=$2,
//                 price=$3,
//                 city=$4,
//                 address=$5,
//                 bedrooms=$6,
//                 bathrooms=$7,
//                 image_url=$8
//             WHERE id=$9
//             RETURNING *`,
//             [
//                 title,
//                 description,
//                 price,
//                 city,
//                 address,
//                 bedrooms,
//                 bathrooms,
//                 image_url,
//                 id
//             ]
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Property updated successfully",
//             property: updatedProperty.rows[0]
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// const deleteProperty = async (req, res) => {
//     try {

//         const { id } = req.params;

//         const property = await pool.query(
//             "SELECT * FROM properties WHERE id=$1",
//             [id]
//         );

//         if (property.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Property not found"
//             });
//         }

//         if (property.rows[0].owner_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         await pool.query(
//             "DELETE FROM properties WHERE id=$1",
//             [id]
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Property deleted successfully"
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// module.exports = {
//     createProperty,
//     getAllProperties,
//     getPropertyById,
//     updateProperty,
//     deleteProperty
// };


const pool = require("../config/db");

const createProperty = async (req, res) => {
    try {

        const {
            title,
            description,
            price,
            city,
            address,
            bedrooms,
            bathrooms,
            image_url,
            property_type,
            area_sqft,
            status
        } = req.body;

        if (
            !title ||
            !description ||
            !price ||
            !city ||
            !address ||
            !bedrooms ||
            !bathrooms ||
            !property_type ||
            !area_sqft
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const owner_id = req.user.id;

        const newProperty = await pool.query(
            `INSERT INTO properties
            (
                title,
                description,
                price,
                city,
                address,
                bedrooms,
                bathrooms,
                image_url,
                property_type,
                area_sqft,
                status,
                owner_id
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
            )
            RETURNING *`,
            [
                title,
                description,
                price,
                city,
                address,
                bedrooms,
                bathrooms,
                image_url,
                property_type,
                area_sqft,
                status || "Available",
                owner_id
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Property created successfully",
            property: newProperty.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getAllProperties = async (req, res) => {

    try {

        const {
            city,
            bedrooms,
            property_type,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
            sort = "newest"
        } = req.query;

        let query =
            "SELECT * FROM properties WHERE 1=1";

        let countQuery =
            "SELECT COUNT(*) FROM properties WHERE 1=1";

        let values = [];

        if (city) {
            values.push(city);

            query += ` AND city = $${values.length}`;
            countQuery += ` AND city = $${values.length}`;
        }

        if (property_type) {
            values.push(property_type);

            query += ` AND property_type = $${values.length}`;
            countQuery += ` AND property_type = $${values.length}`;
        }

        if (bedrooms) {
            values.push(bedrooms);

            query += ` AND bedrooms = $${values.length}`;
            countQuery += ` AND bedrooms = $${values.length}`;
        }

        if (minPrice) {
            values.push(minPrice);

            query += ` AND price >= $${values.length}`;
            countQuery += ` AND price >= $${values.length}`;
        }

        if (maxPrice) {
            values.push(maxPrice);

            query += ` AND price <= $${values.length}`;
            countQuery += ` AND price <= $${values.length}`;
        }

        switch (sort) {

            case "price_asc":
                query += " ORDER BY price ASC";
                break;

            case "price_desc":
                query += " ORDER BY price DESC";
                break;

            case "oldest":
                query += " ORDER BY created_at ASC";
                break;

            default:
                query += " ORDER BY created_at DESC";

        }

            const totalResult = await pool.query(
            countQuery,
            values
        );

        const totalProperties = parseInt(
            totalResult.rows[0].count
        );

        const currentPage = parseInt(page);
        const perPage = parseInt(limit);

        const offset = (currentPage - 1) * perPage;

        values.push(perPage);
        query += ` LIMIT $${values.length}`;

        values.push(offset);
        query += ` OFFSET $${values.length}`;

        const properties = await pool.query(
            query,
            values
        );

        return res.status(200).json({
            success: true,
            currentPage,
            totalPages: Math.ceil(
                totalProperties / perPage
            ),
            totalProperties,
            count: properties.rows.length,
            properties: properties.rows
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getPropertyById = async (req, res) => {

    try {

        const { id } = req.params;

        const property = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [id]
        );

        if (property.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found"
            });

        }

        return res.status(200).json({
            success: true,
            property: property.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const updateProperty = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            price,
            city,
            address,
            bedrooms,
            bathrooms,
            image_url,
            property_type,
            area_sqft,
            status
        } = req.body;

        const property = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [id]
        );

        if (property.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found"
            });

        }

        if (property.rows[0].owner_id !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        const updatedProperty = await pool.query(
            `UPDATE properties
             SET
                title=$1,
                description=$2,
                price=$3,
                city=$4,
                address=$5,
                bedrooms=$6,
                bathrooms=$7,
                image_url=$8,
                property_type=$9,
                area_sqft=$10,
                status=$11
             WHERE id=$12
             RETURNING *`,
            [
                title,
                description,
                price,
                city,
                address,
                bedrooms,
                bathrooms,
                image_url,
                property_type,
                area_sqft,
                status,
                id
            ]
        );
                return res.status(200).json({
            success: true,
            message: "Property updated successfully",
            property: updatedProperty.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const deleteProperty = async (req, res) => {

    try {

        const { id } = req.params;

        const property = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [id]
        );

        if (property.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found"
            });

        }

        if (property.rows[0].owner_id !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        await pool.query(
            "DELETE FROM properties WHERE id = $1",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getSimilarProperties = async (req, res) => {

    try {

        const { id } = req.params;

        const property = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [id]
        );

        if (property.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Property not found"
            });

        }

        const currentProperty = property.rows[0];

        const similarProperties = await pool.query(
            `SELECT *
             FROM properties
             WHERE id != $1
             AND city = $2
             AND property_type = $3
             AND bedrooms = $4
             ORDER BY created_at DESC
             LIMIT 5`,
            [
                id,
                currentProperty.city,
                currentProperty.property_type,
                currentProperty.bedrooms
            ]
        );

        return res.status(200).json({
            success: true,
            count: similarProperties.rows.length,
            properties: similarProperties.rows
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getSimilarProperties
};