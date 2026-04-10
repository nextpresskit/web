import categoriesData from "@/dummy_data/admin/blog_categoires_list.json";
import { blogCategoryListItemSchema } from "@/features/admin/blog/schema";
import { BlogCategoriesTableAdmin } from "./BlogCategoriesTableAdmin";

const data = blogCategoryListItemSchema.array().parse(categoriesData);

/** TanStack Router `Link` `to` for opening the category editor from this list. */
export const adminBlogCategoryEditTo = "/admin/blog/categories/$categoryId" as const;

export const AdminBlogCategoriesList = () => {
	return (
		<BlogCategoriesTableAdmin
			data={data}
			categoryEditTo={adminBlogCategoryEditTo}
		/>
	);
};
