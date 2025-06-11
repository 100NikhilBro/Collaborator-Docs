exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.json("This is protected route for admin");
        }
    } catch (e) {
        console.error(e);
        return res.json("Internal Error");
    }
}