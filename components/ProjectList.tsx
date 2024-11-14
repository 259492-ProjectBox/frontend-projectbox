// app/components/project-list.tsx

import React from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Typography,
	Box,
} from "@mui/material";
import {
	GitHub as GitHubIcon,
	YouTube as YouTubeIcon,
	Description as DescriptionIcon,
	Slideshow as SlideshowIcon,
	Edit as EditIcon,
} from "@mui/icons-material";
import { CustomTooltip } from "./CustomTooltip";

// Properly typed CustomTooltip

interface ResourceButtonProps {
	icon: React.ElementType;
	tooltip: string;
	color: string;
	onClick?: () => void;
}

// Resource button component with tooltip
const ResourceButton: React.FC<ResourceButtonProps> = ({
	icon: Icon,
	tooltip,
	color,
	onClick,
}) => (
	<CustomTooltip title={tooltip} placement="top" arrow>
		<IconButton
			size="small"
			onClick={onClick}
			sx={{
				bgcolor: color,
				color: "white",
				"&:hover": {
					bgcolor: color,
					transform: "translateY(-2px)",
					boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
				},
				transition: "all 0.2s ease-in-out",
			}}
		>
			<Icon fontSize="small" />
		</IconButton>
	</CustomTooltip>
);

interface TeamMember {
	name: string;
	id: string;
}

interface Project {
	projectNo: string;
	projectTitle: string;
	term: string;
	course: string;
	section: string;
	teamMembers: TeamMember[];
	advisor: string;
	resources: {
		presentation?: string;
		youtube?: string;
		report?: string;
		github?: string;
	};
}

const ProjectList: React.FC = () => {
	const projects: Project[] = [
		{
			projectNo: "S010-2/66",
			projectTitle: "Nursing Record",
			term: "2/2566",
			course: "264191",
			section: "10",
			teamMembers: [
				{ name: "ชัยยุทธ คันธีเนตร์", id: "640610653" },
				{ name: "เบญจพล พงษาวลีรัตน์", id: "640610630" },
				{ name: "ญาดา สาเมาะ", id: "640610304" },
			],
			advisor: "ผศ.ดร.เด่นดวง เมนะเศวต",
			resources: {
				presentation: "#",
				youtube: "#",
				report: "#",
				github: "#",
			},
		},
	];

	return (
		<Paper
			elevation={3}
			sx={{
				width: "100%",
				maxWidth: "1200px",
				mx: "auto",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					p: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
				}}
			>
				<Typography variant="h5" component="h2" fontWeight="bold">
					Project List
				</Typography>
			</Box>

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Project No.</TableCell>
							<TableCell>Project Title</TableCell>
							<TableCell>Team Member</TableCell>
							<TableCell>Advisor</TableCell>
							<TableCell>Resource</TableCell>
							<TableCell>Edit</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{projects.map((project) => (
							<TableRow
								key={project.projectNo}
								hover
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell>{project.projectNo}</TableCell>
								<TableCell>
									<Typography fontWeight="medium">
										{project.projectTitle}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Term {project.term}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Course {project.course}, Sec {project.section}
									</Typography>
								</TableCell>
								<TableCell>
									{project.teamMembers.map((member) => (
										<Typography key={member.id} variant="body2">
											{member.name} {member.id}
										</Typography>
									))}
								</TableCell>
								<TableCell>{project.advisor}</TableCell>
								<TableCell>
									<Box sx={{ display: "flex", gap: 1 }}>
										<ResourceButton
											icon={SlideshowIcon}
											tooltip="View Presentation"
											color="blue"
										/>
										<ResourceButton
											icon={YouTubeIcon}
											tooltip="Watch on YouTube"
											color="#d32f2f"
										/>
										<ResourceButton
											icon={DescriptionIcon}
											tooltip="View Report"
											color="#757575"
										/>
										<ResourceButton
											icon={GitHubIcon}
											tooltip="View Source Code"
											color="#000000"
										/>
									</Box>
								</TableCell>
								<TableCell>
									<CustomTooltip title="Edit project details" arrow>
										<Button
											variant="outlined"
											size="small"
											startIcon={<EditIcon />}
										>
											Edit
										</Button>
									</CustomTooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default ProjectList;
