const express = require('express');
const path = require('path');

const router = express.Router();
router.get('/:filename', (req,res) => {
    const filename = req.params.filename;
    const absPath = path.resolve(__dirname, '../../public/resources', filename);
    res.download(absPath, filename);
})
module.exports = router;
