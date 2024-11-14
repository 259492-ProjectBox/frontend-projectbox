"use client";
import React from "react";
import ProjectList from "../../../components/ProjectList";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
function Dashboard() {
	const router = useRouter();
	return (
		<>
			<Box
				sx={{ display: "flex", justifyContent: "right", marginRight: "5em" }}
			>
				<CustomTooltip title="Create a new project" arrow>
					<Button
						onClick={() => {
							router.push("../../createproject"); // Navigate to path for other items
						}}
						variant="contained"
						sx={{
							bgcolor: "#7b1818",
							"&:hover": {
								bgcolor: "#5a1212",
							},
						}}
					>
						Create Project
					</Button>
				</CustomTooltip>
			</Box>
			<ProjectList />
		</>
	);
}

export default Dashboard;
