import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "#/components/data-table";
import { type Domain, useDomains } from "#/queries/use-domains";
import { DomainTableActions } from "./domain-table-actions";

const columnHelper = createColumnHelper<Domain>();

const columns = [
	columnHelper.accessor("domain", {
		cell: (info) => info.getValue(),
		header: "Domain",
	}),
	columnHelper.accessor("status", {
		cell: (info) => info.getValue(),
		header: "Status",
	}),
	columnHelper.display({
		id: "actions",
		cell: (props) => <DomainTableActions domainId={props.row.original.id} />,
	}),
];

export const DomainTable = () => {
	const { data } = useDomains();

	return (
		<div>
			<DataTable columns={columns} data={data ?? []} />
		</div>
	);
};
