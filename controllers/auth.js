const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = express.response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email })

    if (user) {
      return res.status(400).json({ 
        ok: false,
        msg: 'El usuario con ese correo ya existe'
      })
    }
    user = new User( req.body );

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    await user.save();

    //Generar JWT
    const token = await generateJWT( user.id, user.name );

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor comuniquese con el administrador'
    })
  }  
};

const userLogin = async(req, res = express.response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({ 
        ok: false,
        msg: 'El usuario con ese correo no existe'
      })
    }
    //confirmar passwords
    const validPassword = bcrypt.compareSync( password, user.password );

    if (!validPassword) {
      return res.status(400).json({ 
        ok: false,
        msg: 'Contaseña incorrecta'
      })
    }
    //Generar JWT
    const token = await generateJWT( user.id, user.name );
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch(error){
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor comuniquese con el administrador'
    })
  }
}

const tokenRevalidation = async(req, res = express.response) => {
  const { uid, name } = req;

  // Generar JWT
  const token = await generateJWT( uid, name );

  res.status(201).json({
    ok: true,
    token
  });
}

module.exports = {
  createUser,
  userLogin,
  tokenRevalidation
}


// Validacion solo como ejemplo, usaremos express-validator para realizar las validaciones.
  // if (name.length < 5) {
  //   return res.status(400).json({ 
  //     ok: false,
  //     msg: 'el nombre debe contener al menos 5 letras'
  //   })
  // }