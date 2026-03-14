exports.uploadProfileImageAndCertificate = async (req, res) => {
    try {
        const response = {};
        
        // Ensure files exist before accessing them
        if (req.files) {
            if (req.files['profileImage']) {
              response.profileImage = {
                url: req.files['profileImage'][0].path,
                publicId: req.files['profileImage'][0].filename
              };
            }
            
            // Fixed the naming mismatch: using 'certificateImage' consistently
            if (req.files['certificateImage']) {
              response.certificate = {
                url: req.files['certificateImage'][0].path,
                publicId: req.files['certificateImage'][0].filename
              };
            }
        }
    
        if (Object.keys(response).length === 0) {
            return res.status(400).json({ message: "No files were uploaded" });
        }

        res.status(200).json(response);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};