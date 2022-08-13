exports.post = (req, res, next) => {
    res.status(200).json({
        project: JSON.stringify(req.body)
    });
};

exports.load = (req, res, next) => {
    let json = JSON.parse(req.body.project);
    res.status(200).send(json);
};
