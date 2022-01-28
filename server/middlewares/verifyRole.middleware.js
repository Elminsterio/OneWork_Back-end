
let verifyOwnId = (req, res, next) => {

    let idProvided = req.params.id;
    let user = req.user;

    if (idProvided === user._id) {

        next();

    } else {

        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    }

}

let verifyOwnIdOrRecruiter = (req, res, next) => {

    let idProvided = req.params.id;
    let user = req.user;

    if (idProvided === user._id ||
        user.role === 'RECRUITER_ROLE') {

        next();

    } else {

        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    }

}

let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });
    } else {
        next();
    }
}

let verifyWorker = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'WORKER_ROLE') {

        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    } else {

        next();

    }

}

let verifyRecruiter = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'RECRUITER_ROLE') {

        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized to perform this action'
            }
        });

    } else {

        next();

    }

}

module.exports = {
    verifyOwnId,
    verifyOwnIdOrRecruiter,
    verifyAdmin,
    verifyWorker,
    verifyRecruiter
};