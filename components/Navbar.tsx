"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
	const { user } = useAuth();

	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				backgroundColor: "white",
				color: "black",
				boxShadow: "none",
				borderBottom: "1px solid #e0e0e0",
			}}
		>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					CMU ENG Project
				</Typography>
				<div>
					<Typography variant="subtitle1">
						{user?.firstName} {user?.lastName}
					</Typography>
					<Typography
						variant="subtitle2"
						sx={{ color: "gray", textAlign: "right" }}
					>
						{user?.studentId}
					</Typography>
				</div>
			</Toolbar>
		</AppBar>
	);
}
