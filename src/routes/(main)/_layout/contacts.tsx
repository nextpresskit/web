import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ClockIcon,
	ExternalLinkIcon,
	HelpCircleIcon,
	MailIcon,
	MapPinIcon,
	MessageCircleIcon,
	PhoneIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import { CONTACT_FAQ_ITEMS, HOURS, OFFICE } from "#/content/site";

export const Route = createFileRoute("/(main)/_layout/contacts")({
	component: ContactsPage,
});

const contactFormSchema = z.object({
	name: z.string().trim().min(2, "Please enter your name."),
	email: z.string().trim().email("Enter a valid email address."),
	subject: z.string().trim().min(3, "Add a short subject."),
	message: z
		.string()
		.trim()
		.min(20, "Tell us a bit more (at least 20 characters)."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactsPage() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	function onSubmit(values: ContactFormValues) {
		// Replace with your API route or form service (Formspree, etc.).
		console.info("Contact form:", values);
		setSubmitted(true);
		form.reset();
	}

	return (
		<main className="container mx-auto max-w-6xl px-4 py-10">
			<header className="mb-10 space-y-2">
				<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
					Contact
				</p>
				<h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
					Let’s build something together
				</h1>
				<p className="max-w-2xl text-muted-foreground text-lg leading-relaxed">
					Whether you have a product question, a partnership idea, or just want
					to say hello—we read every message and reply as soon as we can.
				</p>
			</header>

			{submitted && (
				<Alert className="mb-10">
					<MessageCircleIcon className="size-4" aria-hidden />
					<AlertTitle>Message sent</AlertTitle>
					<AlertDescription>
						Thanks for reaching out. This is a demo form (check the browser
						console for the payload). Wire it to your backend when you are
						ready.
					</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">Visit & reach us</CardTitle>
							<CardDescription>
								Studio hours, postal address, and direct lines.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex gap-3">
								<MapPinIcon
									className="mt-0.5 size-5 shrink-0 text-muted-foreground"
									aria-hidden
								/>
								<div className="space-y-1">
									<p className="font-medium text-sm">{OFFICE.name}</p>
									<address className="not-italic text-muted-foreground text-sm leading-relaxed">
										{OFFICE.addressLines.map((line) => (
											<span key={line} className="block">
												{line}
											</span>
										))}
									</address>
									<Button variant="link" className="h-auto p-0" asChild>
										<a
											href={OFFICE.mapsSearch}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-sm"
										>
											Open in maps
											<ExternalLinkIcon className="size-3.5" aria-hidden />
										</a>
									</Button>
								</div>
							</div>

							<Separator />

							<ul className="space-y-4">
								<li className="flex gap-3">
									<PhoneIcon
										className="mt-0.5 size-5 shrink-0 text-muted-foreground"
										aria-hidden
									/>
									<div>
										<p className="font-medium text-sm">Phone</p>
										<a
											href={OFFICE.phoneHref}
											className="text-muted-foreground text-sm hover:text-foreground hover:underline"
										>
											{OFFICE.phoneDisplay}
										</a>
									</div>
								</li>
								<li className="flex gap-3">
									<MailIcon
										className="mt-0.5 size-5 shrink-0 text-muted-foreground"
										aria-hidden
									/>
									<div>
										<p className="font-medium text-sm">Email</p>
										<a
											href={OFFICE.emailHref}
											className="text-muted-foreground text-sm hover:text-foreground hover:underline"
										>
											{OFFICE.emailDisplay}
										</a>
									</div>
								</li>
							</ul>

							<Separator />

							<div className="flex gap-3">
								<ClockIcon
									className="mt-0.5 size-5 shrink-0 text-muted-foreground"
									aria-hidden
								/>
								<div className="min-w-0 flex-1 space-y-2">
									<p className="font-medium text-sm">Office hours</p>
									<dl className="space-y-1.5 text-sm">
										{HOURS.map((row) => (
											<div
												key={row.days}
												className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4"
											>
												<dt className="text-muted-foreground">{row.days}</dt>
												<dd className="font-medium sm:text-right">
													{row.hours}
												</dd>
											</div>
										))}
									</dl>
								</div>
							</div>

							<Separator />

							<div>
								<p className="mb-2 font-medium text-sm">Social</p>
								<Button variant="outline" size="sm" asChild>
									<a
										href={OFFICE.github}
										target="_blank"
										rel="noopener noreferrer"
										className="gap-2"
									>
										<svg
											className="size-4 shrink-0"
											viewBox="0 0 24 24"
											fill="currentColor"
											aria-hidden
										>
											<title>GitHub</title>
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										GitHub
									</a>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="border-dashed bg-muted/30">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Before you write</CardTitle>
							<CardDescription>
								You might find an answer faster in these places.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-2 text-sm">
							<Button
								variant="link"
								className="h-auto justify-start p-0"
								asChild
							>
								<Link to="/blog">Browse articles & guides</Link>
							</Button>
							<Button
								variant="link"
								className="h-auto justify-start p-0"
								asChild
							>
								<Link to="/about">About the team</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				<Card className="lg:sticky lg:top-6">
					<CardHeader>
						<CardTitle className="text-xl">Send a message</CardTitle>
						<CardDescription>
							All fields are required. We never sell your information.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-5"
								noValidate
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Jordan Lee"
													autoComplete="name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="you@example.com"
													autoComplete="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="subject"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Subject</FormLabel>
											<FormControl>
												<Input
													placeholder="Partnership, support, press…"
													autoComplete="off"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea
													placeholder="What would you like to know?"
													className="min-h-32"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full sm:w-auto"
									disabled={form.formState.isSubmitting}
								>
									Send message
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>

			<section
				className="mt-16 space-y-4"
				aria-labelledby="contact-faq-heading"
			>
				<div className="flex items-start gap-3">
					<HelpCircleIcon
						className="mt-1 size-5 shrink-0 text-muted-foreground"
						aria-hidden
					/>
					<div>
						<h2
							id="contact-faq-heading"
							className="font-semibold text-xl tracking-tight"
						>
							Common questions
						</h2>
						<p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-relaxed">
							Quick answers about response times, meetings, and visits.
						</p>
					</div>
				</div>
				<Accordion type="single" collapsible className="w-full">
					{CONTACT_FAQ_ITEMS.map((item, i) => (
						<AccordionItem value={`faq-${i}`} key={item.q}>
							<AccordionTrigger className="text-left">
								{item.q}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed">
								{item.a}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
		</main>
	);
}
