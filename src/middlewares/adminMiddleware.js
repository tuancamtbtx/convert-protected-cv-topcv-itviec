export default function (req, res, next) {
    if(!req.user.admin) return res.json({success: false, message: 'Not admin'});
    next();
}