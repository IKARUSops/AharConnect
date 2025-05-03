const Item = require('../models/itemModel');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { item_name, category, price, description, image, item_status } = req.body;
    const item = new Item({ item_name, category, price, description, image, item_status });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { item_name, category, price, description, image, item_status } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { item_name, category, price, description, image, item_status },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};