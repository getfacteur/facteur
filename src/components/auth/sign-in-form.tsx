import { useForm } from "@tanstack/react-form";
import {
	ArrowLeftIcon,
	KeyRoundIcon,
	MailCheckIcon,
	MailIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { Spinner } from "#/components/ui/spinner";
import { authClient } from "#/lib/auth-client";

interface SignInFormProps {
	callbackError?: string;
}

const GENERIC_AUTH_ERROR = "Something went wrong. Please try again.";

export function SignInForm({ callbackError }: SignInFormProps) {
	const emailInputRef = useRef<HTMLInputElement>(null);
	const [sentEmail, setSentEmail] = useState<string>();
	const [passkeyPending, setPasskeyPending] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onMount: (): string | undefined => {
				if (!callbackError) return undefined;
				console.error("Authentication callback failed", callbackError);
				return GENERIC_AUTH_ERROR;
			},
			onSubmit: (): string | undefined => undefined,
		},
		onSubmitInvalid: () => emailInputRef.current?.focus(),
		onSubmit: async ({ value, formApi }) => {
			const email = value.email.trim();

			try {
				const result = await authClient.signIn.magicLink({
					callbackURL: "/app",
					email,
					errorCallbackURL: "/sign-in",
				});

				if (result.error) {
					console.error("Magic link sign-in failed", result.error);
					formApi.setErrorMap({ onSubmit: GENERIC_AUTH_ERROR });
					return;
				}

				setSentEmail(email);
			} catch (error) {
				console.error("Magic link sign-in failed", error);
				formApi.setErrorMap({ onSubmit: GENERIC_AUTH_ERROR });
			}
		},
	});

	async function handlePasskeySignIn() {
		clearFormErrors();
		form.setFieldMeta("email", (meta) => ({
			...meta,
			errorMap: {},
		}));

		if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
			console.error("Passkey sign-in is not supported by this browser");
			form.setErrorMap({ onSubmit: GENERIC_AUTH_ERROR });
			return;
		}

		setPasskeyPending(true);

		try {
			const result = await authClient.signIn.passkey();

			if (result.error) {
				console.error("Passkey sign-in failed", result.error);
				form.setErrorMap({ onSubmit: GENERIC_AUTH_ERROR });
				return;
			}

			window.location.assign("/app");
		} catch (error) {
			console.error("Passkey sign-in failed", error);
			form.setErrorMap({ onSubmit: GENERIC_AUTH_ERROR });
		} finally {
			setPasskeyPending(false);
		}
	}

	function resetEmail() {
		form.reset();
		setSentEmail(undefined);
		requestAnimationFrame(() => emailInputRef.current?.focus());
	}

	function clearFormErrors() {
		form.setErrorMap({ onMount: undefined, onSubmit: undefined });
	}

	if (sentEmail) {
		return (
			<div className="flex flex-col gap-6" aria-live="polite">
				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium text-muted-foreground">
						One more step
					</p>
					<h1 className="text-3xl font-semibold tracking-tight">
						Check your inbox
					</h1>
					<p className="max-w-sm text-sm leading-6 text-muted-foreground">
						We sent a secure sign-in link to <strong>{sentEmail}</strong>. The
						link expires in five minutes.
					</p>
				</div>

				<Alert>
					<MailCheckIcon />
					<AlertTitle>Magic link sent</AlertTitle>
					<AlertDescription>
						Open the email on this device to continue to Facteur.
					</AlertDescription>
				</Alert>

				<Button type="button" variant="outline" onClick={resetEmail}>
					<ArrowLeftIcon data-icon="inline-start" />
					Use a different email
				</Button>
			</div>
		);
	}

	return (
		<form.Subscribe
			selector={(state) => [state.isSubmitting, state.errors[0]] as const}
		>
			{([isSubmitting, authError]) => {
				const isBusy = isSubmitting || passkeyPending;

				return (
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-muted-foreground">
								Welcome back
							</p>
							<h1 className="text-3xl font-semibold tracking-tight">
								Sign in to Facteur
							</h1>
							<p className="max-w-sm text-sm leading-6 text-muted-foreground">
								Use your email or a passkey to continue. New here? Your email
								link will create your account.
							</p>
						</div>

						{typeof authError === "string" ? (
							<Alert variant="destructive" aria-live="assertive">
								<TriangleAlertIcon />
								<AlertTitle>We could not sign you in</AlertTitle>
								<AlertDescription>{authError}</AlertDescription>
							</Alert>
						) : null}

						<div className="flex flex-col gap-6">
							<form
								noValidate
								onSubmit={(event) => {
									event.preventDefault();
									event.stopPropagation();
									void form.handleSubmit();
								}}
							>
								<FieldGroup>
									<form.Field
										name="email"
										validators={{
											onSubmit: ({ value }) => validateEmail(value),
										}}
									>
										{(field) => {
											const emailError = getFieldError(field.state.meta.errors);
											const isInvalid = emailError !== undefined;

											return (
												<Field data-invalid={isInvalid} data-disabled={isBusy}>
													<FieldLabel htmlFor={field.name}>
														Email address
													</FieldLabel>
													<Input
														ref={emailInputRef}
														id={field.name}
														name={field.name}
														type="email"
														autoComplete="email"
														placeholder="you@company.com"
														required
														disabled={isBusy}
														aria-invalid={isInvalid}
														aria-describedby={
															isInvalid ? "email-error" : undefined
														}
														className="h-10"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(event) => {
															clearFormErrors();
															field.handleChange(event.target.value);
														}}
													/>
													<FieldError id="email-error">{emailError}</FieldError>
												</Field>
											);
										}}
									</form.Field>

									<Field>
										<Button
											type="submit"
											size="lg"
											disabled={isBusy}
											className="w-full"
										>
											{isSubmitting ? (
												<Spinner data-icon="inline-start" />
											) : (
												<MailIcon data-icon="inline-start" />
											)}
											{isSubmitting
												? "Sending magic link..."
												: "Continue with email"}
										</Button>
									</Field>
								</FieldGroup>
							</form>

							<div
								className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
								aria-hidden="true"
							>
								<Separator />
								<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
									or
								</span>
								<Separator />
							</div>

							<Field data-disabled={isBusy}>
								<Button
									type="button"
									variant="outline"
									size="lg"
									disabled={isBusy}
									className="w-full"
									onClick={handlePasskeySignIn}
								>
									{passkeyPending ? (
										<Spinner data-icon="inline-start" />
									) : (
										<KeyRoundIcon data-icon="inline-start" />
									)}
									{passkeyPending
										? "Waiting for passkey..."
										: "Continue with passkey"}
								</Button>
								<FieldDescription>
									Use a passkey already saved to this account.
								</FieldDescription>
							</Field>
						</div>
					</div>
				);
			}}
		</form.Subscribe>
	);
}

function validateEmail(email: string) {
	const normalizedEmail = email.trim();
	if (!normalizedEmail) return "Enter your email address.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
		return "Enter a valid email address, such as name@example.com.";
	}
	return undefined;
}

function getFieldError(errors: unknown[]) {
	const error = errors[0];
	return typeof error === "string" ? error : undefined;
}
