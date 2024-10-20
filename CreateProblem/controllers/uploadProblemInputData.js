import mongoose from "mongoose";

import {
  Problem,
  ProblemStatus,
  problemStatusString,
  InputData,
  InputDataTemplate,
  Result,
} from "../database/index.js";

import { validateJsonFile, typeOfExtended } from "../utils/index.js";

/**
 * Upload an input data file a problem submission
 * @param {string} req.params.id Problem's unique ID
 * @param {string} req.files.inputData Input data file to be uploaded
 *
 * @returns Message about success or failure of the uploaded file
 */
export const uploadProblemInputData = async (req, res) => {
  try {
    // Validate inputs
    if (!req.params.id || req.params.id === "") {
      return res.status(400).json({ message: "No problem ID was selected" });
    }

    const files = req.files;
    if (!files || !files.inputData || files.inputData.length === 0) {
      return res
        .status(400)
        .json({ message: "No input file was uploaded (key 'inputData')" });
    }

    const fileBuffer = files.inputData[0].buffer;

    // Get authorized user's ID & problem ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
    const problemId = mongoose.Types.ObjectId.createFromHexString(
      req.params.id
    );

    // Get problem's info from the DB and validate it belongs to this user (unless user is admin)
    let problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ message: "The requested problem does not exist" });
    }

    if (!req.user.isAdmin && !problem.userId.equals(userId)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this problem" });
    }

    if (
      problem.status !== ProblemStatus.NOT_READY &&
      problem.status !== ProblemStatus.READY
    ) {
      const problemStatus = problemStatusString(problem.status);
      return res.status(400).json({
        message: `Cannot upload new input for a submission with status '${problemStatus}'`,
      });
    }

    // Get the required input fields for the problem's model
    const requiredInputFields = await InputDataTemplate.find({
      modelId: problem.modelId,
    });
    const requiredInputFieldsNames = requiredInputFields.map(
      (input) => input.name
    );

    // Validate the input file's structure and whether it contains all required inputs
    const parsedInputData = validateJsonFile(
      fileBuffer,
      requiredInputFieldsNames
    );
    if (typeof parsedInputData === "string") {
      return res.status(400).json({ message: parsedInputData });
    }

    // Validate the type of all values
    for (const requiredInput of requiredInputFields) {
      const { name, type } = requiredInput;
      const value = parsedInputData[name];
      const valueType = typeOfExtended(value);
      if (valueType !== type) {
        return res.status(400).json({
          message: `Incorrect type '${valueType}' (${value}) instead of '${type}' for field '${name}'`,
        });
      }
    }

    // Check if there is already an uploaded input in order to replace
    let inputData = await InputData.findOne({ problemId });
    if (inputData === null) {
      inputData = new InputData({
        problemId,
        data: JSON.stringify(parsedInputData),
      });
    } else {
      inputData.data = JSON.stringify(parsedInputData);
      inputData.error = null;
      inputData.submittedOn = new Date();
    }
    await inputData.save();

    // Update the status of the problem to "Ready"
    problem.status = ProblemStatus.READY;
    await problem.save();

    // Delete the existing result (if any)
    await Result.deleteOne({ problemId });

    return res
      .status(200)
      .json({ message: "Input file was uploaded successfully" });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
