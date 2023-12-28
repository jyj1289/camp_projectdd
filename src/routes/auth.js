  require("dotenv").config();
  const express = require("express");
  const router = express.Router();
  const models = require("../models");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  
  const { ROUNDS, JWT_SECRET } = process.env;
  const saltRounds = parseInt(ROUNDS);

  router.post("/signup", async (req, res) => {
      const {email, pw, nickname} = req.body;
      
      if(!email || !pw || !nickname){
          return res.status(400).json({ error: "이메일 혹은 비밀번호 혹은 닉네임이 입력되지 않았습니다. "})
      }

      const duplicateUser = await models.member.findOne({ where: { email: email } });
    if (duplicateUser) {
      return res.status(400).json({ error: "이미 등록된 이메일입니다." });
    }

    try {
      const hash = await bcrypt.hash(pw, saltRounds);
      await models.member.create({
        email: email,
        password: hash,
        nickname: nickname,
      });
      res.status(200).send({ message: "회원 가입이 완료되었습니다." });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "회원 가입이 실패했습니다." });
    }

  });

  router.post("/login", async (req, res) => {
      const { email, pw } = req.body;
    
      if (!email || !pw) {
        return res
          .status(400)
          .json({ error: "아이디 혹은 비밀번호가 입력되지 않았습니다." });
      }
    
      try {
        const user = await models.member.findOne({ where: { email: email } });
    
        if (!user) {
          return res.status(401).json({ error: "등록되지 않은 이메일입니다." });
        }
    
        const passwordMatch = await bcrypt.compare(pw, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
        }
    
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h", // 토큰 만료 시간
        });

        res.cookie('token', token);
        res.status(200).json({ token: token});
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "로그인이 실패했습니다." });
      }
    });

  // 사용자 인증 미들웨어
  const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
    }
    console.log(token)


    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log(decoded)
      console.log(token)
      next();
    } catch (err) {
      res.clearCookie('token');
      res.status(401).json({ error: "인증 실패"});
    }
  };

  module.exports = { router, authenticateUser };