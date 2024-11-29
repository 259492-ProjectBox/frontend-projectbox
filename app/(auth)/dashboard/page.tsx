"use client"
import React from "react";
import ProjectList from "../../../components/ProjectList";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Box, Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

const projects = [
  {
    projectNo: "EE-S008-2/66",
    projectId: "252490",
    projectName: "Project Survey",
    description: "Survey and Analysis of Power Quality Issues in Local Electrical Grids. Power quality is a critical aspect of modern electrical systems, affecting both residential and industrial consumers. Common issues like voltage sags, swells, harmonic distortions, and interruptions can lead to equipment malfunctions, increased energy consumption, and operational costs.",
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
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", margin: "1em 5em" }}>
        <Typography variant="h4">
          Welcome, Pichayoot
        </Typography>
        <CustomTooltip title="Create a new project" arrow>
          <Button
            onClick={() => {
              router.push("../../createproject");
            }}
            variant="contained"
            sx={{
              bgcolor: "#7b1818",
              "&:hover": {
                bgcolor: "#5a1212",
              },
            }}
          >
            CREATE PROJECT
          </Button>
        </CustomTooltip>
      </Box>
      <Box sx={{ margin: "2em 5em" }}>
        <Typography variant="h6" sx={{ marginBottom: "1em" }}>
          You have {projects.length} projects in your plate
        </Typography>
        {projects.map((project, index) => (
          <Card key={index} sx={{ marginBottom: "1.5em" }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Project No: {project.projectNo}
                  </Typography>
                  <Typography variant="h5">
                    {project.projectId} - {project.projectName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Student
                  </Typography>
                  {project.students.map((student) => (
                    <Typography key={student.id} variant="body2">
                      👤 {student.id} - {student.name}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Committees
                  </Typography>
                  {project.committees.map((committee, idx) => (
                    <Typography key={idx} variant="body2">
                      👤 {committee.name}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginTop: "1em" }}>
                    Project Description
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {project.description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default Dashboard;
