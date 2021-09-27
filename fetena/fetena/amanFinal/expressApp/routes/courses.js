var express = require("express");
var router = express.Router();
const cors = require("cors");

router.get("/email", (req, res) => {
  console.log("emaickshckdkjl", req.query.email);
  req.db
    .collection("test")
    .findOne({ email: req.query.email })
    .then((data) => {
      console.log(data);
      // let latestPosts = data.Students.switch_request_students.sort((a, b) =>
      //   a.post_date > b.post_date ? 1 : -1
      // );
      // let desired_course = { desired_course: req.params.course_name };
      // let response = latestPosts.concat(desired_course);
      // let current_students = data.Students.current_students;
      // response.push(current_students);

      res.json({ status: "ok", result: data });
    })
    .catch((err) => console.log(err));
});

//Get list of courses
router.get("/", (req, res) => {
  // req.db
  //   .collection("test")
  //   .find()
  //   //.project({ name_of_course: 1 })
  //   .toArray()
  //   .then((data) => {
  //     res.json({ status: "success", result: data });
  //   })
  //   .catch((err) => {
  //     res.json({ status: "Error", description: err });
  //   });
});

//latest post
router.get("/:course_name", (req, res) => {
  // console.log("email", req.email, req.name);
  req.db
    .collection("test")
    .findOne({ name_of_course: req.params.course_name })
    .then((data) => {
      let latestPosts = data.Students.switch_request_students.sort((a, b) =>
        a.post_date > b.post_date ? 1 : -1
      );
      let desired_course = { desired_course: req.params.course_name };
      let response = latestPosts.concat(desired_course);
      let current_students = data.Students.current_students;
      response.push(current_students);

      res.json({ status: "ok", result: response });
    })
    .catch((err) => console.log(err));
});

//post a new switch request
router.post("/:course_name", (req, res) => {
  console.log("reeeeeeeee", req.email, req.name);
  req.db
    .collection("test")
    .findOne({ name_of_course: req.params.course_name })
    .then((data) => {
      let payload = {};
      let date = new Date();
      payload.post_date = date;
      payload.name = req.name;
      payload.email = req.email;
      payload.current_course = req.body.current_course;
      payload.message = req.body.message;

      req.db
        .collection("MIU-CSR")
        .findOne(
          { "Students.switch_request_students.email": req.email }
          //   { arrayFilters: [{ "d.email": req.email }] }
        )
        .then((data) => {
          if (data) {
            //    console.log("amanueeeeeeeeeee", data);
            //    res.json({ status: "success", result: data });

            res.json({ status: "you can't create another request" });
          } else {
            req.db.collection("MIU-CSR").updateOne(
              {
                name_of_course: req.params.course_name,
                // "Students.switch_request_students": { name: { $ne: req.name } },
              },
              { $push: { "Students.switch_request_students": payload } }
            );
            res.json({ status: "updated" });
            req.db
              .collection("MIU-CSR")
              .updateOne(
                { name_of_course: req.params.course_name },
                { $inc: { request_counter: 1 } }
              );
          }
        });
    })
    .catch((err) => {
      res.json({ Status: err });
    });
});
//delete course from switch-request-students
router.delete("/:course_name", (req, res) => {
  req.db
    .collection("test")
    .findOne({ name_of_course: req.params.course_name })
    .then((data) => {
      req.db
        .collection("test")
        .updateOne(
          { name_of_course: req.params.course_name },
          { $pull: { "Students.switch_request_students": { name: req.name } } }
        );
      res.json({ status: "deleted" });
    })
    .catch((err) => {
      res.json({ Status: err });
    });
  req.db
    .collection("MIU-CSR")
    .updateOne(
      { name_of_course: req.params.course_name },
      { $inc: { request_counter: -1 } }
    );
});

//update course from switch-request-students
router.patch("/:course_name", (req, res) => {
  console.log("req.body.current_course", req.body.current_course);
  req.db
    .collection("MIU-CSR")
    .findOne({ name_of_course: req.params.course_name })
    .then((data) => {
      req.db
        .collection("MIU-CSR")
        .updateOne(
          {
            name_of_course: req.params.course_name,
          },
          {
            $set: {
              "Students.switch_request_students.$[d].current_course":
                req.body.current_course,
            },
          },
          {
            arrayFilters: [{ "d.name": req.name }],
          }
        )
        .then((data) => {
          res.json({ status: "updated" });
        });
    })
    .catch((err) => {
      res.json({ Status: err });
    });
});

module.exports = router;
