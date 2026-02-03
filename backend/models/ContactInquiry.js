const db = require("../config/db_connect");

const ContactInquiry = {
  // Get all inquiries
  async getAll(filters = {}) {
    try {
      let query = `
        SELECT ci.*, c.name as car_name, c.slug as car_slug
        FROM contact_inquiries ci
        LEFT JOIN cars c ON ci.car_id = c.id
      `;

      const conditions = [];
      const params = [];

      if (filters.status) {
        conditions.push("ci.status = ?");
        params.push(filters.status);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY ci.created_at DESC";

      if (filters.limit) {
        query += " LIMIT ?";
        params.push(parseInt(filters.limit));
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      throw error;
    }
  },

  // Get inquiry by ID
  async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT ci.*, c.name as car_name, c.slug as car_slug
         FROM contact_inquiries ci
         LEFT JOIN cars c ON ci.car_id = c.id
         WHERE ci.id = ?`,
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching inquiry by ID:", error);
      throw error;
    }
  },

  // Create a new inquiry
  async create(data) {
    try {
      const { carId, name, email, phone, message } = data;

      const [result] = await db.query(
        `INSERT INTO contact_inquiries (car_id, name, email, phone, message)
         VALUES (?, ?, ?, ?, ?)`,
        [carId || null, name, email, phone || null, message || null],
      );

      return await this.getById(result.insertId);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      throw error;
    }
  },

  // Update inquiry status
  async updateStatus(id, status) {
    try {
      await db.query("UPDATE contact_inquiries SET status = ? WHERE id = ?", [
        status,
        id,
      ]);
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      throw error;
    }
  },

  // Delete inquiry
  async delete(id) {
    try {
      const [result] = await db.query(
        "DELETE FROM contact_inquiries WHERE id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      throw error;
    }
  },

  // Get counts by status
  async getCounts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
          SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count,
          SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_count,
          SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_count
        FROM contact_inquiries
      `);
      return rows[0];
    } catch (error) {
      console.error("Error getting inquiry counts:", error);
      throw error;
    }
  },
};

module.exports = ContactInquiry;
