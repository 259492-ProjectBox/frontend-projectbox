import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

export const CustomTooltip = styled(
	({ className, ...props }: TooltipProps & { className?: string }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	)
)(() => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#000",
		color: "#fff",
		fontSize: 13,
		padding: "8px 12px",
		borderRadius: 4,
	},
}));
