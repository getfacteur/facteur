import {
	EmailButton,
	EmailLayout,
	EmailNotice,
	EmailSection,
	EmailText,
	EmailTitle,
} from "./components";

interface Props {
	domain: string;
	url: string;
}

function DomainInvalidated({ domain, url }: Props) {
	return (
		<EmailLayout preview={`${domain} is no longer verified`}>
			<EmailSection>
				<EmailTitle>Your domain needs attention</EmailTitle>
				<EmailText>
					The verification record for {domain} could not be confirmed during
					today&apos;s check.
				</EmailText>
				<EmailButton href={url}>Review domain</EmailButton>
				<EmailNotice>
					Check that the required TXT record still exists and matches the value
					shown in Facteur.
				</EmailNotice>
			</EmailSection>
		</EmailLayout>
	);
}

DomainInvalidated.PreviewProps = {
	domain: "example.com",
	url: "https://example.com/domains",
} satisfies Props;

export default DomainInvalidated;
