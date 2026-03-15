const Doctor = require('../models/Doctor');
const Vendor = require('../models/Vendor');

exports.getDashboardStats = async (req, res) => {
  try {
    // Parallel fetching for better performance
    const [
      totalDoctors,
      pendingDoctors,
      totalVendors,
      pendingVendors
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ verified: false }),
      Vendor.countDocuments(),
      Vendor.countDocuments({ verified: false })
    ]);

    const approvedDoctors = totalDoctors - pendingDoctors;
    const approvedVendors = totalVendors - pendingVendors;

    res.status(200).json({
      totalDoctors,
      totalVendors,
      pendingTotal: pendingDoctors + pendingVendors,
      approvedTotal: approvedDoctors + approvedVendors,
      // Mock data for the charts since historical trends require a separate schema/logic
      approvedVsRejected: [approvedDoctors + approvedVendors, 2], 
      requestsTrend: [5, 10, 8, 15, 12, 20, 18] 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};