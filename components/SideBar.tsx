// components/Sidebar.tsx
"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./Navbar";

const drawerWidth = 200;

export default function Sidebar({ children }: React.PropsWithChildren) {
	const router = useRouter();
	const pathname = usePathname();
	const { signOut } = useAuth();

	const menuItems = [
		{ text: "My Project", icon: <PersonIcon />, path: "/dashboard" },
		{ text: "Search Project", icon: <SearchIcon />, path: "/search" },
		{ text: "Advisor Stats", icon: <GroupsIcon />, path: "/advisor-stats" },
		{ text: "Logout", icon: <LogoutIcon />, path: "/logout" },
	];

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Navbar />
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						{menuItems.map((item) => (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									onClick={() => {
										if (item.text === "Logout") {
											signOut();
										} else {
											router.push(item.path);
										}
									}}
									sx={{
										backgroundColor:
											pathname === item.path ? "#D9D9D9" : "transparent",
										"&:hover": {
											backgroundColor:
												pathname === item.path ? "#D9D9D9" : undefined,
										},
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
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
