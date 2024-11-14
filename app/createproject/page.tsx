// app/components/create-project.tsx

import React from "react";
import {
	Paper,
	Box,
	Typography,
	TextField,
	Container,
	// AppBar,
	// Toolbar,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	// TextareaAutosize,
	// styled,
} from "@mui/material";

// const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
// 	width: "100%",
// 	minHeight: "150px",
// 	padding: "12px",
// 	borderRadius: "4px",
// 	border: "1px solid #ccc",
// 	fontFamily: theme.typography.fontFamily,
// 	fontSize: "16px",
// 	"&:focus": {
// 		outline: "none",
// 		borderColor: theme.palette.primary.main,
// 	},
// }));

const CreateProject: React.FC = () => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			{/* Navigation Bar */}
			{/* <AppBar
				position="static"
				sx={{
					bgcolor: "white",
					color: "black",
					boxShadow: 1,
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
						CMU ENG Project
					</Typography>

					<Box sx={{ display: "flex", gap: 2 }}>
						<Typography>Search Project</Typography>
						<Typography>My Project</Typography>
						<Typography>Advisor Stats</Typography>
					</Box>

					<Box sx={{ textAlign: "right" }}>
						<Typography variant="body2">Pichayoot Hunchainao</Typography>
						<Typography variant="body2" color="text.secondary">
							CPE64061053
						</Typography>
					</Box>
				</Toolbar>
			</AppBar> */}

			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
					Create Project
				</Typography>

				{/* Course Information Section */}
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

				{/* Project Title Section */}
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

				{/* Project Details Section */}
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
						{/* <StyledTextArea
							placeholder="Enter project details..."
							minRows={6}
						/> */}
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

export default CreateProject;
