import Favourite from "../models/favourite.model.js";

// GET 
export async function listFavourites(req, res, next) {
  try {
    const docs = await Favourite.find({ userId: req.user.sub }).sort({
      createdAt: -1,
    });
    res.json(docs.map((d) => ({ id: d.id, item: d.item })));
  } catch (e) {
    next(e);
  }
}

// POST
export async function addFavourite(req, res, next) {
  try {
    const { item } = req.body;
    if (!item || !item.id)
      return res.status(400).json({ error: "item with id required" });

    const exists = await Favourite.findOne({
      userId: req.user.sub,
      "item.id": item.id,
    });
    if (exists)
      return res.status(200).json({ id: exists.id, item: exists.item });

    const doc = await Favourite.create({ userId: req.user.sub, item });
    res.status(201).json({ id: doc.id, item: doc.item });
  } catch (e) {
    next(e);
  }
}

// DELETE
export async function removeFavourite(req, res, next) {
  try {
    const { itemId } = req.params;
    const doc = await Favourite.findOneAndDelete({
      userId: req.user.sub,
      "item.id": Number(itemId),
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
