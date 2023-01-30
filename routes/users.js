const express=require("express");
const {users} = require("../data/users.json");//{users} is from the users key inside the users.json file & require is similar to import

const router=express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      data: users
  
    })
  });
  
  /**
   * Route: /:id
   * Method: get
   * Description: getting a user by their id
   * Access: Public
   * Parmanters: id
   */
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
      res.status(404).json({ message: "user not found", success: "false" })
    } else {
      res.status(200).json({ data: user, success: "true" })
    }
  });
  
  
  /**
   * Route: /:id
   * Method: POST
   * Description: create user
   * Access: Public
   * Parmanters: none
   */
  router.post("/", (req, res) => {
    const { id, name, surname, email, issuedBook, issuedDate, returnDate, subscriptionType, subscriptionDate } = req.body;
    const user = users.find((each) => each.id === id);
    if (!user) {
      users.push({ id, name, surname, email, issuedBook, issuedDate, returnDate, subscriptionType, subscriptionDate });
      res.status(201).json({ data: users, success: "true" })
    } else {
      res.status(404).json({ message: "user found", success: "false" })
    }
  });
  
  
  /**
   * Route: /:id
   * Method: Put
   * Description: update user
   * Access: Public
   * Parmanters: none
   */
  
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user = users.find((each) => each.id === id);
  
    if (!user)
      return res.status(404).json({ success: false, message: "User Not Found" });
  
    const UpdatedUser = users.map((each) => {
      if (each.id === id) {
        return {
          ...each,
          ...data,
        };
      }
      return each;
    });
    return res.status(200).json({
      success: true,
      data: UpdatedUser,
    });
  });
  
  /**
   * Route: /:id
   * Method: delete
   * Description: delrte user
   * Access: Public
   * Parmanters: id
   */
  
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User to be deleted is not found",
      });
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
  
    return res.status(200).json({ success: true, data: users });
  });
  
  router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
  
    const user = users.find((each) => each.id === id);
  
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
  
    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        // current data
        date = new Date();
      } else {
        // getting date on basics of variable
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };
  
    const subscriptionType = (date) => {
      if (user.subscriptionType === "Basic") {
        date = date + 90;
      } else if (user.subscriptionType === "Standard") {
        date = date + 180;
      } else if (user.subscriptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };
    // subscription calc here
    // Jan 1, 1970
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    const data = {
      ...user,
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 200
            : 100
          : 0,
    };
    return res.status(200).json({ success: true, data });
  });

  module.exports = router;