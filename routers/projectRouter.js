const express = require("express");
const projects = require("../data/helpers/projectModel");

const router = express.Router();

router.post("/", validateProject, (req, res, next) => {
  projects
    .insert(req.body)
    .then((project) => {
      if (project) {
        res.status(201).json({
          message: "Project successfully added",
        });
      }
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  projects
    .get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  projects
    .get(req.params.id)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: "The project could not be found",
        });
      }
    })
    .catch(next);
});

router.get("/:id/actions", validateProjectId, (req, res, next) => {
  projects
    .getProjectActions(req.params.id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch(next);
});

router.delete("/:id", validateProjectId, (req, res, next) => {
  projects
    .remove(req.params.id)
    .then((success) => {
      if (success === 1) {
        res.status(200).json({
          message: "Project deleted",
        });
      } else {
        res.status(404).json({
          message: "The project could not be deleted",
        });
      }
    })

    .catch(next);
});

router.put("/:id", validateProjectId, validateProject, (req, res, next) => {
  projects
    .update(req.params.id, req.body)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: "The project could not be found",
        });
      }
    })

    .catch(next);
});

//Middleware//
function validateProject() {
  return (req, res, next) => {
    if (!req.body || !req.body.name || !req.body.description) {
      res.status(400).json({
        message: "Project information incomplete. All fields required.",
      });
    } else {
      next();
    }
  };
}

function validateProjectId() {
  return (req, res, next) => {
    projects
      .get(req.params.id)
      .then((project) => {
        if (project) {
          next();
        } else {
          res.status(400).json({
            message: "Invalid project id",
          });
        }
      })
      .catch(next);
  };
}

module.exports = router;
