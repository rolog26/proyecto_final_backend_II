const authorization = (rol) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'No autenticado' });
        }
        if (req.user.rol !== rol) {
            return res.status(403).send({ error: 'No autorizado' });
        }
        next();
    }
}

export default authorization;