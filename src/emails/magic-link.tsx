import {
	EmailButton,
	EmailLayout,
	EmailNotice,
	EmailSection,
	EmailText,
	EmailTitle,
} from "./components";

interface Props {
	url: string;
	email: string;
}

function MagicLink({ url, email }: Props) {
	return (
		<EmailLayout preview="Sign in to your Facteur account">
			<EmailSection>
				<EmailTitle>Sign in to Facteur</EmailTitle>
				<EmailText>We received a sign-in request for {email}.</EmailText>
				<EmailButton href={url}>Sign in</EmailButton>
				<EmailNotice>
					If you did not request this, you can ignore this email.
				</EmailNotice>
			</EmailSection>
		</EmailLayout>
	);
}

MagicLink.PreviewProps = {
	email: "test@example.com",
	url: "https://example.com/",
} satisfies Props;

export default MagicLink;
