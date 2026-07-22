const pool = require("../config/db");

const createInquiry = async (req, res) => {
    try {

        const { property_id, message } = req.body;
        const buyer_id = req.user.id;

        if (!property_id || !message) {
            return res.status(400).json({
                success: false,
                message: "Property ID and message are required"
            });
        }

        // Check property exists
        const property = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [property_id]
        );

        if (property.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const owner_id = property.rows[0].owner_id;

        // Prevent owner from sending inquiry to own property
        if (buyer_id === owner_id) {
            return res.status(400).json({
                success: false,
                message: "You cannot inquire about your own property"
            });
        }

        // Duplicate inquiry check
        const existingInquiry = await pool.query(
            `SELECT *
             FROM inquiries
             WHERE property_id = $1
             AND buyer_id = $2`,
            [property_id, buyer_id]
        );

        if (existingInquiry.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already sent an inquiry for this property"
            });
        }

        const inquiry = await pool.query(
            `INSERT INTO inquiries
            (
                property_id,
                buyer_id,
                owner_id,
                message
            )
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [
                property_id,
                buyer_id,
                owner_id,
                message
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Inquiry sent successfully",
            inquiry: inquiry.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getMyInquiries = async (req, res) => {

    try {

        const owner_id = req.user.id;

        const inquiries = await pool.query(
            `SELECT
                i.id,
                i.message,
                i.created_at,

                p.id AS property_id,
                p.title,
                p.city,

                u.id AS buyer_id,
                u.name AS buyer_name,
                u.email AS buyer_email,
                u.phone AS buyer_phone

            FROM inquiries i

            JOIN properties p
                ON i.property_id = p.id

            JOIN users u
                ON i.buyer_id = u.id

            WHERE i.owner_id = $1

            ORDER BY i.created_at DESC`,
            [owner_id]
        );

        return res.status(200).json({
            success: true,
            count: inquiries.rows.length,
            inquiries: inquiries.rows
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    createInquiry,
    getMyInquiries
};