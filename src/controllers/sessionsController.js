import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).send('Usuario o contraseña incorrecta');
        }
        
        const token = generateToken(req.user);
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.cookie('sessionCookie', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        res.status(200).redirect('/');
    } catch (error) {
        res.status(500).send('Error al loguear usuario');
    }
}

export const register = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).send('Usuario ya registrado');
        }
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        res.status(500).send('Error al registrar usuario');
    }
}

export const viewRegister = (req, res) => {
    res.status(200).render('templates/register', {})
}

export const viewLogin = (req, res) => {
    res.status(200).render('templates/login', {})
}

export const githubLogin = (req, res) => {
    try {
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.status(200).redirect('/');
    } catch (error) {
        res.status(500).send('Error al loguear usuario', error);
    }
}