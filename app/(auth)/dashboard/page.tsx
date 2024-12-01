"use client";
import React from "react";
import ProjectList from "../../../components/ProjectList";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon

const projects = [
  {
    projectNo: "EE-S008-2/66",
    projectId: "252490",
    projectName: "Project Survey",
    description:
      "Survey and Analysis of Power Quality Issues in Local Electrical Grids. Power quality is a critical aspect of modern electrical systems, affecting both residential and industrial consumers. Common issues like voltage sags, swells, harmonic distortions, and interruptions can lead to equipment malfunctions, increased energy consumption, and operational costs.",
    students: [
      { id: "640610999", name: "ประยุทธ์ จันทร์โอชา" },
      { id: "640611000", name: "ประวิตร วงศ์สุวรรณ" },
      { id: "640611001", name: "ประเสริฐ จิระจันทน์" },
    ],
    committees: [
      { name: "ผศ. โดม โพธิกานนท์" },
      { name: "ผศ.ดร. บวรศักดิ์ คุมสินกิจ" },
      { name: "ผศ.ดร. ธนาทิพย์ จันทร์คิง" },
    ],
  },
  // Add more projects if needed
];

function Dashboard() {
  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb", // Equivalent to tailwind 'gray-50'
        minHeight: "100vh",
        padding: "2em",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1em",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ marginBottom: "0.3em" }}>
            Welcome, <span style={{ color: "#A10000" }}>Pichayoot</span>
          </Typography>
          <Typography variant="h6" sx={{ color: "#5B5B5B" }}>
            You have{" "}
            <span style={{ color: "#A10000", fontWeight: "bold" }}>
              {projects.length}
            </span>{" "}
            projects in your plate
          </Typography>
        </Box>
        <CustomTooltip title="Create a new project" arrow>
          <Button
            onClick={() => {
              router.push("../../createproject");
            }}
            variant="contained"
            sx={{
              color: "#A10000",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
              },
              fontWeight: "bold",
              padding: "0.5em 1.5em",
            }}
            startIcon={<AddIcon sx={{ color: "#A10000" }} />}
          >
            Create Project
          </Button>
        </CustomTooltip>
      </Box>

      {/* Projects List Section */}
      {projects.map((project, index) => (
        <Card
          key={index}
          sx={{
            marginBottom: "1.5em",
            border: "1px solid #d3d3d3", // 1px gray border
            borderRadius: "8px",
            boxShadow: "none", // Remove any shadow
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                marginBottom: "1em",
              }}
            >
              <Box sx={{ flex: 1, marginBottom: { xs: "1em", md: 0 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#A10000" }}
                >
                  Project No: {project.projectNo}
                </Typography>
                <Typography variant="h5">
                  {project.projectId} - {project.projectName}
                </Typography>
                <Typography variant="body1" sx={{ color: "#5B5B5B", marginTop: "0.5em" }}>
                  Survey and Analysis of Power Quality Issues in Local Electrical Grids
                </Typography>
              </Box>
              <Box sx={{ flex: 1, marginBottom: { xs: "1em", md: 0 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#148282" }}
                >
                  Student
                </Typography>
                {project.students.map((student) => (
                  <Typography key={student.id} variant="body2">
                    👤 {student.id} - {student.name}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#148282" }}
                >
                  Committees
                </Typography>
                {project.committees.map((committee, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">
                      👤 {committee.name}
                    </Typography>
                    {idx === project.committees.length - 1 && (
                      <Button
                        variant="text"
                        size="small"
                        sx={{ marginLeft: "0.5em", minWidth: "auto", padding: "0" }}
                      >
                        ✎
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: "#e0f2f1", // Equivalent to 'teal-50'
                padding: "1em",
                borderRadius: "8px",
                // border: "1px solid #d3d3d3", 
                marginTop: "1em",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#148282" }}
              >
                Project Description
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {project.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Dashboard;
