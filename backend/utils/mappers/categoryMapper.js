const mapCategory = (category) => {
  if (!category) return null

  return {
    id: category._id.toString(),
    name: category.name,
    type: category.type,
    published: category.published,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

const mapCategories = (categories = []) => categories.map(mapCategory)

module.exports = { mapCategory, mapCategories }