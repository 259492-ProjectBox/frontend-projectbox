"use client";
import React from "react";
import {
	Paper,
	Box,
	Typography,
	TextField,
	Container,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Input,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Grid2 from "@mui/material/Grid2"; // Import Grid2

const CreateProject: React.FC = () => {
	const router = useRouter();

	return (
		<Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
			<Box sx={{ position: "sticky" }}>
				<Box sx={{ mb: 2, mt: 9, ml: 3 }}>
					<IconButton
						onClick={() => router.back()}
						sx={{
							color: "blue",
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.09)",
							},
						}}
					>
						<ArrowBackIcon />
						<Typography sx={{ ml: 1 }}>Back</Typography>
					</IconButton>
				</Box>
			</Box>

			<Container maxWidth="lg">
				<Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
					Create Project
				</Typography>

				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						borderRadius: 2,
						border: "1px solid #e0e0e0",
					}}
				>
					<Box sx={{ borderLeft: 4, borderColor: "#7b1818", pl: 2, mb: 3 }}>
						<Typography variant="h6">ภาควิชา</Typography>
					</Box>

					<Grid2 container spacing={3} sx={{ display: "flex" }}>
						<Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
							<FormControl fullWidth>
								<InputLabel>รหัสวิชา</InputLabel>
								<Select label="รหัสวิชา" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid2>
						<Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
							<FormControl fullWidth>
								<InputLabel>Section</InputLabel>
								<Select label="Section" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid2>
						<Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
							<FormControl fullWidth>
								<InputLabel>เทอม</InputLabel>
								<Select label="เทอม" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid2>
						<Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
							<FormControl fullWidth>
								<InputLabel>ปีการศึกษา</InputLabel>
								<Select label="ปีการศึกษา" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid2>
					</Grid2>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						borderRadius: 2,
						border: "1px solid #e0e0e0",
					}}
				>
					<Box sx={{ borderLeft: 4, borderColor: "#7b1818", pl: 2, mb: 3 }}>
						<Typography variant="h6">หัวข้อโปรเจ็ค</Typography>
					</Box>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField fullWidth label="ชื่อภาษาไทย" variant="outlined" />
						<TextField fullWidth label="ชื่อภาษาอังกฤษ" variant="outlined" />
					</Box>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: 3,
						borderRadius: 2,
						border: "1px solid #e0e0e0",
					}}
				>
					<Box sx={{ borderLeft: 4, borderColor: "#7b1818", pl: 2, mb: 3 }}>
						<Typography variant="h6">รายละเอียดโปรเจ็ค</Typography>
					</Box>

					<Box>
						<Typography variant="body2" sx={{ mb: 1 }}>
							คำนำ
						</Typography>
						<Input />
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default CreateProject;
