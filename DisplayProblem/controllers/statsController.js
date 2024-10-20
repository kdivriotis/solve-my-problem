
   

// controllers/statsController.js

import { Problem } from "../database/index.js";
import mongoose from "mongoose";

export const getSubmissionTrends = async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
  
      const { startDate, endDate, page = 1, limit = 10 } = req.query;
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date();
  
      const trends = await Problem.aggregate([
        {
          $match: {
            userId: userId,
            submittedOn: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$submittedOn" },
              month: { $month: "$submittedOn" },
              day: { $dayOfMonth: "$submittedOn" },
            },
            submissions: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: parseInt(limit, 10),
        },
      ]);
  
      const formattedTrends = trends.map((trend) => ({
        date: `${trend._id.year}-${String(trend._id.month).padStart(2, "0")}-${String(trend._id.day).padStart(2, "0")}`,
        submissions: trend.submissions,
      }));
  
      const totalGroupedDocuments = await Problem.aggregate([
        {
          $match: {
            userId: userId,
            submittedOn: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$submittedOn" },
              month: { $month: "$submittedOn" },
              day: { $dayOfMonth: "$submittedOn" },
            },
          },
        },
      ]);
  
      res.json({
        trends: formattedTrends,
        totalPages: Math.ceil(totalGroupedDocuments.length / limit),
        currentPage: parseInt(page, 10),
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
