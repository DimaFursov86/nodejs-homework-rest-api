const { User } = require("../../models");
const Jimp = require("Jimp");
const path = require("path");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
const fs = require("fs/promises");

const avatars = async(req, res)=> {
    const {path: tempUpload, filename} = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);
    await fs.rename(tempUpload, fileUpload);
     Jimp.read(fileUpload, function (err, test) {
        if (err) throw err;
        test.resize(250, 250)
            .quality(50)
            .rotate( 90 )
             .write(fileUpload); 
    });
    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(req.user._id, {avatarURL}, {new: true});
    res.json({avatarURL})
}
module.exports = avatars;