import { useQueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import type { FC } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { useAppForm } from "#/hooks/use-app-form";
import { domainListQueryPrefix } from "#/queries/domain-query-keys";
import { useCreateDomain } from "#/queries/use-create-domain";

interface Props {
	open: boolean;
	setOpen: (v: boolean) => void;
}

const validator = type({
	domain: "string > 1",
});

export const DomainDialog: FC<Props> = ({ open, setOpen }) => {
	const { mutateAsync } = useCreateDomain();
	const queryClient = useQueryClient();
	const form = useAppForm({
		defaultValues: {
			domain: "",
		},
		validators: {
			onChange: validator,
			onSubmit: validator,
		},
		onSubmit: async ({ value }) => {
			await mutateAsync(value.domain);
			await queryClient.invalidateQueries({
				queryKey: domainListQueryPrefix,
				exact: false,
			});
			setOpen(false);
			toast("Created Domain");
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
