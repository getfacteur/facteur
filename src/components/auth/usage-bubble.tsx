import { InfoIcon } from "lucide-react";
import { useFixedUsage } from "#/queries/use-fixed-usage";
import { useMailUsage } from "#/queries/use-mail-usage";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const UsageBubble = () => {
	const { data: mailUsage } = useMailUsage();
	const { data: fixedUsage } = useFixedUsage();

	return (
		<Tooltip>
			<TooltipTrigger render={<Button size="icon" />}>
				<InfoIcon />
			</TooltipTrigger>
			<TooltipContent>
				<div className="flex flex-col">
					<span>
						Mail Credits: {mailUsage?.consumedUnits} /{" "}
						{mailUsage?.creditedUnits} ({mailUsage?.balance} remaining)
					</span>
					<span>
						Domains: {fixedUsage?.current_domains} / {fixedUsage?.max_domains}
					</span>
					<span>
						Providers: {fixedUsage?.current_providers} /{" "}
						{fixedUsage?.max_providers}
					</span>
				</div>
			</TooltipContent>
		</Tooltip>
	);
};
