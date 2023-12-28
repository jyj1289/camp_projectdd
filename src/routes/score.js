// grades.js (성적 관련 라우트 파일)

const express = require("express");
const router = express.Router();
const models = require("../models");
const { authenticateUser } = require("./auth");

// 성적 등록
router.post("/add", authenticateUser, async (req, res) => {
  // 인증된 사용자만 접근 가능
  const {email, score} = req.body;

  try {
    // 여기에서 사용자 ID에 해당하는 데이터베이스 작업 수행
    // models.Grade.create({ userId, score, ... });
    const member = await models.member.findOne({where: {email : email}});
    member.score = score;
    member.save()
    res.status(200).json({ message: "성적 등록이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "성적 등록이 실패했습니다." });
  }
});

// 성적 조회
router.get("/view", authenticateUser, async (req, res) => {
  // 인증된 사용자만 접근 가능
; // authenticateUser 미들웨어를 통해 사용자 정보를 얻을 수 있음

  try {
    // 여기에서 사용자 ID에 해당하는 데이터베이스 작업 수행
    // const grades = await models.Grade.findAll({ where: { userId } });
    // res.status(200).json(grades);
    const members = await models.member.findAll({
        attributes: ['nickname', 'score'],
        order: [['score', 'DESC']] 
    })
    res.status(200).json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "성적 조회가 실패했습니다." });
  }
});

module.exports = router;
