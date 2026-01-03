const validateEditProfiledata = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid fields in profile update");
  }

  if (req.body.age && req.body.age < 18) {
    throw new Error("Age must be at least 18");
  }

  if (
    req.body.gender &&
    !["Male", "Female", "Other"].includes(req.body.gender)
  ) {
    throw new Error("Invalid gender value");
  }

  return true;
};

module.exports = { validateEditProfiledata };
