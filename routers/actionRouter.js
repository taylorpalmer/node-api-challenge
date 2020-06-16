const express = require("express");
const actions = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/", (req, res, next) => {
  actions
    .get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  actions
    .get(req.params.id)
    .then((action) => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({
          message: "The action could not be found",
        });
      }
    })
    .catch(next);
});

router.post("/:id/actions", validateAction, (req, res, next) => {
  if (!req.body.project_id) {
    req.body.project_id = req.params.id;
  }
  actions
    .insert(req.body)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch(next);
});

router.delete("/:id", validateActionId, (req, res, next) => {
  actions
    .remove(req.params.id)
    .then((success) => {
      if (success === 1) {
        res.status(200).json({
          message: "Action deleted",
        });
      } else {
        return res.status(500).json({
          message: "Action could not be deleted",
        });
      }
    })
    .catch(next);
});

router.put("/", validateActionId, validateAction, (req, res, next) => {
  actions
    .update(req.params.id, req.body)
    .then((action) => {
      return res.status(200).json(action);
    })
    .catch(next);
});

//middleware//
function validateAction() {
  return (req, res, next) => {
    if (!req.body || !req.body.project_id || !req.body.description) {
      res.status(400).json({
        message: "Action information incomplete. All fields required.",
      });
    } else {
      next();
    }
  };
}

function validateActionId() {
  return (req, res, next) => {
    actions
      .get(req.params.id)
      .then((action) => {
        if (action) {
          req.action = action;

          next();
        } else {
          res.status(400).json({
            message: "Invalid action id",
          });
        }
      })

      .catch(next);
  };
}

module.exports = router;
