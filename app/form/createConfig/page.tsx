"use client";
import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect } from "react";

const CreateConfigPage = () => {
	const [formConfig, setFormConfig] = useState<JSON | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Local state for creating a new form
	const [formTitle, setFormTitle] = useState<string>("New Form");
	const [fields, setFields] = useState<Array<{ name: string; type: string }>>([
		{ name: "", type: "text" },
	]);

	// Fetch the latest form configuration
	useEffect(() => {
		const fetchFormConfig = async () => {
			try {
				const response = await axiosInstance.get(`/api/formConfig`, {
					params: { courseId: 1 },
				});

				if (response.status != 200) {
					throw new Error("Failed to fetch form configuration");
				}

				const data = await response.data;
				setFormConfig(data);
			} catch (err) {
				console.error(err);
				setError("Error fetching form configuration");
			}
		};

		fetchFormConfig();
	}, []);

	const createFormConfig = async () => {
		try {
			const response = await axiosInstance.post(`/api/formConfig`, {
				courseId: 1, // Ensure courseId is a number
				formData: {
					title: formTitle,
					fields,
				},
			});

			console.log("Form configuration created:", response.data);
		} catch (err) {
			console.error("Error creating form configuration:", err);
			setError("Error creating form configuration");
		}
	};

	// Handlers for adding and removing fields
	const addField = () => {
		setFields([...fields, { name: "", type: "text" }]);
	};

	const removeField = (index: number) => {
		setFields(fields.filter((_, i) => i !== index));
	};

	const updateField = (index: number, key: "name" | "type", value: string) => {
		const updatedFields = [...fields];
		updatedFields[index][key] = value;
		setFields(updatedFields);
	};

	return (
		<div>
			<h1>Create Form Configuration</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}

			{/* Form Builder */}
			<div style={{ marginBottom: "20px" }}>
				<h2>Form Details</h2>
				<label>
					Form Title:{" "}
					<input
						type="text"
						value={formTitle}
						onChange={(e) => setFormTitle(e.target.value)}
						style={{ marginBottom: "10px", display: "block" }}
					/>
				</label>

				<h2>Fields</h2>
				{fields.map((field, index) => (
					<div key={index} style={{ marginBottom: "10px" }}>
						<input
							type="text"
							placeholder="Field Name"
							value={field.name}
							onChange={(e) => updateField(index, "name", e.target.value)}
							style={{ marginRight: "10px" }}
						/>
						<select
							value={field.type}
							onChange={(e) => updateField(index, "type", e.target.value)}
							style={{ marginRight: "10px" }}
						>
							<option value="text">Text</option>
							<option value="number">Number</option>
							<option value="date">Date</option>
							<option value="email">Email</option>
						</select>
						<button onClick={() => removeField(index)}>Remove</button>
					</div>
				))}

				<button onClick={addField}>Add Field</button>
			</div>

			{/* Submit Button */}
			<button onClick={createFormConfig}>Save Form Configuration</button>

			{/* Display the latest saved configuration */}
			{formConfig && (
				<div>
					<h2>Latest Form Configuration</h2>
					<pre>{JSON.stringify(formConfig, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default CreateConfigPage;
