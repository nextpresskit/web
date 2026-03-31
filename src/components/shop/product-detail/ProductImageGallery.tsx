import { useState } from "react";

import { cn } from "#/lib/utils";

type ProductImageGalleryProps = {
	images: string[];
	productName: string;
};

export function ProductImageGallery({
	images,
	productName,
}: ProductImageGalleryProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const safeImages = images.length > 0 ? images : [];
	const activeSrc = safeImages[activeIndex] ?? "";

	return (
		<div className="space-y-4">
			<div
				className="bg-muted relative aspect-4/3 w-full overflow-hidden rounded-xl border shadow-sm"
				role="img"
				aria-label={`${productName} — image ${activeIndex + 1} of ${safeImages.length}`}
			>
				{activeSrc ? (
					<img
						src={activeSrc}
						alt=""
						className="size-full object-cover"
						decoding="async"
						fetchPriority="high"
					/>
				) : (
					<div className="text-muted-foreground flex size-full items-center justify-center text-sm">
						No image
					</div>
				)}
			</div>
			{safeImages.length > 1 ? (
				<ul
					className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4"
					aria-label="Product gallery thumbnails"
				>
					{safeImages.map((src, index) => (
						<li key={src}>
							<button
								type="button"
								onClick={() => setActiveIndex(index)}
								className={cn(
									"focus-visible:ring-ring w-full overflow-hidden rounded-lg border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
									index === activeIndex
										? "border-primary ring-primary/20 ring-2"
										: "border-transparent hover:border-muted-foreground/25",
								)}
								aria-current={index === activeIndex}
								aria-label={`Show image ${index + 1}`}
							>
								<img
									src={src}
									alt=""
									className="aspect-square w-full object-cover"
									decoding="async"
									loading="lazy"
								/>
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
