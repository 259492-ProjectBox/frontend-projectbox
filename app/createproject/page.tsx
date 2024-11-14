"use client";
import React from "react";
import {
	Paper,
	Box,
	Typography,
	TextField,
	Container,
	AppBar,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const CreateProject: React.FC = () => {
	const router = useRouter();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="static"
				sx={{
					bgcolor: "white",
					color: "black",
					boxShadow: 1,
				}}
			/>

			<Container maxWidth="lg" sx={{ mt: 9 }}>
				{/* Back Button */}
				<Box sx={{ mb: 2 }}>
					<IconButton
						onClick={() => router.back()}
						sx={{
							color: "black",
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.04)",
							},
						}}
					>
						<ArrowBackIcon />
						<Typography sx={{ ml: 1 }}>Back</Typography>
					</IconButton>
				</Box>

				<Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
					Create Project
				</Typography>

				{/* Rest of your components remain the same */}
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

					<Grid container spacing={3}>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<InputLabel>รหัสวิชา</InputLabel>
								<Select label="รหัสวิชา" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<InputLabel>Section</InputLabel>
								<Select label="Section" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<InputLabel>เทอม</InputLabel>
								<Select label="เทอม" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<InputLabel>ปีการศึกษา</InputLabel>
								<Select label="ปีการศึกษา" value="">
									<MenuItem value="">Select</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
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
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default CreateProject;
