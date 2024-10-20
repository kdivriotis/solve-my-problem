//addProblem.js

import mongoose from "mongoose";

import {
  Model,
  MetadataTemplate,
  Problem,
  ProblemMetadata,
  ProblemStatus,
  InputData,
  InputDataTemplate,
} from "../database/index.js";

// Function to save problem to the database
const saveProblem = async (name, userId, modelId, file, metadata) => {
  try {
    // Create Problem record
    const problem = new Problem({
      userId: userId,
      modelId: modelId,
      name: name,
      submittedOn: new Date(),
      status: ProblemStatus.NOT_READY,
    });
    await problem.save();
    console.log("Problem collection ok:");

    // Create InputData record
    const inputData = new InputData({
      problemId: problem._id,
      data: file,
    });
    await inputData.save();
    console.log("InputData collection ok:");

    // Create ProblemMetadata records
    for (const name in metadata) {
      const template = await MetadataTemplate.findOne({
        modelId: modelId,
        name,
      });

      const problemMetadata = new ProblemMetadata({
        problemId: problem._id,
        metadataId: template._id,
        value: metadata[name],
      });
      await problemMetadata.save();
    }
    console.log("ProblemMetadata collection ok:");

    return problem;
  } catch (error) {
    console.error("Error saving problem:", error);
    throw error;
  }
};

export const addProblem = async (req, res) => {
  try {
    //get the name, modelId, metadata from request fields (form-data)
    const fields = req.body;
    const modelId = fields.modelId;
    const name = fields.name;
    const metadata = JSON.parse(fields.metadata);

    //get the input data from the request file
    const files = req.files;
    const file = JSON.parse(files.inputData[0].buffer.toString());
    // console.log("name:", name);
    // console.log("modelId:", modelId);
    // console.log("file:", file);
    // console.log("metadata:", metadata);

    // Get authorized user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const actualmodelId = mongoose.Types.ObjectId.createFromHexString(modelId);
    const modelExists = await Model.findById(actualmodelId);
    if (!modelExists) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    // Check if the name is empty
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Invalid or missing name" });
    }
    // Check if the name already exists for this user
    const nameExists = await Problem.findOne({ userId, name: name });
    if (nameExists) {
      return res
        .status(400)
        .json({ message: "Problem name already exists for this user" });
    }
    // Validate Input against the InputDataTemplate schema
    for (const [name, value] of Object.entries(file)) {
      const template = await InputDataTemplate.findOne({
        modelId: actualmodelId,
        name,
      });
      if (!template) {
        return res
          .status(400)
          .json({ message: `Invalid input data field name: ${name}` });
      }
      if (
        typeof value !== template.type &&
        !(template.type === "array" && Array.isArray(value))
      ) {
        return res.status(400).json({
          message: `Invalid value type for input data field: ${name}`,
        });
      }
    }
    // Validate metadata against the MetadataTemplate schema
    for (const name in metadata) {
      const template = await MetadataTemplate.findOne({
        modelId: actualmodelId,
        name,
      });
      if (!template) {
        return res
          .status(400)
          .json({ message: `Invalid metadata template: ${name}` });
      }
      if (typeof metadata[name] !== template.type) {
        return res
          .status(400)
          .json({ message: `Invalid value type for template: ${name}` });
      }
    }
      // Generate a valid  JWT token
      // const token = jwt.sign(
      //   { user: { id: req.user.id } },
      //   process.env.JWT_SECRET,
      //   { expiresIn: '1h' }
      // );
      

      // try {
      //   // Make a request to check user credits
      //   const creditResponse = await axios.get(`http://credit-management:9001/api/${userId}`, {
      //     headers: {
      //      'Cookie': `token=${token}` // Pass the JWT in the Cookie header,
      //     },
      //   });

      //   const userCredits = creditResponse.data.credits;
      //   if (userCredits < 1) {
      //     return res.status(403).json({ message: "Insufficient credits" });
      //   }
      // } catch (error) {
      //   console.error("Error checking credits:", error);
      //   return res.status(500).json({ message: "Error checking credits" });
      // }



    // Save the problem
    try {
      const newProblem = await saveProblem(
        name,
        userId,
        actualmodelId,
        JSON.stringify(file),
        metadata
      );

      console.log("Problem Saved");
      newProblem.status = ProblemStatus.READY;
      await newProblem.save();
      console.log("Problem is ready now READY");
      res.status(201).json({ problemId: newProblem._id.toHexString() });
    } catch (error) {
      console.error("Error saving problem:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
