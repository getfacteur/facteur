import type { ReactNode } from "react";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "react-email";

interface EmailLayoutProps {
	preview: string;
	children: ReactNode;
}

interface ChildrenProps {
	children: ReactNode;
}

interface EmailTextProps extends ChildrenProps {
	muted?: boolean;
}

interface EmailButtonProps extends ChildrenProps {
	href: string;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
	return (
		<Tailwind>
			<Html lang="en">
				<Head />
				<Preview>{preview}</Preview>
				<Body className="m-0 bg-slate-50 px-4 py-10 font-sans text-slate-950">
					<Container className="mx-auto w-full max-w-xl">
						<EmailHeader />
						<Container className="rounded-lg border border-slate-200 bg-white">
							{children}
						</Container>
						<EmailFooter />
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}

export function EmailHeader() {
	return (
		<Section className="pb-5 text-center">
			<Text className="m-0 text-sm font-semibold tracking-wide text-slate-950">
				Facteur
			</Text>
			<Text className="m-0 mt-1 text-xs text-slate-500"></Text>
		</Section>
	);
}

export function EmailSection({ children }: ChildrenProps) {
	return <Section className="px-8 py-8">{children}</Section>;
}

export function EmailTitle({ children }: ChildrenProps) {
	return (
		<Heading className="m-0 text-2xl font-semibold leading-8 text-slate-950">
			{children}
		</Heading>
	);
}

export function EmailText({ children, muted = false }: EmailTextProps) {
	return (
		<Text
			className={
				muted
					? "m-0 text-sm leading-6 text-slate-500"
					: "m-0 text-base leading-7 text-slate-700"
			}
		>
			{children}
		</Text>
	);
}

export function EmailButton({ href, children }: EmailButtonProps) {
	return (
		<Section className="py-6 text-center">
			<Button
				className="rounded-md bg-yellow-500 px-5 py-3 text-sm font-semibold text-white"
				href={href}
			>
				{children}
			</Button>
		</Section>
	);
}

export function EmailNotice({ children }: ChildrenProps) {
	return (
		<Section className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
			<EmailText muted>{children}</EmailText>
		</Section>
	);
}

export function EmailDivider() {
	return <Hr className="my-6 border-slate-200" />;
}

export function EmailFooter() {
	return (
		<Section className="px-6 pt-5 text-center">
			<Text className="m-0 text-xs leading-5 text-slate-500"></Text>
		</Section>
	);
}
