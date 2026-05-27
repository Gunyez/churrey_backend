import House from "../models/House.js";

// export const createHouse = async (req, res) => {
//   try {
//     const newHouse = new House(req.body);
//     const savedHouse = await newHouse.save();
//     res.status(200).json(savedHouse);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

export const getHouses = async (req, res) => {
  try {
    const houses = await House.find();
    res.status(200).json(houses);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    res.status(200).json(house);
  } catch (err) {
    res.status(500).json(err);
  }
};

      // ADMIN CODE

export const createHouse = async (req, res) => {
  try {

    const imageUrls = req.files.map(
      (file) => file.path
    );

    const newHouse = new House({
      ...req.body,
      photos: imageUrls,
    });

    const savedHouse = await newHouse.save();

    res.status(201).json(savedHouse);

  } catch (err) {

    console.log(err);

    res.status(500).json("Failed to create house");
  }
};

// export const createHouse = async (req, res) => {
//   console.log("Body", req.body);
  
//   try {

//     const photoPaths = req.files.map(
//       (file) => `/uploads/${file.filename}`
//     );

//     const newHouse = new House({
//       title: req.body.title,
//       city: req.body.city,
//       price: req.body.price,
//       description: req.body.description,
//       photos: photoPaths,
//     });

//     const savedHouse = await newHouse.save();

//     res.status(201).json(savedHouse);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json("Failed to create house");
//   }
// };

export const updateHouse = async (req, res) => {
  try {
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedHouse);

  } catch (err) {
    res.status(500).json("Failed to update house");
  }
};

export const deleteHouse = async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);

    res.status(200).json("House deleted");

  } catch (err) {
    res.status(500).json("Failed to delete house");
  }
};

export const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();

    res.status(200).json(houses);

  } catch (err) {
    res.status(500).json("Failed to fetch houses");
  }
};