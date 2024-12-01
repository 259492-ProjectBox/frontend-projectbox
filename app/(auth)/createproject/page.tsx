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
  Button,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

const CreateProject: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, pt: 3, pb: 3, minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Create Project
        </Typography>

        {/* Project Detail Section */}
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
            <Typography variant="h6">Project Detail</Typography>
          </Box>

          {/* Department Fields */}
          <Grid2 container spacing={3} sx={{ mb: 3 }}>
            <Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>
                <Select label="Course" value="">
                  <MenuItem value="">Select Course to create project</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Section</InputLabel>
                <Select label="Section" value="">
                  <MenuItem value="">Select</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>เทอม</InputLabel>
                <Select label="เทอม" value="">
                  <MenuItem value="">Select</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 sx={{ flexBasis: 0, flexGrow: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>ปีการศึกษา</InputLabel>
                <Select label="ปีการศึกษา" value="">
                  <MenuItem value="">Select</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          {/* Project Title Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Project Title (EN) <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField fullWidth variant="outlined" size="small" />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Project Title (TH) <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField fullWidth variant="outlined" size="small" />
            </Box>
          </Box>

          {/* Project Abstract Fields */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Abstract
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter abstract"
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
          </Box>
        </Paper>

        {/* Project Advisor Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ borderLeft: 3, borderColor: "#7b1818", pl: 1.5, mb: 2 }}>
            <Typography variant="subtitle1">Project Advisor</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body2">Add Advisor</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Advisor ID or Name"
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#148282",
                  "&:hover": { bgcolor: "#106a6a" },
                }}
                size="small"
              >
                Add
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Student(s) Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ borderLeft: 3, borderColor: "#7b1818", pl: 1.5, mb: 2 }}>
            <Typography variant="subtitle1">Student(s)</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body2">Add Student</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Student ID e.g. 6x0123456"
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#148282",
                  "&:hover": { bgcolor: "#106a6a" },
                }}
                size="small"
              >
                Add
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Files Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ borderLeft: 3, borderColor: "#7b1818", pl: 1.5, mb: 2 }}>
            <Typography variant="subtitle1">File(s)</Typography>
          </Box>

          {/* File Upload Fields */}
          {["Poster", "Draft Report", "Final Report", "Final Presentation"].map(
            (label, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {label} <span style={{ color: "red" }}>(max 25 MB)</span>
                </Typography>
                <TextField
                  type="file"
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            )
          )}

          {/* Link Embed Fields */}
          {["YouTube", "GitHub Repo"].map((label, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {label} Link
              </Typography>
              <TextField
                type="url"
                fullWidth
                variant="outlined"
                size="small"
                placeholder={`Enter ${label} link`}
              />
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateProject;
