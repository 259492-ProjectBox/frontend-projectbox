"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const drawerWidth = 200;

export default function SideBar({ children }: React.PropsWithChildren) {
	const router = useRouter();
	const pathname = usePathname();

	const menuItems = [
		{ text: "My Project", icon: <PersonIcon />, path: "/me" },
		{ text: "Search Project", icon: <SearchIcon />, path: "/search-project" },
		{ text: "Advisor Stats", icon: <GroupsIcon />, path: "/advisor-stats" },
		{ text: "Logout", icon: <LogoutIcon />, path: "/logout" },
	];

	function signOut() {
		axios.post("/api/signOut").finally(() => {
			router.push("/");
		});
	}

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
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
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
						CMU ENG Project
					</Typography>
					<Typography variant="h6" noWrap sx={{ fontWeight: "normal" }}>
						CMU ENG Project
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						borderRight: "1px solid #e0e0e0",
						paddingTop: "20px",
					},
				}}
			>
				<Box sx={{ overflow: "auto", textAlign: "center" }}>
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: "bold", marginBottom: 2 }}
					>
						CMU ENG Project
					</Typography>
					<List>
						{menuItems.map((item) => (
							<ListItem
								key={item.text}
								disablePadding
								sx={{
									"& .MuiListItemButton-root": {
										fontWeight: pathname === item.path ? "bold" : "normal",
										color: pathname === item.path ? "black" : "gray",
									},
								}}
							>
								<ListItemButton
									onClick={() => {
										if (item.text === "Logout") {
											signOut(); // Call signOut if Logout is clicked
										} else {
											router.push(item.path); // Navigate to path for other items
										}
									}}
								>
									<ListItemIcon
										sx={{
											color: pathname === item.path ? "black" : "gray",
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}
