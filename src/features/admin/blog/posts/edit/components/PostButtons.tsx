import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export const PostButtons = ({
	handleDeletePost,
	handleOnSubmit,
}: {
	handleDeletePost: () => void;
	handleOnSubmit: () => Promise<boolean>;
}) => {
	const navigate = useNavigate();

	const handleSaveAndClose = async () => {
		const isSaved = await handleOnSubmit();
		if (!isSaved) return;
		await navigate({ to: "/admin/blog/posts" });
	};

	return (
		<>
			<Button
				type="button"
				variant="destructive"
				size="icon"
				onClick={handleDeletePost}
				className="cursor-pointer"
				aria-label="Delete post"
			>
				<Trash2 />
			</Button>
			<Button type="button" className="cursor-pointer" onClick={handleOnSubmit}>
				Save changes
			</Button>
			<Button type="button" variant="outline" onClick={handleSaveAndClose}>
				Save and Close
			</Button>
		</>
	);
};
