import { useQueryClient } from "@tanstack/react-query";
import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { domainListQueryPrefix } from "#/queries/domain-query-keys";
import { useDeleteDomain } from "#/queries/use-delete-domain";
import { useVerifyDomain } from "#/queries/use-verify-domain";

interface Props {
	domainId: string;
}

export const DomainTableActions: FC<Props> = ({ domainId }) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutateAsync: triggerVerifyDomain, isPending: verifyPending } =
		useVerifyDomain();
	const { mutateAsync: deleteDomain, isPending: deletePending } =
		useDeleteDomain();

	const handleVerify = async () => {
		await triggerVerifyDomain(domainId);
	};

	const handleDelete = () => {
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		await deleteDomain(domainId);
		await queryClient.invalidateQueries({
			queryKey: domainListQueryPrefix,
			exact: false,
		});
		toast.success("Domain Deleted");
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
					<MoreVerticalIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem disabled={verifyPending} onClick={handleVerify}>
							Verify
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuGroup>
						<DropdownMenuItem
							disabled={deletePending}
							variant="destructive"
							onClick={handleDelete}
						>
							<Trash2Icon />
							Delete
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this domain?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action is irreversible. You will no longer be able to use
							this domain with any Facteur Relay providers
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							variant="destructive"
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
