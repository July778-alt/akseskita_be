import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./categories-repository";

import { CreateCategoryDTO } from "./categories-types";

export async function createCategoryService(
  data: CreateCategoryDTO
) {
  return createCategory(data);
}

export async function getCategoriesService() {
  return getCategories();
}

export async function getCategoryByIdService(
  categoryId: string
) {
  const category =
    await getCategoryById(categoryId);

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  return category;
}

export async function updateCategoryService(
  categoryId: string,
  data: any
) {
  const category =
    await getCategoryById(categoryId);

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  return updateCategory(
    categoryId,
    data
  );
}

export async function deleteCategoryService(
  categoryId: string
) {
  const category =
    await getCategoryById(categoryId);

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  await deleteCategory(categoryId);
}