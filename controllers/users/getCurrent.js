const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;
    res.json({
        user: {
            subscription,
            email
        }
    })
}
module.exports = getCurrent;