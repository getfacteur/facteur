import { type } from "arktype";
import { type FC, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { useAppForm } from "#/hooks/use-app-form";
import { useCreateDomain } from "#/queries/use-create-domain";

const validator = type({
	domain: "string > 1",
});

export const DomainDialog: FC = () => {
	const [open, setOpen] = useState(false);
	const { mutateAsync } = useCreateDomain();
	const form = useAppForm({
		defaultValues: {
			domain: "",
		},
		validators: {
			onChange: validator,
			onSubmit: validator,
		},
		onSubmit: async ({ value }) => {
			try {
				await mutateAsync(value.domain);
				form.reset();
				setOpen(false);
			} catch {}
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button />}>Add</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a domain</DialogTitle>
					<DialogDescription>Fill out the form and enjoy</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField name="domain">
						{(field) => <field.TextField label="domain name" />}
					</form.AppField>
					<DialogFooter>
						<form.Subscribe
							selector={({ isValid, isSubmitting }) => ({
								isValid,
								isSubmitting,
							})}
						>
							{({ isValid, isSubmitting }) => (
								<>
									<DialogClose
										render={<Button type="button">Close</Button>}
										disabled={isSubmitting}
									/>
									<Button type="submit" disabled={isSubmitting || !isValid}>
										Create
									</Button>
								</>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
